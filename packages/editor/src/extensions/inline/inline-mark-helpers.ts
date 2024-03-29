import { EditorSchema, ProsemirrorNode } from "@remirror/pm"
import { Node, Schema } from "@remirror/pm/model"
import { Transaction } from "@remirror/pm/state"
import { Transform } from "@remirror/pm/transform"
import { EditorView } from "@remirror/pm/view"

import { BatchSetMarkStep, MarkChunk } from "../../steps/batch-mark-step"
import { iterNode, iterNodeRange } from "../../utils/iter-node"
import { fromInlineMarkdown } from "./from-inline-markdown"
import { InlineDecorateType } from "./inline-types"

/**
 * Parse a text block node and return an array of MarkChunk objects.
 *
 * This function will compare the current marks and expected marks so only those marks
 * who need to be applied will be returned.
 *
 * @param schema
 * @param node A text block node
 * @param startPos The (absolute) position at the start of the node
 */
function parseTextBlock(schema: Schema, node: Node, startPos: number, output: MarkChunk[]): void {
    if (!node.textContent) {
        return
    }
    const tokens = fromInlineMarkdown(node.textContent)

    for (const token of tokens) {
        const expectedMarks = token.marks.map((markName) => {
            return schema.marks[markName].create(token.attrs)
        })
        output.push([startPos + token.start, startPos + token.end, expectedMarks])
    }
}

function parseNode(schema: EditorSchema, node: Node, startPos: number, output: MarkChunk[]): void {
    if (node.attrs.inlineDecorateType === InlineDecorateType.Ignore) {
        return
    }

    if (node.isTextblock) {
        parseTextBlock(schema, node, startPos, output)
    } else {
        node.forEach((child: Node, offset: number, index: number) => {
            parseNode(schema, child, startPos + offset + 1, output)
        })
    }
}

/**
 * Update the inline marks.
 *
 * Notice that this function may change the selection, which may be unexpected.
 */
function updateNodeMarks(tr: Transform, node: Node, startPos: number, output: MarkChunk[]): void {
    if (!node.isTextblock) {
        for (const [child, offset] of iterNode(node)) {
            updateNodeMarks(tr, child, startPos + offset + 1, output)
        }
    } else {
        const schema = tr.doc.type.schema
        parseNode(schema, node, startPos, output)
    }
}

/**
 * Return a new document with all inline marks updated.
 */
export function initDocMarks(doc: ProsemirrorNode): ProsemirrorNode {
    const tr = new Transform(doc)
    const output: MarkChunk[] = []
    updateNodeMarks(tr, doc, 0, output)
    if (output.length) {
        tr.step(new BatchSetMarkStep(output))
    }
    return tr.doc
}

/**
 * Apply markdown marks to current selection range.
 */
export function applySelectionMarks(view: EditorView): void {
    if (view.isDestroyed) return

    const tr = view.state.tr
    tr.setMeta("addToHistory", false)
    if (updateRangeMarks(tr)) {
        view.dispatch(tr)
    }
}

/**
 * Apply markdown marks to current document.
 */
export function applyDocMarks(view: EditorView): void {
    if (view.isDestroyed) return

    const tr = view.state.tr
    if (updateRangeMarks(tr, true)) {
        view.dispatch(tr)
    }
}

export function updateRangeMarks(tr: Transaction, forceUpdateAll?: boolean): boolean {
    tr.setMeta("RINO_APPLY_MARKS", true)

    const { $from, $to } = tr.selection
    const range = $from.blockRange($to)

    const output: MarkChunk[] = []
    if (!range || forceUpdateAll) {
        updateNodeMarks(tr, tr.doc, 0, output)
    } else {
        for (const [child, pos] of iterNodeRange(range)) {
            updateNodeMarks(tr, child, pos, output)
        }
    }
    if (output.length) {
        tr.step(new BatchSetMarkStep(output))
    }

    if (tr.docChanged) {
        return true
    }
    return false
}
