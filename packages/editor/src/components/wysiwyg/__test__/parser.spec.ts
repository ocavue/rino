import { RemirrorManager } from "@remirror/core"

import { dedent } from "@rino.app/common"

import { createWysiwygCombined } from "../wysiwyg-extension"
import { buildMarkdownParser } from "../wysiwyg-markdown"

describe("parser token support", () => {
    /**
     * The test case format from CommonMark
     *
     * example:
     *   {
     *      markdown: 'Foo\nbar\n\n---\n\nbaz\n',
     *      html: '<p>Foo\nbar</p>\n<hr />\n<p>baz</p>\n',
     *      section: 'Setext headings',
     *      number: 74
     *   }
     */
    interface CommonMarkTestCase {
        markdown: string
        // html: string // we don't need this
        section: string
        number: number
    }

    // eslint-disable-next-line
    const tests = require("commonmark-spec").tests as CommonMarkTestCase[]
    const parser = buildMarkdownParser(RemirrorManager.create(createWysiwygCombined()))

    for (const t of tests) {
        test(`CommonMark spec test case ${t.number}`, () => {
            try {
                parser.parse(t.markdown)
            } catch (error) {
                console.warn("test case:", t)
                throw error
            }
        })
    }

    // CommonSpec doesn't contain table
    test("table", () => {
        parser.parse(
            dedent(`
                | header | header |
                | ------ | ------ |
                | cell   | cell   |
                | cell   | cell   |
            `),
        )
    })
})
