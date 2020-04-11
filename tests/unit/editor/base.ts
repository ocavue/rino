import { TaggedProsemirrorNode } from "prosemirror-test-builder"
import { builders } from "prosemirror-test-builder"

import { createWysiwygManager } from "src/editor"
import { buildMarkdownParser } from "src/editor/components/wysiwyg/wysiwyg-markdown"

export const wysiwygManager = createWysiwygManager()
export const schema = wysiwygManager.schema
export const defaultMarkdownParser = buildMarkdownParser(wysiwygManager)

export const def = {
    p: { nodeType: "paragraph" },
    h1: { nodeType: "heading", level: 1 },
    h2: { nodeType: "heading", level: 2 },
    h3: { nodeType: "heading", level: 3 },
    h4: { nodeType: "heading", level: 4 },
    h5: { nodeType: "heading", level: 5 },
    h6: { nodeType: "heading", level: 6 },
    hr: { nodeType: "horizontalRule" },
    li: { nodeType: "rinoListItem" },
    checkedCheckbox: { nodeType: "rinoCheckbox", checked: true },
    uncheckedCheckbox: { nodeType: "rinoCheckbox", checked: false },
    ol: { nodeType: "rinoOrderedList" },
    ul: { nodeType: "rinoBulletList" },
    br: { nodeType: "hardBreak" },
    pre: { nodeType: "codeBlock" },
    preJS: { nodeType: "codeBlock", language: "javascript", userInputLanguage: "javascript" },
    blockquote: { nodeType: "rinoBlockquote" },
    table: { nodeType: "table" },
    tableRow: { nodeType: "tableRow" },
    tableCell: { nodeType: "tableCell" },
} as const

export const nodes = builders(schema, def)

if (!nodes) throw new Error(`nodes is ${nodes}`)

const { doc, p, h1, h6, pre, preJS, blockquote, hr } = nodes

export const createBaseTestcases = (): Record<string, [string, TaggedProsemirrorNode]> => ({
    paragraph: ["hello", doc(p("hello"))],
    h1: ["# hello", doc(h1("hello"))],
    h6: ["###### hello", doc(h6("hello"))],
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
})
