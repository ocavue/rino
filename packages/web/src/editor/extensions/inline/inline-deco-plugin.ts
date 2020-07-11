import { PlainExtension } from "@remirror/core"
import { Node as ProsemirrorNode } from "prosemirror-model"
import { EditorState, Plugin } from "prosemirror-state"
import { Decoration, DecorationSet } from "prosemirror-view"

import { isAutoHideMark } from "./inline-mark-define"

interface TextInfo {
    depth?: number
    start?: boolean
    end?: boolean
    name?: string
}

/**
 * Read a text node and return information from its mark
 */
function getTextInfo(textNode: ProsemirrorNode | undefined | null): TextInfo {
    // A text node should contain one or zero mark
    const mark = textNode?.marks?.[0]
    return mark ? { ...mark.attrs, name: mark.type.name } : {}
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
function findVisibleMarks(
    textBlock: ProsemirrorNode,
    cursorPos: number,
    textIndex: number,
    includeBefore: boolean,
): [number, number][] {
    const posPairs: [number, number][] = []

    // Find all visible marks after the cursor.
    let textStartPos = cursorPos
    for (let i = textIndex; i < textBlock.content.childCount; i++) {
        const textNode = textBlock.content.child(i)
        const info = getTextInfo(textNode)
        if (isAutoHideMark(info.name)) {
            posPairs.push([textStartPos, textStartPos + textNode.nodeSize])
        }
        textStartPos += textNode.nodeSize
        // Break the loop if match a top level end token
        if (info.depth === 1 && info.end) break
    }

    const infoAfterCursor = getTextInfo(textBlock.maybeChild(textIndex))
    if (infoAfterCursor.depth === 1 && infoAfterCursor.start && !includeBefore) {
        return posPairs
    }

    // Find all visible marks before the cursor.
    let textEndPos = cursorPos
    for (let i = textIndex - 1; i >= 0; i--) {
        const textNode = textBlock.content.child(i)
        const info = getTextInfo(textNode)
        if (isAutoHideMark(info.name)) {
            posPairs.push([textEndPos - textNode.nodeSize, textEndPos])
        }
        textEndPos -= textNode.nodeSize
        // Break the loop if match a top level start token
        if (info.depth === 1 && info.start) break
    }

    return posPairs
}

function createDecorationPlugin() {
    const plugin = new Plugin({
        props: {
            decorations: (state: EditorState) => {
                const $pos = state.selection.$anchor

                // The text block node
                const textBlock = $pos.parent
                if (!textBlock.isTextblock) return

                let posPairs: [number, number][]

                if ($pos.textOffset === 0) {
                    // The cursor is between two nodes.
                    posPairs = findVisibleMarks(textBlock, $pos.pos, $pos.index($pos.depth), true)
                } else {
                    // The cursor is inside a text node

                    const textNodeIndex = $pos.index($pos.depth)
                    const textNode = textBlock.content.maybeChild(textNodeIndex)
                    if (!textNode) return

                    const tokenDepth = getTextInfo(textNode).depth
                    if (!tokenDepth) return

                    posPairs = findVisibleMarks(
                        textBlock,
                        $pos.pos - $pos.textOffset,
                        $pos.index($pos.depth),
                        false,
                    )
                }

                return DecorationSet.create(
                    state.doc,
                    posPairs.map(([from, to]) => Decoration.inline(from, to, { class: "show" })),
                )
            },
        },
    })
    return plugin
}

export class RinoInlineDecorationExtension extends PlainExtension {
    get name() {
        return "inlineDecoration" as const
    }

    createPlugin = () => {
        return createDecorationPlugin()
    }
}
