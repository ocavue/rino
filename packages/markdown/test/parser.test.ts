import { eq, TaggedProsemirrorNode } from "prosemirror-test-builder"
import { defaultMarkdownParser } from "../src/parser"
import { testcases } from "./base"
import { nodes } from "./schema.test"

describe("markdown parser", () => {
    function assertEqual(markdown: string, node: TaggedProsemirrorNode) {
        let parsed = defaultMarkdownParser.parse(markdown)
        let isEqual = eq(parsed, node)
        // if (!isEqual) {
        //     console.dir(mdNode['content']['content'], { depth: 3 })
        //     console.dir(pmNode['content']['content'], { depth: 3 })
        // }
        expect(isEqual).toBe(true)
    }

    describe("base test cases", function() {
        for (let [caseName, [markdown, node]] of Object.entries(testcases)) {
            it(caseName, function() {
                assertEqual(markdown, node)
            })
        }
    })

    const { doc, hr } = nodes

    it("hr with different length", function() {
        assertEqual("---", doc(hr()))
        assertEqual("----", doc(hr()))
        assertEqual("-----", doc(hr()))
        assertEqual("------", doc(hr()))
        assertEqual("-------", doc(hr()))
    })
})
