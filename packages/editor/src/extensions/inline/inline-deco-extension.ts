import { CreateExtensionPlugin, isTextSelection, PlainExtension } from "@remirror/core"
import { Node as ProsemirrorNode } from "prosemirror-model"
import { EditorState } from "prosemirror-state"
import { Decoration, DecorationSet } from "prosemirror-view"

import { isAutoHideMark, RinnMarkAttrs } from "./inline-mark-extensions"

type TextAttrs = Partial<RinnMarkAttrs & { isAutoHideMark?: boolean }>

/**
 * Read a text node and return information from its mark
 */
function getTextAttrs(textNode: ProsemirrorNode | undefined | null): TextAttrs {
    const attrs: TextAttrs = {}
    for (const mark of textNode?.marks || []) {
        if (isAutoHideMark(mark.type.name)) {
            attrs.isAutoHideMark = true
        }
        Object.assign(attrs, mark.attrs)
    }
    return attrs
}

/**
 * Find all auto hidden text nodes that need to show based on the position of the cursor.
 *
 * @param textBlock     The parent text block.
 * @param cursorPos     The (absolute) position of the cursor. This cursor should be between two text nodes.
 * @param textIndex     The index relative to the parent text block of the text node that right after the cursor. If
 *                      the cursor is at the end of the text block (so there is not text node after the cursor),
 *                      `textIndex` should be the length of the text block's children.
 * @param includeBefore Force to search text nodes before the cursor.
 *
 * @returns The (absolute) position pairs of all visible marks
 */
function findVisibleMarks(textBlock: ProsemirrorNode, cursorPos: number, textIndex: number, includeBefore: boolean): [number, number][] {
    const posPairs: [number, number][] = []

    // Find all visible marks after the cursor.
    let textStartPos = cursorPos
    for (let i = textIndex; i < textBlock.content.childCount; i++) {
        const textNode = textBlock.content.child(i)
        const info = getTextAttrs(textNode)
        if (info.isAutoHideMark) {
            posPairs.push([textStartPos, textStartPos + textNode.nodeSize])
        }
        textStartPos += textNode.nodeSize
        // Break the loop if match a top level end token
        if (info.depth === 1 && info.last) break
    }

    const infoAfterCursor = getTextAttrs(textBlock.maybeChild(textIndex))
    if (infoAfterCursor.depth === 1 && infoAfterCursor.first && !includeBefore) {
        return posPairs
    }

    // Find all visible marks before the cursor.
    let textEndPos = cursorPos
    for (let i = textIndex - 1; i >= 0; i--) {
        const textNode = textBlock.content.child(i)
        const info = getTextAttrs(textNode)
        if (info.isAutoHideMark) {
            posPairs.push([textEndPos - textNode.nodeSize, textEndPos])
        }
        textEndPos -= textNode.nodeSize
        // Break the loop if match a top level start token
        if (info.depth === 1 && info.first) break
    }

    return posPairs
}

function createDecorationPlugin(): CreateExtensionPlugin {
    return {
        props: {
            decorations: (state: EditorState) => {
                if (!isTextSelection(state.selection)) return null

                const $pos = state.selection.$anchor

                // The text block node
                const textBlock = $pos.parent
                if (!textBlock.isTextblock) return null

                let posPairs: [number, number][]

                if ($pos.textOffset === 0) {
                    // The cursor is between two nodes.
                    posPairs = findVisibleMarks(textBlock, $pos.pos, $pos.index($pos.depth), true)
                } else {
                    // The cursor is inside a text node

                    const textNodeIndex = $pos.index($pos.depth)
                    const textNode = textBlock.content.maybeChild(textNodeIndex)
                    if (!textNode) return null

                    const tokenDepth = getTextAttrs(textNode).depth
                    if (!tokenDepth) return null

                    posPairs = findVisibleMarks(textBlock, $pos.pos - $pos.textOffset, $pos.index($pos.depth), false)
                }

                return DecorationSet.create(
                    state.doc,
                    posPairs.map(([from, to]) => Decoration.inline(from, to, { class: "show" })),
                )
            },
        },
    }
}

export class RinoInlineDecorationExtension extends PlainExtension {
    get name() {
        return "inlineDecoration" as const
    }

    createPlugin(): CreateExtensionPlugin {
        return createDecorationPlugin()
    }
}
