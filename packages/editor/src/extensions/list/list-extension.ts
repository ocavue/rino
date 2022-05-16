import { ApplySchemaAttributes, assertGet, GetSchema, KeyBindings, NodeExtensionSpec, NodeSpecOverride } from "@remirror/core"
import {
    BulletListExtension,
    ListItemExtension,
    ListItemSharedExtension,
    OrderedListExtension,
    sharedLiftListItem,
    sharedSinkListItem,
    TaskListExtension,
    TaskListItemExtension,
} from "@remirror/extension-list"
import { isString } from "lodash-es"
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
        return []
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

    createNodeSpec(extra: ApplySchemaAttributes, override: NodeSpecOverride): NodeExtensionSpec {
        return super.createNodeSpec(
            {
                ...extra,
                defaults: () => ({
                    marker: { default: "." },
                }),
            },
            override,
        )
    }

    public createExtensions() {
        return []
    }

    createInputRules(): InputRule[] {
        return [
            wrappingInputRule(
                /^(\d+)([.)])\s$/,
                this.type,
                (match) => ({ order: +assertGet(match, 1), marker: assertGet(match, 2) }),
                (match, node) => node.childCount + (node.attrs.order as number) === +assertGet(match, 1),
            ),
        ]
    }

    public fromMarkdown() {
        return [
            {
                type: ParserRuleType.context,
                token: "ordered_list",
                context: "ordered_list",
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
                type: ParserRuleType.context,
                token: "bullet_list",
                context: "bullet_list",
            },
        ] as const
    }

    public toMarkdown({ state, node }: NodeSerializerOptions<GetSchema<RinoBulletListExtension>>) {
        state.renderList(node, "  ", () => ((node.attrs.bullet as string) || "-") + " ")
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
                        } else if (grandParent?.type.name !== "taskList") {
                            console.warn(`expect bulletList or taskList but got ${grandParent?.type.name}`)
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
        const extensions = this.store.extensions
        return {
            Tab: sharedSinkListItem(extensions),
            "Shift-Tab": sharedLiftListItem(extensions),
            "Mod-]": sharedSinkListItem(extensions),
            "Mod-[": sharedLiftListItem(extensions),
        }
    }
}
