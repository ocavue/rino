import { Mark, Node, Schema } from "prosemirror-model"
import { Transaction } from "prosemirror-state"
import { Mappable, Transform } from "prosemirror-transform"
import { EditorView } from "prosemirror-view"

import { iterNode, iterNodeRange } from "../../utils"
import { fromInlineMarkdown } from "./from-inline-markdown"
import { InlineDecorateType } from "./inline-types"

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
            const markType = schema.marks[markName]
            if (!markType) throw new Error(`failed to find mark type: ${markName}`)
            return markType.create(token.attrs)
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
 * Update the inline marks.
 *
 * Notice that this function may change the selection, which may be unexpected.
 */
export function updateNodeMarks<S extends Schema>(tr: Transform<S>, node: Node<S>, startPos: number): void {
    if (!node.isTextblock) {
        for (const [child, offset] of iterNode(node)) {
            updateNodeMarks(tr, child, startPos + offset + 1)
        }
    } else {
        const schema = tr.doc.type.schema
        const steps: MarkStep<S>[] = parseNode(schema, node, startPos)
        if (steps.length === 0) {
            return
        }

        const textNodes: Node[] = steps.map((step) => schema.text(step.text, step.marks))
        tr.replaceWith(steps[0].start, steps[steps.length - 1].end, textNodes)

        // Another way to apply marks, which might be more reliable and won't change the selection but less efficient
        // when the number of "steps" is large.
        // Just put it as a backup.
        //
        // for (const step of steps) {
        //     tr.removeMark(step.start, step.end, undefined)
        //     for (const mark of step.marks) {
        //         tr.addMark(step.start, step.end, mark)
        //     }
        // }
    }
}

/**
 * Apply markdown marks to current selection range.
 */
export function applyRangeMarks<S extends Schema>(view: EditorView<S>, forceUpdateAll?: boolean): void {
    if (view.isDestroyed) return

    const tr = view.state.tr
    if (updateRangeMarks(tr, forceUpdateAll)) {
        view.dispatch(tr)
    }
}

export function updateRangeMarks(tr: Transaction, forceUpdateAll?: boolean): boolean {
    tr.setMeta("RINO_APPLY_MARKS", true)

    const { $from, $to } = tr.selection
    const range = $from.blockRange($to)
    const oldSelection = tr.selection

    if (!range || forceUpdateAll) {
        updateNodeMarks(tr, tr.doc, 0)
    } else {
        for (const [child, pos] of iterNodeRange(range)) {
            updateNodeMarks(tr, child, pos)
        }
    }

    if (tr.docChanged) {
        tr.setSelection(oldSelection.map(tr.doc, unchangedMappable))
        return true
    }
    return false
}
