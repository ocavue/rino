import { eq } from "prosemirror-test-builder"
import { assert } from 'chai';
import 'mocha';
import { defaultMarkdownParser } from "../src/markdown2prosemirror";
import { nodes } from "./schema.test"

describe("markdown parser", () => {
    function checkEq(a: any, b: any) {
        let isEqual = eq(a, b)
        if (!isEqual) {
            console.dir(a['content']['content'], { depth: 3 })
            console.dir(b['content']['content'], { depth: 3 })
        }
        assert.isTrue(isEqual)
    }

    // TODO: add comments
    const { doc, p, h1, ol, li, pre, preJS } = nodes

    it("paragraph", () => {
        checkEq(
            defaultMarkdownParser.parse('hello'),
            doc(
                p('hello'),
            ),
        )
    })
    it("heading", () => {
        checkEq(
            defaultMarkdownParser.parse('# hello'),
            doc(
                h1('hello'),
            ),
        )
    })
    it("ordered list", () => {
        checkEq(
            defaultMarkdownParser.parse('1. aaa\n2. bbb\n3. ccc'),
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
            defaultMarkdownParser.parse('```\n1\n```'),
            doc(
                pre('1'),
            ),
        )
        checkEq(
            defaultMarkdownParser.parse('```javascript\n1\n```'),
            doc(
                preJS('1'),
            ),
        )
    })
})
