import { eq, TaggedProsemirrorNode } from "prosemirror-test-builder"
import { assert } from 'chai';
import 'mocha';
import { defaultMarkdownParser } from "../src/markdown2prosemirror";
import { testcases } from './base'

describe("markdown parser", () => {
    function assertEqual(markdown: string, node: TaggedProsemirrorNode) {
        let parsed = defaultMarkdownParser.parse(markdown);
        let isEqual = eq(parsed, node)
        // if (!isEqual) {
        //     console.dir(mdNode['content']['content'], { depth: 3 })
        //     console.dir(pmNode['content']['content'], { depth: 3 })
        // }
        assert.isTrue(isEqual)
    }


    for (let [caseName, [markdown, node]] of Object.entries(testcases)) {
        it(caseName, function () {
            assertEqual(markdown, node)
        })
    }
})
