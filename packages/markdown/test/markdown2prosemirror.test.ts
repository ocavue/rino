import { eq, TaggedProsemirrorNode } from "prosemirror-test-builder"
import { assert } from 'chai';
import 'mocha';
import { defaultMarkdownParser } from "../src/markdown2prosemirror";
import { defaultMarkdownSerializer } from "../src/prosemirror2markdown";
import { nodes } from "./schema.test"

describe("markdown parser", () => {
    function checkEq(markdown: string, pmNode: TaggedProsemirrorNode) {
        let mdNode = defaultMarkdownParser.parse(markdown);
        let isEqual = eq(mdNode, pmNode)
        if (!isEqual) {
            console.dir(mdNode['content']['content'], { depth: 3 })
            console.dir(pmNode['content']['content'], { depth: 3 })
        }
        assert.isTrue(isEqual)

        assert.equal(markdown, defaultMarkdownSerializer.serialize(pmNode))
    }

    // TODO: add comments
    const { doc, p, h1, ol, li, pre, preJS } = nodes

    it("paragraph", () => {
        checkEq(
            'hello',
            doc(
                p('hello'),
            ),
        )
    })
    it("heading", () => {
        checkEq(
            '# hello',
            doc(
                h1('hello'),
            ),
        )
    })
    it("ordered list", () => {
        checkEq(
            '1. aaa\n\n\n2. bbb\n\n\n3. ccc',
            doc(
                ol(
                    li(p('aaa')),
                    li(p('bbb')),
                    li(p('ccc')),
                )
            ),
        )
    })
    it("code block", () => {
        checkEq(
            '```\n1+1\n```',
            doc(
                pre('1+1'),
            ),
        )
        checkEq(
            '```javascript\n1+1\n```',
            doc(
                preJS('1+1'),
            ),
        )
    })
})
