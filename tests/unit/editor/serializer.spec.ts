import { TaggedProsemirrorNode } from "prosemirror-test-builder"
import { defaultMarkdownSerializer } from "@/editor/serializer"
import { dedent } from "@/editor/utils"
import { testcases } from "./base"
import { nodes } from "./schema.spec"

const { doc, table, tableRow, tableCell } = nodes

describe("markdown parser", () => {
    function assertEqual(markdown: string, node: TaggedProsemirrorNode) {
        expect(markdown).toBe(defaultMarkdownSerializer.serialize(node))
    }

    describe("base test cases", function() {
        for (let [caseName, [markdown, node]] of Object.entries(testcases)) {
            test(caseName, function() {
                assertEqual(markdown, node)
            })
        }
    })

    describe("table seriallizer", function() {
        test("table with long header cells and short body cells", function() {
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

        test("table with short header cells and long body cells", function() {
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

        test("table with short header cells and short body cells", function() {
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

        test("table with a long body cell", function() {
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

        test("table with a long header cell", function() {
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

        test("table with emtpy cells", function() {
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
