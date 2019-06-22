import { TaggedProsemirrorNode } from "prosemirror-test-builder"
import { assert } from 'chai';
import 'mocha';
import { defaultMarkdownSerializer } from "../src/prosemirror2markdown";
import { testcases } from './base'

describe("markdown parser", () => {
    function assertEqual(markdown: string, node: TaggedProsemirrorNode) {
        assert.equal(
            markdown,
            defaultMarkdownSerializer.serialize(node),
        )
    }

    for (let [caseName, [markdown, node]] of Object.entries(testcases)) {
        it(caseName, function () {
            assertEqual(markdown, node)
        })
    }
})
