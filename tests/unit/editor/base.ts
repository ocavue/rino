import { TaggedProsemirrorNode } from "prosemirror-test-builder"
import { nodes } from "./schema.spec"
import { dedent } from "@/editor/utils"

const {
    doc,
    p,
    h1,
    h6,
    ol,
    ul,
    li,
    checkedCheckbox,
    uncheckedCheckbox,
    pre,
    preJS,
    blockquote,
    hr,
    table,
    tableRow,
    tableCell,
} = nodes

export const testcases: Record<string, [string, TaggedProsemirrorNode]> = {
    paragraph: ["hello", doc(p("hello"))],
    h1: ["# hello", doc(h1("hello"))],
    h6: ["###### hello", doc(h6("hello"))],
    orderedList: ["1. aaa\n2. bbb\n3. ccc", doc(ol(li(p("aaa")), li(p("bbb")), li(p("ccc"))))],
    // TODO: add tests for bullet list startswith '*' and '-'
    bulletList: ["* aaa\n* bbb\n* ccc", doc(ul(li(p("aaa")), li(p("bbb")), li(p("ccc"))))],
    checkboxListItem: [
        "* [ ] aaa\n* [x] bbb",
        doc(ul(li(uncheckedCheckbox(), p("aaa")), li(checkedCheckbox(), p("bbb")))),
    ],
    codeBlock: ["```\n1+1\n```", doc(pre("1+1"))],
    codeBlockWithLanguage: ["```javascript\n1+1\n```", doc(preJS("1+1"))],
    quote: ["> text\n> text", doc(blockquote(p("text\ntext")))],
    hr: ["---", doc(hr())],
    table: [
        dedent(`
            | header | header |
            | ------ | ------ |
            | cell01 | cell02 |
            | cell03 | cell04 |
            `),
        doc(
            table(
                tableRow(tableCell("header"), tableCell("header")),
                tableRow(tableCell("cell01"), tableCell("cell02")),
                tableRow(tableCell("cell03"), tableCell("cell04")),
            ),
        ),
    ],
    // TODO: add test for hard break
    // br: [
    //     'text\rtext',
    //     doc(
    //         p('text',  br(), 'text')
    //     )
    // ],
}
