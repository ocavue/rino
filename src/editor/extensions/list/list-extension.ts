import {
    convertCommand,
    ExtensionManagerNodeTypeParams,
    isElementDOMNode,
    NodeExtension,
    NodeExtensionSpec,
    SchemaFromExtensions,
} from "@remirror/core"
import Token from "markdown-it/lib/token"
import { InputRule, wrappingInputRule } from "prosemirror-inputrules"
import { Node as ProsemirrorNode, Schema } from "prosemirror-model"
import { liftListItem, sinkListItem } from "prosemirror-schema-list"
import { EditorState } from "prosemirror-state"
import { EditorView, NodeView } from "prosemirror-view"

import { ParserTokenType } from "src/editor/transform/parser-type"
import { NodeSerializerOptions } from "src/editor/transform/serializer"
import { MarkdownNodeExtension } from "src/editor/utils"

import { splitListItem } from "./list-helper"

class ListItemView implements NodeView {
    public dom: HTMLElement
    public contentDOM: HTMLElement
    private schema: Schema

    public constructor(node: ProsemirrorNode, view: EditorView, getPos: () => number) {
        this.dom = this.contentDOM = document.createElement("li")
        this.schema = view.state.schema
        this.updateListItemClass(node)
    }

    public update(node: ProsemirrorNode) {
        if (node.type !== this.schema.nodes.rinoListItem) return false
        this.updateListItemClass(node)
        return true
    }

    private updateListItemClass(node: ProsemirrorNode) {
        const className = "selectable-list-item"
        const hasClass = this.contentDOM.classList.contains(className)
        const shouldHasClass = node.firstChild?.type === this.schema.nodes.rinoCheckbox

        if (hasClass !== shouldHasClass) {
            shouldHasClass
                ? this.contentDOM.classList.add(className)
                : this.contentDOM.classList.remove(className)
        }
    }
}

export class RinoListItemExtension extends NodeExtension implements MarkdownNodeExtension {
    get name() {
        return "rinoListItem" as const
    }

    get schema(): NodeExtensionSpec {
        return {
            content: "rinoCheckbox? paragraph block*",
            defining: true,
            parseDOM: [{ tag: "li" }],
            toDOM(node) {
                return ["li", 0]
            },
        }
    }

    public keys({ type, schema }: ExtensionManagerNodeTypeParams) {
        return {
            Enter: convertCommand(
                splitListItem(schema.nodes.paragraph, schema.nodes.rinoCheckbox, type),
            ),
            "Mod-[": convertCommand(liftListItem(type)),
            "Mod-]": convertCommand(sinkListItem(type)),
        }
    }

    public nodeView() {
        return (node: ProsemirrorNode, view: EditorView, getPos: boolean | (() => number)) => {
            return new ListItemView(node, view, getPos as () => number)
        }
    }

    public fromMarkdown() {
        return [
            {
                type: ParserTokenType.block,
                token: "list_item",
                node: this.name,
                hasOpenClose: true,
            },
        ] as const
    }

    public toMarkdown({ state, node }: NodeSerializerOptions) {
        state.renderContent(node)
    }
}

export class RinoOrderedListExtension extends NodeExtension implements MarkdownNodeExtension {
    get name() {
        return "rinoOrderedList" as const
    }

    get schema(): NodeExtensionSpec {
        return {
            content: "rinoListItem+",
            group: "block",
            parseDOM: [
                {
                    tag: "ol",
                },
            ],
            toDOM(node) {
                return ["ol", 0]
            },
        }
    }

    public inputRules({ type }: ExtensionManagerNodeTypeParams) {
        return [
            wrappingInputRule(
                /^(\d+)\.\s$/,
                type,
                (match: string[]) => ({ order: +match[1] }),
                (match: string[], node: ProsemirrorNode) =>
                    node.childCount + node.attrs.order == +match[1],
            ),
        ]
    }

    public fromMarkdown() {
        return [
            {
                type: ParserTokenType.block,
                token: "ordered_list",
                node: this.name,
                hasOpenClose: true,
                getAttrs: (tok: Token) => ({ order: +(tok.attrGet("order") || 1) }),
            },
        ] as const
    }

