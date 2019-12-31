import { builders } from "prosemirror-test-builder"
import { schema } from "@/editor/schema"

const def = {
    p: { nodeType: "paragraph" },
    h1: { nodeType: "rinoHeading", level: 1 },
    h2: { nodeType: "rinoHeading", level: 2 },
    h3: { nodeType: "rinoHeading", level: 3 },
    h4: { nodeType: "rinoHeading", level: 4 },
    h5: { nodeType: "rinoHeading", level: 5 },
    h6: { nodeType: "rinoHeading", level: 6 },
    hr: { nodeType: "rinoHorizontalRule" },
    li: { nodeType: "rinoListItem" },
    checkedCheckbox: { nodeType: "rinoCheckbox", checked: true },
    uncheckedCheckbox: { nodeType: "rinoCheckbox", checked: false },
    ol: { nodeType: "rinoOrderedList" },
    ul: { nodeType: "rinoBulletList" },
    br: { nodeType: "rinoHardBreak" },
    pre: { nodeType: "rinoCodeBlock" },
    preJS: { nodeType: "rinoCodeBlock", language: "javascript" },
    blockquote: { nodeType: "rinoBlockquote" },
    table: { nodeType: "rinoTable" },
    tableRow: { nodeType: "rinoTableRow" },
    tableCell: { nodeType: "rinoTableCell" },
}

const nodes = builders(schema, def)

describe("schema", function() {
    describe("types", function() {
        for (const key of Object.keys(def)) {
            it(`key: ${key}`, function() {
                expect(typeof nodes[key]).toBe("function")
            })
        }
    })
})

export { nodes }
