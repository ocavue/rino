import { PlainExtension } from "@remirror/core"
import { Mark, Node, Schema } from "prosemirror-model"
import { Plugin } from "prosemirror-state"
import { Mappable } from "prosemirror-transform"
import { EditorView } from "prosemirror-view"

import { WysiwygSchema } from "src/editor/components/wysiwyg/wysiwyg-manager"
import { InlineLexer } from "src/editor/extensions/inline/inline-lexer"
import { iterNode, iterNodeRange } from "src/editor/utils"

import { InlineDecorateType, InlineToken } from "./inline-types"

const inlineLexer = new InlineLexer()
const maxMarkStep = 10

// https://spec.commonmark.org/0.29/#ascii-punctuation-character
const markdownPunctuationCharacter = /[\!\"\#\$\%\&\'\(\)\*\+\,\-\.\/\:\;\<\=\>\?\@\[\\\]\^\_\`\{\|\}\~\s]/

type MarkStep<S extends Schema = any> = {
    start: number
    end: number
    marks: Mark<S>[]
    text: string
}

/**
 * Parse a text block node and return an array of MarkStep objects.
 *
 * This function will compare the current marks and expected marks so only those marks
 * who need to be applied will be returned.
 *
 * @param schema
 * @param node A text block node
 * @param startPos The (absolute) position at the start of the node
 */
function parseTextBlock(schema: Schema, node: Node<Schema>, startPos: number): MarkStep<Schema>[] {
    if (!node.textContent) {
        return []
    }
    const steps: MarkStep[] = []
    const tokens: InlineToken[] = inlineLexer.scan(node.textContent, 1)
    if (tokens.length === 0) {
        return []
    }

    let markStartPos = 0 // The start position of next mark, relative to the parent text block node

    // Since `node` is a text block node, all its children are inline nodes (text node for example).
    // `children` is in ascending order on child position.
    const children = Array.from(iterNode(node)).map(([node, offset, index]) => ({
        node,
        from: offset,
        to: offset + node.nodeSize,
    }))

    for (const token of tokens) {
        const [expectedFrom, expectedTo] = [markStartPos, markStartPos + token.text.length]
        const expectedMarks: Mark[] = token.marks.map((name) =>
            schema.marks[name].create(token.attrs),
        )
        markStartPos += token.text.length

        let needStep = true

        // Try to find an exited text node who match the expected mark
        while (children.length) {
            const { node: child, from: receivedFrom, to: receivedTo } = children[0]

            if (
                receivedFrom === expectedFrom &&
                receivedTo === expectedTo &&
                Mark.sameSet(child.marks, expectedMarks)
            ) {
                // Successfully found a expected inline node. Don't need to create a step in this case.
                needStep = false
                children.shift()
                break
            } else if (receivedFrom < expectedFrom) {
                // Abandon the first item in children and continue the loop to try to find a expected inline node
                children.shift()
                continue
            } else {
                // Failed to find a match child node since all children forward has bigger position then the
                // expected position.
                break
            }
        }

        if (needStep)
            steps.push({
                start: startPos + expectedFrom,
                end: startPos + expectedTo,
                marks: expectedMarks,
                text: token.text,
            })
    }

    return steps
}

function parseNode<S extends WysiwygSchema>(
    schema: S,
    node: Node<S>,
    startPos: number,
): MarkStep<S>[] {
    if (node.attrs.inlineDecorateType === InlineDecorateType.Ignore) {
        return []
    }

    const steps: MarkStep[] = []
    if (node.isTextblock) {
        steps.push(...parseTextBlock(schema, node, startPos))
    } else {
        node.forEach((child: Node<S>, offset: number, index: number) => {
            steps.push(...parseNode(schema, child, startPos + offset + 1))
        })
    }
    return steps
}

/**
 * A Mappbale object to return the position unchanged.
 */
const unchangedMappable: Mappable = {
    map: (pos: number) => {
        return pos
    },
    mapResult: (pos: number) => {
        return { pos, deleted: false }
    },
}

/**
 * Parse the text content from a Prosemirror node and dispatch a transaction to apply markdown marks to this Node.
 *
 * @param view The EditorView object
 * @param node The Prosemirror node to parse
 * @param startPos The (absolute) position at the start of the node
 */
function applyMarksToNode<S extends WysiwygSchema>(
    view: EditorView<S>,
    node: Node<S>,
    startPos: number,
) {
    const tr = view.state.tr

    if (!node.isTextblock) {
        for (const [child, offset] of iterNode(node)) {
            applyMarksToNode(view, child, startPos + offset + 1)
        }
        return
    } else {
        const schema = view.state.schema
        const steps: MarkStep<S>[] = parseNode(schema, node, startPos)
        if (steps.length === 0) {
            return
        }

        // TODO: I'm not sure the performance different between the two methods below.
        if (steps.length < maxMarkStep) {
            for (const step of steps) {
                // tr.maybeStep(new RemoveMarkStep())
                // tr.maybeStep(new AddMarkStep())
                tr.removeMark(step.start, step.end, undefined)
                step.marks.map((mark) => tr.addMark(step.start, step.end, mark))
            }
            view.dispatch(tr)
        } else {
            const textNodes: Node[] = steps.map((step) => schema.text(step.text, step.marks))
            const originSelection = view.state.selection
            tr.replaceWith(steps[0].start, steps[steps.length - 1].end, textNodes)
            const newSelection = originSelection.map(tr.doc, unchangedMappable)
            tr.setSelection(newSelection)
            view.dispatch(tr)
        }
    }
}

/**
 * Apply markdown marks.
 *
 * @param view The EditorView object
 */
function applyMarksToCurrentNode<S extends WysiwygSchema>(view: EditorView<S>) {
    const { $from, $to } = view.state.selection
    const range = $from.blockRange($to)
    if (!range) {
        applyMarksToNode(view, view.state.doc, 0)
    } else {
        for (const [child, pos] of iterNodeRange(range)) {
            applyMarksToNode(view, child, pos)
        }
    }
}

const createInlineMarkPlugin = (testing = false) => {
    let marksTimeoutId: ReturnType<typeof setTimeout> | null = null

    const debounceApplyMarks: (view: EditorView) => void = testing
        ? applyMarksToCurrentNode
        : (view: EditorView) => {
              if (marksTimeoutId) {
                  clearTimeout(marksTimeoutId)
              }
              marksTimeoutId = setTimeout(() => {
                  applyMarksToCurrentNode(view)
                  marksTimeoutId = null
              }, 50)
          }

    const plugin = new Plugin({
        state: {
            init: (config, state) => {},
            apply: () => {},
        },
        props: {
            handleTextInput(view, from, to, text) {
                if (text && markdownPunctuationCharacter.test(text)) {
                    debounceApplyMarks(view)
                }
                return false
            },
            handlePaste(view, event, slice) {
                debounceApplyMarks(view)
                return false
            },
            handleDrop(view) {
                debounceApplyMarks(view)
                return false
            },
        },
        view: (view: EditorView) => {
            // This function will be called when the editor is initializing.
            setTimeout(() => {
                if (!testing) {
                    applyMarksToNode(view, view.state.doc, 0)
                }
            }, 0)
            return {}
        },
    })

    return plugin
}

export class RinoInlineMarkExtension extends PlainExtension {
    #testing: boolean

    public constructor(testing = false) {
        super()
        this.#testing = testing
    }

    get name() {
        return "inlineMark" as const
    }

    createKeymap() {
        return {
            // "Mod-b": toggleMark(type),
        }
    }

    createPlugin() {
        return createInlineMarkPlugin(this.#testing)
    }
}
