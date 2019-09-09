import { TaggedProsemirrorNode } from "prosemirror-test-builder"
import { nodes } from "./schema.spec"

const { doc, p, h1, h6, ol, ul, li, pre, preJS, blockquote, hr } = nodes

export const testcases: Record<string, [string, TaggedProsemirrorNode]> = {
    paragraph: ["hello", doc(p("hello"))],
    h1: ["# hello", doc(h1("hello"))],
    h6: ["###### hello", doc(h6("hello"))],
    orderedList: [
        "1. aaa\n\n\n2. bbb\n\n\n3. ccc",
        doc(ol(li(p("aaa")), li(p("bbb")), li(p("ccc")))),
    ],
    // TODO: add tests for bullet list startswith '*' and '-'
    bulletList: ["* aaa\n\n\n* bbb\n\n\n* ccc", doc(ul(li(p("aaa")), li(p("bbb")), li(p("ccc"))))],
    codeBlock: ["```\n1+1\n```", doc(pre("1+1"))],
    codeBlockWithLanguage: ["```javascript\n1+1\n```", doc(preJS("1+1"))],
    quote: ["> text\n> text", doc(blockquote(p("text\ntext")))],
    hr: ["---", doc(hr())],
    // TODO: add test for hard break
    // br: [
    //     'text\rtext',
    //     doc(
    //         p('text',  br(), 'text')
    //     )
    // ],
}
