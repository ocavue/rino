import { ApplySchemaAttributes, GetSchema, KeyBindings, NodeExtensionSpec } from "@remirror/core"
import {
    BulletListExtension,
    ListItemExtension,
    ListItemSharedExtension,
    OrderedListExtension,
    TaskListExtension,
    TaskListItemExtension,
} from "@remirror/extension-list"
import { isString } from "lodash"
import Token from "markdown-it/lib/token"
import { InputRule, wrappingInputRule } from "prosemirror-inputrules"

import type { MarkdownParseState, NodeSerializerOptions } from "../../transform"
import { ParserRuleType } from "../../transform"
import type { MarkdownNodeExtension } from "../../utils"

export class RinoListItemExtension extends ListItemExtension implements MarkdownNodeExtension {
    static disableExtraAttributes = true

    get name() {
        return "listItem" as const
    }

    createNodeSpec(): NodeExtensionSpec {
        return {
            content: "paragraph block*",
            defining: true,
            parseDOM: [{ tag: "li" }],
            toDOM(node) {
                return ["li", 0]
            },
        }
    }

    public createExtensions() {
        return []
    }

    public fromMarkdown() {
        return [
            {
                type: ParserRuleType.block,
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

export class RinoOrderedListExtension extends OrderedListExtension implements MarkdownNodeExtension {
    static disableExtraAttributes = true

    get name() {
        return "orderedList" as const
    }

    public createExtensions() {
        return []
    }

    public fromMarkdown() {
        return [
            {
                type: ParserRuleType.block,
                token: "ordered_list",
                node: this.name,
                hasOpenClose: true,
                getAttrs: (tok: Token) => ({ order: +(tok.attrGet("order") || 1) }),
            },
        ] as const
    }

    public toMarkdown({ state, node }: NodeSerializerOptions) {
        const start = (node.attrs.order as number) || 1
        const maxW = String(start + node.childCount - 1).length
        const space = state.repeat(" ", maxW + 2)
        state.renderList(node, space, (i) => {
            const nStr = String(start + i)
            return state.repeat(" ", maxW - nStr.length) + nStr + ". "
        })
    }
}

export class RinoBulletListExtension extends BulletListExtension implements MarkdownNodeExtension {
    static disableExtraAttributes = true

    get name() {
        return "bulletList" as const
    }

    public createNodeSpec(extra: ApplySchemaAttributes): NodeExtensionSpec {
        return {
            content: "listItem+",
            attrs: {
                bullet: { default: "-" },
                ...extra.defaults(),
            },
            parseDOM: [{ tag: "ul", getAttrs: extra.parse }],
            toDOM: (node) => ["ul", extra.dom(node), 0],
        }
    }

    public createInputRules(): InputRule[] {
        return [wrappingInputRule(/^\s*([*+-])\s$/, this.type, (match) => ({ bullet: match[1] }))]
    }

    public createExtensions() {
        return []
    }

    public fromMarkdown() {
        return [
            {
                type: ParserRuleType.block,
                token: "bullet_list",
                node: this.name,
                hasOpenClose: true,
                getAttrs: (token: Token) => {
                    return { bullet: token.markup }
                },
            },
        ] as const
    }

    public toMarkdown({ state, node }: NodeSerializerOptions<GetSchema<RinoBulletListExtension>>) {
        state.renderList(node, "  ", () => ((node.attrs.bullet as string) || "*") + " ")
    }
}

export class RinoTaskListExtension extends TaskListExtension implements MarkdownNodeExtension {
    static disableExtraAttributes = true

    get name() {
        return "taskList" as const
    }

    public createExtensions() {
        return []
    }

    public fromMarkdown() {
        return [] as const
    }

    public toMarkdown({ state, node }: NodeSerializerOptions<GetSchema<RinoBulletListExtension>>) {
        state.renderList(node, "  ", (index) => {
            const taskListItem = node.maybeChild(index)
            return taskListItem?.attrs.checked ? "- [x] " : "- [ ] "
        })
    }
}

export class RinoTaskListItemExtension extends TaskListItemExtension implements MarkdownNodeExtension {
    static disableExtraAttributes = true

    get name() {
        return "taskListItem" as const
    }

    public createExtensions() {
        return []
    }

    public fromMarkdown() {
        return [
            {
                type: ParserRuleType.free,
                token: "list_checkbox",
                handler: (state: MarkdownParseState, tok: Token) => {
                    const parent = state.stack[state.stack.length - 1]
                    const grandParent = state.stack[state.stack.length - 2]
                    if (parent?.type.name === "listItem") {
                        parent.type = this.store.schema.nodes.taskListItem
                        const checked: null | string | boolean = tok.attrGet("checked")
                        parent.attrs = { checked: isString(checked) || !!checked }
                        if (grandParent?.type.name === "bulletList") {
                            grandParent.type = this.store.schema.nodes.taskList
                        } else {
                            console.warn(`expect bulletList but got ${grandParent?.type.name}`)
                        }
                    } else {
                        console.warn(`expect listItem but got ${parent?.type.name}`)
                    }
                },
            },
        ] as const
    }

    public toMarkdown({ state, node }: NodeSerializerOptions) {
        state.renderContent(node)
    }
}

export class RinoListItemSharedExtension extends ListItemSharedExtension {
    createKeymap(): KeyBindings {
        const oldKeyMap = super.createKeymap()
        const sinkListItem = oldKeyMap["Tab"]
        const liftListItem = oldKeyMap["Shift-Tab"]

        return {
            Tab: sinkListItem,
            "Shift-Tab": liftListItem,
            "Mod-]": sinkListItem,
            "Mod-[": liftListItem,
        }
    }
}