    public toMarkdown({ state, node }: NodeSerializerOptions) {
        const start = node.attrs.order || 1
        const maxW = String(start + node.childCount - 1).length
        const space = state.repeat(" ", maxW + 2)
        state.renderList(node, space, (i) => {
            const nStr = String(start + i)
            return state.repeat(" ", maxW - nStr.length) + nStr + ". "
        })
    }
}

export class RinoBulletListExtension extends NodeExtension implements MarkdownNodeExtension {
    get name() {
        return "rinoBulletList" as const
    }

    get schema(): NodeExtensionSpec {
        return {
            content: "rinoListItem+",
            group: "block",
            parseDOM: [
                {
                    tag: "ul",
                },
            ],
            toDOM(node) {
                return ["ul", 0]
            },
        }
    }

    public inputRules({ type }: ExtensionManagerNodeTypeParams) {
        return [wrappingInputRule(/^\s*([-+*])\s$/, type)]
    }

    public fromMarkdown() {
        return [
            {
                type: ParserTokenType.block,
                token: "bullet_list",
                node: this.name,
                hasOpenClose: true,
            },
        ] as const
    }

    public toMarkdown({
        state,
        node,
    }: NodeSerializerOptions<SchemaFromExtensions<RinoBulletListExtension>>) {
        state.renderList(node, "  ", () => (node.attrs.bullet || "*") + " ")
    }
}

export class RinoCheckboxExtension extends NodeExtension implements MarkdownNodeExtension {
    get name() {
        return "rinoCheckbox" as const
    }

    get schema(): NodeExtensionSpec {
        return {
            defining: true,
            selectable: false,
            attrs: {
                checked: { default: false },
            },
            parseDOM: [
                {
                    tag: "input[type=checkbox]",
                    getAttrs: (dom) =>
                        isElementDOMNode(dom) ? { checked: dom.hasAttribute("checked") } : {},
                },
            ],
            toDOM(node) {
                const attrs: Record<string, string> = { type: "checkbox" }
                if (node.attrs.checked) attrs.checked = ""
                return ["input", attrs]
            },
        }
    }

    public inputRules({ type }: ExtensionManagerNodeTypeParams) {
        return [
            new InputRule(/^\[([ |x])\] $/, function (state: EditorState, match, start, end) {
                const $from = state.selection.$from
                if (
                    $from.depth >= 3 &&
                    $from.node(-1).type.name === "rinoListItem" &&
                    $from.node(-2).type.name === "rinoBulletList" &&
                    $from.index(-1) === 0 // The cursor is at the first child (paragraph) of this list item.
                ) {
                    const attrs = { checked: match[1] === "x" }
                    const listItemPos = $from.before(-1)
                    return state.tr.delete(start, end).insert(listItemPos + 1, type.create(attrs))
                }
                return null
            }),
        ]
    }

    public fromMarkdown() {
        return [
            {
                type: ParserTokenType.block,
                token: "list_checkbox",
                node: this.name,
                hasOpenClose: false,
                getAttrs: (tok: Token) => ({ checked: tok.attrGet("checked") === "" }),
            },
        ] as const
    }

    public toMarkdown({ state, node }: NodeSerializerOptions) {
        state.text(node.attrs.checked ? "[x] " : "[ ] ", false)
    }

    public nodeView() {
        /*
        https://discuss.prosemirror.net/t/how-to-update-the-value-of-an-input/2147
        > I think the nicest way to do this would be to define a node view that, when it detects
        > change/input events on its field, uses the `getPos` callback it was given on creation
        > to figure out where the field is, and dispatches the appropriate transaction.
        >
        > You can also use [`posAtDOM`](http://prosemirror.net/docs/ref/#view.EditorView.posAtDOM)
        > to go from the event’s `target` property to a document position, but when the node is
        > re-rendered (over which you don’t have control, without a node view), that’ll annoyingly
        > mess with focus and cursor position inside the field.
        */
        return (
            node: ProsemirrorNode,
            view: EditorView,
            getPos: boolean | (() => number),
        ): NodeView => {
            let checked = !!node.attrs.checked
            const dom = document.createElement("input")
            dom.setAttribute("type", "checkbox")
            dom.onclick = () => {
                const pos = (getPos as () => number)()
                checked = !checked
                view.dispatch(view.state.tr.setNodeMarkup(pos, undefined, { checked }))
            }
            if (node.attrs.checked) dom.setAttribute("checked", "")
            return {
                dom,
                ignoreMutation: () => true,
            }
        }
    }
}
