import { builders } from "prosemirror-test-builder"
import { schema } from "../src/schema"

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
    ol: { nodeType: "rinoOrderedList" },
    ul: { nodeType: "rinoBulletList" },
    br: { nodeType: "rinoHardBreak" },
    pre: { nodeType: "rinoCodeBlock" },
    preJS: { nodeType: "rinoCodeBlock", language: "javascript" },
    blockquote: { nodeType: "rinoBlockquote" },
}

const nodes = builders(schema, def)

describe("schema", function() {
    describe("types", function() {
        for (let key of Object.keys(def)) {
            it(`key: ${key}`, function() {
                expect(typeof nodes[key]).toBe("function")
            })
        }
    })
})

export { nodes }
