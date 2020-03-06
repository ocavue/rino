import { Decoration, DecorationSet } from "prosemirror-view"
import { EditorState, Plugin, Transaction } from "prosemirror-state"
import { InlineDecorateType } from "./decoration-type"
import { InlineLexer } from "src/editor/extensions/decoration/lexer"
import { Node } from "prosemirror-model"
import { WysiwygSchema } from "src/editor"

function parseText<S extends WysiwygSchema>(node: Node<S>, startIndex: number): Decoration[] {
    if (!node.text) {
        return []
    }
    const tokens = new InlineLexer().scan(node.text)
    return tokens.map(token => {
        let deco: Decoration
        if (token.isWidget) {
            deco = Decoration.widget(startIndex, () => token.dom, { key: token.key })
        } else {
            deco = Decoration.inline(
                startIndex,
                startIndex + token.length,
                {
                    class: token.classes ? token.classes.join(" ") : null,
                    nodeName: token.nodeName || null,
                    ...token.nodeAttrs,
                },
                { inclusiveStart: false, inclusiveEnd: true },
            )
        }
        startIndex += token.length
        return deco
    })
}

function parseTextBlock<S extends WysiwygSchema>(node: Node<S>, startIndex: number): Decoration[] {
    if (node.attrs.inlineDecorateType === InlineDecorateType.Ignore) {
        return []
    } else {
        const decos: Decoration[] = []
        if (node.isTextblock) {
            node.forEach((child: Node<S>, offset: number, index: number) => {
                decos.push(...parseText(child, startIndex + offset))
            })
        } else {
            node.forEach((child: Node<S>, offset: number, index: number) => {
                decos.push(...parseTextBlock(child, startIndex + offset + 1))
            })
        }
        return decos
    }
}

function buildDecorationSet<S extends WysiwygSchema>(doc: Node<S>): DecorationSet<S> {
    console.log("building decorations")
    const decos: Decoration[] = parseTextBlock(doc, 0)
    return DecorationSet.create(doc, decos)
}

interface DecorationPluginState {
    set: DecorationSet
}

export const createDecorationPlugin = () => {
    const decorationPlugin = new Plugin({
        state: {
            init(_, { doc }): DecorationPluginState {
                return {
                    set: buildDecorationSet(doc),
                }
            },
            apply(tr: Transaction, state: DecorationPluginState): DecorationPluginState {
                return {
                    set: buildDecorationSet(tr.doc),
                }
            },
        },
        props: {
            decorations(state: EditorState): DecorationSet {
                return decorationPlugin.getState(state).set
            },
        },
    })
    return decorationPlugin
}
