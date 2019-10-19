import { DecorationSet, Decoration } from "prosemirror-view"
import { EditorState, Plugin, Transaction } from "prosemirror-state"
import { Node } from "prosemirror-model"
import { InlineLexer } from "./lexer"

function parseText(node: Node, startIndex: number): Decoration[] {
    if (!node.text) {
        return []
    }
    let tokens = new InlineLexer().scan(node.text)
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

function parseTextBlock(node: Node, startIndex: number): Decoration[] {
    let decos: Decoration[] = []
    if (node.isTextblock) {
        node.forEach((child: Node, offset: number, index: number) => {
            decos.push(...parseText(child, startIndex + offset))
        })
    } else {
        node.forEach((child: Node, offset: number, index: number) => {
            decos.push(...parseTextBlock(child, startIndex + offset + 1))
        })
    }
    return decos
}

function buildDecorationSet(doc: Node): DecorationSet {
    console.log("building decorations. doc:", doc)
    let decos: Decoration[] = parseTextBlock(doc, 0)
    return DecorationSet.create(doc, decos)
}

interface DecorationPluginState {
    set: DecorationSet
}

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

export { decorationPlugin }
