import { PlainExtension } from "@remirror/core"
import { Mark, Node, Schema } from "prosemirror-model"
import { PluginSpec } from "prosemirror-state"
import { Mappable } from "prosemirror-transform"
import { EditorView } from "prosemirror-view"

import { iterNode, iterNodeRange } from "../../utils"
import { fromInlineMarkdown } from "./from-inline-markdown"
import { InlineDecorateType } from "./inline-types"

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
    const tokens = fromInlineMarkdown(node.textContent)

    // Since `node` is a text block node, all its children are inline nodes (text node for example).
    // `children` is in ascending order on child position.
    const children = Array.from(iterNode(node)).map(([node, offset, index]) => ({
        node,
        from: offset,
        to: offset + node.nodeSize,
    }))

    for (const token of tokens) {
        const expectedFrom = token.start
        const expectedTo = token.end
        const expectedMarks = token.marks.map((markName) => {
            return schema.marks[markName].create(token.attrs)
        })
        let needStep = true

        // Try to find an exited text node who match the expected mark
        while (children.length) {
            const { node: childNode, from: receivedFrom, to: receivedTo } = children[0]

            if (receivedFrom === expectedFrom && receivedTo === expectedTo && Mark.sameSet(childNode.marks, expectedMarks)) {
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

        if (needStep) {
            steps.push({
                start: startPos + expectedFrom,
                end: startPos + expectedTo,
                marks: expectedMarks,
                text: token.text,
            })
        }
    }
    return steps
}

function parseNode<S extends Schema>(schema: S, node: Node<S>, startPos: number): MarkStep<S>[] {
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
function applyMarksToNode<S extends Schema>(view: EditorView<S>, node: Node<S>, startPos: number) {
    const tr = view.state.tr.setMeta("RINO_APPLY_MARKS", true)

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
function applyMarksToCurrentNode<S extends Schema>(view: EditorView<S>) {
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

function createInlineMarkPlugin(testing = false): PluginSpec {
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

    const pluginSpec: PluginSpec = {
        state: {
            init: () => {},
            apply: () => {},
        },
        props: {
            handleTextInput(view: EditorView, from: number, to: number, text: string) {
                if (text && markdownPunctuationCharacter.test(text)) {
                    debounceApplyMarks(view)
                }
                return false
            },
            handlePaste(view: EditorView) {
                debounceApplyMarks(view)
                return false
            },
            handleDrop(view: EditorView) {
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
    }

    return pluginSpec
}

export class RinoInlineMarkExtension extends PlainExtension {
    // The editor will not "debounce" when `#testing` is true. Used in unit tests.
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
