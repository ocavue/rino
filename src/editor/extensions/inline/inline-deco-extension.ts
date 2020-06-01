import { Extension } from "@remirror/core"
import { Node as ProsemirrorNode } from "prosemirror-model"
import { EditorState, Plugin } from "prosemirror-state"
import { Decoration, DecorationSet } from "prosemirror-view"

import { isAutoHideMark } from "./inline-mark-define"

interface TextInfo {
    attrs: {
        depth?: number
        start?: boolean
        end?: boolean
    }
    name?: string
}

function getTextInfo(textNode: ProsemirrorNode | undefined | null): TextInfo {
    // A text node should contain only one mark
    const mark = textNode?.marks?.[0]
    return mark ? { attrs: mark.attrs, name: mark.type.name } : { attrs: {} }
}

function iterUnilStart(
    textBlock: ProsemirrorNode,
    tokenIndex: number,
    tokenDepth: number,
    tokenTo: number,
    posPairs: [number, number][],
): void {
    for (let i = tokenIndex; i >= 0; i--) {
        const textNode = textBlock.content.child(i)
        const info = getTextInfo(textNode)
        if (isAutoHideMark(info.name)) {
            posPairs.push([tokenTo - textNode.nodeSize, tokenTo])
        }
        tokenTo -= textNode.nodeSize
        // Break the loop if match a "top level" start token
        if (info.attrs.depth === 1 && info.attrs.start) break
    }
}

function iterUnilEnd(
    textBlock: ProsemirrorNode,
    tokenIndex: number,
    tokenDepth: number, // TODO: remove it
    tokenFrom: number,
    posPairs: [number, number][],
): void {
    for (let i = tokenIndex; i < textBlock.content.childCount; i++) {
        const textNode = textBlock.content.child(i)
        const info = getTextInfo(textNode)
        if (isAutoHideMark(info.name)) {
            posPairs.push([tokenFrom, tokenFrom + textNode.nodeSize])
        } else {
            console.debug(`[iterUnilEnd] `, info)
        }
        tokenFrom += textNode.nodeSize
        if (info.attrs.depth === 1 && info.attrs.end) break
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
                    // one of `nodeAfter` and `nodeBefore` is be empty.
                    const textBefore = $pos.nodeBefore
                    const textAfter = $pos.nodeAfter
                    const textBeforeDepth = getTextInfo(textBefore).attrs.depth
                    const textAfterDepth = getTextInfo(textAfter).attrs.depth

                    if (textBefore && textBeforeDepth) {
                        iterUnilStart(
                            textBlock,
                            $pos.index($pos.depth) - 1,
                            textBeforeDepth,
                            $pos.pos,
                            posPairs,
                        )
                    }
                    if (textAfter && textAfterDepth) {
                        iterUnilEnd(
                            textBlock,
                            $pos.index($pos.depth),
                            textAfterDepth,
                            $pos.pos,
                            posPairs,
                        )
                    }
                } else {
                    // The cursor is inside a text node

                    const tokenIndex = $pos.index($pos.depth)
                    const tokenNode = textBlock.content.maybeChild(tokenIndex)
                    if (!tokenNode) return

                    const tokenDepth = getTextInfo(tokenNode).attrs.depth
                    if (!tokenDepth && tokenDepth !== 0) return

                    const textFrom = $pos.pos - $pos.textOffset
                    const textTo = textFrom + textBlock.content.child(tokenIndex).nodeSize

                    iterUnilStart(textBlock, tokenIndex, tokenDepth, textTo, posPairs)
                    iterUnilEnd(textBlock, tokenIndex, tokenDepth, textFrom, posPairs)
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
