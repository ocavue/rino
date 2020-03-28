import { TaggedProsemirrorNode } from "prosemirror-test-builder"

import { buildMarkdownSerializer } from "src/editor/components/wysiwyg/wysiwyg-markdown"
import { dedent } from "src/utils"

import { createBaseTestcases, nodes, wysiwygManager } from "./base"

const { doc, p, table, tableRow, tableCell, li, ul, uncheckedCheckbox, checkedCheckbox } = nodes

const markdownSerializer = buildMarkdownSerializer(wysiwygManager)
function assertEqual(expectedMarkdown: string, receivedNode: TaggedProsemirrorNode) {
    expect(markdownSerializer.serialize(receivedNode)).toBe(expectedMarkdown)
}

describe("base markdown serializer", () => {
    describe("base test cases", function () {
        for (const [caseName, [markdown, node]] of Object.entries(createBaseTestcases())) {
            test(caseName, function () {
                assertEqual(markdown, node)
            })
        }
    })

    describe("table seriallizer", function () {
        test("table with long header cells and short body cells", function () {
            assertEqual(
                dedent(`
                    | header | header |
                    | ------ | ------ |
                    | c      | c      |
                    | c      | c      |
                    `),
                doc(
                    table(
                        tableRow(tableCell("header"), tableCell("header")),
                        tableRow(tableCell("c"), tableCell("c")),
                        tableRow(tableCell("c"), tableCell("c")),
                    ),
                ),
            )
        })

        test("table with short header cells and long body cells", function () {
            assertEqual(
                dedent(`
                    | h      | h      |
                    | ------ | ------ |
                    | cell01 | cell02 |
                    | cell03 | cell04 |
                    `),
                doc(
                    table(
                        tableRow(tableCell("h"), tableCell("h")),
                        tableRow(tableCell("cell01"), tableCell("cell02")),
                        tableRow(tableCell("cell03"), tableCell("cell04")),
                    ),
                ),
            )
        })

        test("table with short header cells and short body cells", function () {
            assertEqual(
                dedent(`
                    | h    | h    |
                    | ---- | ---- |
                    | c    | c    |
                    | c    | c    |
                    `),
                doc(
                    table(
                        tableRow(tableCell("h"), tableCell("h")),
                        tableRow(tableCell("c"), tableCell("c")),
                        tableRow(tableCell("c"), tableCell("c")),
                    ),
                ),
            )
        })

        test("table with a long body cell", function () {
            assertEqual(
                dedent(`
                    | h    | h         |
                    | ---- | --------- |
                    | c    | c         |
                    | c    | 123456789 |
                    `),
                doc(
                    table(
                        tableRow(tableCell("h"), tableCell("h")),
                        tableRow(tableCell("c"), tableCell("c")),
                        tableRow(tableCell("c"), tableCell("123456789")),
                    ),
                ),
            )
            assertEqual(
                dedent(`
                    | h    | h          |
                    | ---- | ---------- |
                    | c    | c          |
                    | c    | 1234567890 |
                    `),
                doc(
                    table(
                        tableRow(tableCell("h"), tableCell("h")),
                        tableRow(tableCell("c"), tableCell("c")),
                        tableRow(tableCell("c"), tableCell("1234567890")),
                    ),
                ),
            )
        })

        test("table with a long header cell", function () {
            assertEqual(
                dedent(`
                    | 123456789 | h    |
                    | --------- | ---- |
                    | c         | c    |
                    | c         | c    |
                    `),
                doc(
                    table(
                        tableRow(tableCell("123456789"), tableCell("h")),
                        tableRow(tableCell("c"), tableCell("c")),
                        tableRow(tableCell("c"), tableCell("c")),
                    ),
                ),
            )
            assertEqual(
                dedent(`
                    | 1234567890 | h    |
                    | ---------- | ---- |
                    | c          | c    |
                    | c          | c    |
                    `),
                doc(
                    table(
                        tableRow(tableCell("1234567890"), tableCell("h")),
                        tableRow(tableCell("c"), tableCell("c")),
                        tableRow(tableCell("c"), tableCell("c")),
                    ),
                ),
            )
        })

        test("table with emtpy cells", function () {
            assertEqual(
                dedent(`
                    | h    |      |
                    | ---- | ---- |
                    |      | c    |
                    | c    |      |
                    `),
                doc(
                    table(
                        tableRow(tableCell("h"), tableCell(" ")),
                        tableRow(tableCell(" "), tableCell("c")),
                        tableRow(tableCell("c"), tableCell(" ")),
                    ),
                ),
            )
        })
    })
})

describe("list markdown serializer", () => {
    describe("selectable list", function () {
        it("checked list", function () {
            assertEqual(
                dedent(
                    `
                    * [x] list item 1
                    * [x] list item 2
                    * [x] list item 3
                    `,
                ).trim(),
                doc(
                    ul(
                        li(checkedCheckbox(), p("list item 1")),
                        li(checkedCheckbox(), p("list item 2")),
                        li(checkedCheckbox(), p("list item 3")),
                    ),
                ),
            )
        })
        it("unchecked list", function () {
            assertEqual(
                dedent(
                    `
                    * [ ] list item 1
                    * [ ] list item 2
                    * [ ] list item 3
                    `,
                ).trim(),
                doc(
                    ul(
                        li(uncheckedCheckbox(), p("list item 1")),
                        li(uncheckedCheckbox(), p("list item 2")),
                        li(uncheckedCheckbox(), p("list item 3")),
                    ),
                ),
            )
        })
        it("mixed list", function () {
            assertEqual(
                dedent(
                    `
                    * [ ] list item 1
                    * [x] list item 2
                    * [ ] list item 3
                    `,
                ).trim(),
                doc(
                    ul(
                        li(uncheckedCheckbox(), p("list item 1")),
                        li(checkedCheckbox(), p("list item 2")),
                        li(uncheckedCheckbox(), p("list item 3")),
                    ),
                ),
            )
        })
        it("selectable list item and bullet list item", function () {
            assertEqual(
                dedent(
                    `
                    * [ ] list item 1
                    * [x] list item 2
                    * list item 3
                    `,
                ).trim(),
                doc(
                    ul(
                        li(uncheckedCheckbox(), p("list item 1")),
                        li(checkedCheckbox(), p("list item 2")),
                        li(p("list item 3")),
                    ),
                ),
            )
            assertEqual(
                dedent(
                    `
                    * list item 0
                    * [ ] list item 1
                    * [x] list item 2
                    `,
                ).trim(),
                doc(
                    ul(
                        li(p("list item 0")),
                        li(uncheckedCheckbox(), p("list item 1")),
                        li(checkedCheckbox(), p("list item 2")),
                    ),
                ),
            )
        })
    })
})
