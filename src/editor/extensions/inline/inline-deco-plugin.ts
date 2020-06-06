import { Extension } from "@remirror/core"
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
 * Read a text node' and return information from its mark
 */
function getTextInfo(textNode: ProsemirrorNode | undefined | null): TextInfo {
    // A text node should contain one or zero mark
    const mark = textNode?.marks?.[0]
    return mark ? { ...mark.attrs, name } : {}
}

/**
 *
 * @param textBlock
 * @param tokenIndex
 * @param tokenToPos
 * @param posPairs
 */
function iterUnilStart(
    textBlock: ProsemirrorNode,
    tokenIndex: number,
    tokenToPos: number,
    posPairs: [number, number][],
): void {
    for (let i = tokenIndex; i >= 0; i--) {
        const textNode = textBlock.content.child(i)
        const info = getTextInfo(textNode)
        if (isAutoHideMark(info.name)) {
            posPairs.push([tokenToPos - textNode.nodeSize, tokenToPos])
        }
        tokenToPos -= textNode.nodeSize
        // Break the loop if match a top level start token
        if (info.depth === 1 && info.start) break
    }
}

function iterUnilEnd(
    textBlock: ProsemirrorNode,
    tokenIndex: number,
    tokenFromPos: number,
    posPairs: [number, number][],
): void {
    for (let i = tokenIndex; i < textBlock.content.childCount; i++) {
        const textNode = textBlock.content.child(i)
        const info = getTextInfo(textNode)
        if (isAutoHideMark(info.name)) {
            posPairs.push([tokenFromPos, tokenFromPos + textNode.nodeSize])
        }
        tokenFromPos += textNode.nodeSize
        // Break the loop if match a top level end token
        if (info.depth === 1 && info.end) break
    }
}

function createDecorationPlugin() {
    const plugin = new Plugin({
        props: {
            decorations: (state: EditorState) => {
                const $pos = state.selection.$anchor

                // The text block node
                const textBlock = $pos.parent
                if (!textBlock.isTextblock) return

                console.debug(`[decoration] $pos.textOffset: ${$pos.textOffset}`)
                console.debug(`[decoration] $pos.index($pos.depth): ${$pos.index($pos.depth)}`)

                const posPairs: [number, number][] = []

                if ($pos.textOffset === 0) {
                    // The cursor is between two nodes.

                    // If the cursor is at the begin or at the end of the text block node, then
                    // one of `nodeAfter` and `nodeBefore` is empty.
                    const textNodeBefore = $pos.nodeBefore
                    const textNodeAfter = $pos.nodeAfter

                    if (textNodeBefore) {
                        iterUnilStart(textBlock, $pos.index($pos.depth) - 1, $pos.pos, posPairs)
                    }
                    if (textNodeAfter) {
                        iterUnilEnd(textBlock, $pos.index($pos.depth), $pos.pos, posPairs)
                    }
                } else {
                    // The cursor is inside a text node

                    const textNodeIndex = $pos.index($pos.depth)
                    const textNode = textBlock.content.maybeChild(textNodeIndex)
                    if (!textNode) return

                    const tokenDepth = getTextInfo(textNode).depth
                    if (!tokenDepth) return

                    const textFrom = $pos.pos - $pos.textOffset
                    const textTo = textFrom + textBlock.content.child(textNodeIndex).nodeSize

                    iterUnilStart(textBlock, textNodeIndex, textTo, posPairs)
                    iterUnilEnd(textBlock, textNodeIndex, textFrom, posPairs)
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

export class RinoInlineDecorationExtension extends Extension {
    get name() {
        return "inlineDecoration" as const
    }

    public plugin() {
        return createDecorationPlugin()
    }
}
