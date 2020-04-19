import MarkdownIt from "markdown-it"

import markdownItListCheckbox from "src/editor/transform/markdown-it-list-checkbox"
import { dedent } from "src/utils"

describe("markdown-it plugin `markdown-it-list-checkbox`", () => {
    const mdWithoutPlugin = MarkdownIt("commonmark", { html: true })
    const mdWithPlugin = MarkdownIt("commonmark", { html: true }).use(markdownItListCheckbox)

    describe("Complete list", () => {
        const text = dedent(
            `
            start

            - [x] checkbox01
            - [ ] checkbox02
            - [x] checkbox03

            end
            `,
        )
        const tokenTypesWithPlugin = [
            "paragraph_open",
            "inline",
            "paragraph_close",
            "bullet_list_open",
            "list_item_open",
            "list_checkbox", // checkbox
            "paragraph_open",
            "inline",
            "paragraph_close",
            "list_item_close",
            "list_item_open",
            "list_checkbox", // checkbox
            "paragraph_open",
            "inline",
            "paragraph_close",
            "list_item_close",
            "list_item_open",
            "list_checkbox", // checkbox
            "paragraph_open",
            "inline",
            "paragraph_close",
            "list_item_close",
            "bullet_list_close",
            "paragraph_open",
            "inline",
            "paragraph_close",
        ]
        const tokenTypesWithoutPlugin = tokenTypesWithPlugin.filter(
            (str) => str !== "list_checkbox",
        )
        test("Check types without the plugin", () => {
            const tokens = mdWithoutPlugin.parse(text, {})
            expect(tokens.map((token) => token.type)).toStrictEqual(tokenTypesWithoutPlugin)
        })
        test("Check types with the plugin", () => {
            const tokens = mdWithPlugin.parse(text, {})
            expect(tokens.map((token) => token.type)).toStrictEqual(tokenTypesWithPlugin)
        })
        test("Check attrs with the plugin", () => {
            const tokens = mdWithPlugin.parse(text, {})
            const checkboxTokens = tokens.filter((t) => t.type === "list_checkbox")
            expect(checkboxTokens).toHaveLength(3)
            expect(checkboxTokens[0].attrs).toStrictEqual([
                ["type", "checkbox"],
                ["checked", ""],
            ])
            expect(checkboxTokens[1].attrs).toStrictEqual([["type", "checkbox"]])
            expect(checkboxTokens[2].attrs).toStrictEqual([
                ["type", "checkbox"],
                ["checked", ""],
            ])
        })
    })

    describe("Incomplete bullet list", () => {
        const text = dedent(
            `
            * checkbox01
            *
            `,
        )
        const tokenTypes = [
            "bullet_list_open",
            "list_item_open",
            "paragraph_open",
            "inline",
            "paragraph_close",
            "list_item_close",
            "list_item_open",
            "list_item_close",
            "bullet_list_close",
        ]
        test("Check types without the plugin", () => {
            const tokens = mdWithoutPlugin.parse(text, {})
            expect(tokens.map((token) => token.type)).toStrictEqual(tokenTypes)
        })
        test("Check types with the plugin", () => {
            const tokens = mdWithPlugin.parse(text, {})
            expect(tokens.map((token) => token.type)).toStrictEqual(tokenTypes)
        })
    })
})
