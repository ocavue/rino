import { RemirrorManager } from "@remirror/core"
// @ts-expect-error commonmark-spec has not types
import { tests } from "commonmark-spec"

import { dedent } from "@rino.app/common"

import { buildMarkdownParser, createWysiwygExtension } from "../../../src/components/wysiwyg"

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

describe("parser token support", () => {
    const parser = buildMarkdownParser(RemirrorManager.create(createWysiwygExtension({})))

    for (const t of tests as CommonMarkTestCase[]) {
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
        const node = parser.parse(
            dedent(`
| header | header |
| ------ | ------ |
| cell   | cell   |
| cell   | cell   |
            `),
        )
        expect(node.toJSON()).toMatchInlineSnapshot(`
          {
            "content": [
              {
                "content": [
                  {
                    "content": [
                      {
                        "attrs": {
                          "background": null,
                          "colspan": 1,
                          "colwidth": null,
                          "rowspan": 1,
                        },
                        "content": [
                          {
                            "text": "header",
                            "type": "text",
                          },
                        ],
                        "type": "tableCell",
                      },
                      {
                        "attrs": {
                          "background": null,
                          "colspan": 1,
                          "colwidth": null,
                          "rowspan": 1,
                        },
                        "content": [
                          {
                            "text": "header",
                            "type": "text",
                          },
                        ],
                        "type": "tableCell",
                      },
                    ],
                    "type": "tableRow",
                  },
                  {
                    "content": [
                      {
                        "attrs": {
                          "background": null,
                          "colspan": 1,
                          "colwidth": null,
                          "rowspan": 1,
                        },
                        "content": [
                          {
                            "text": "cell",
                            "type": "text",
                          },
                        ],
                        "type": "tableCell",
                      },
                      {
                        "attrs": {
                          "background": null,
                          "colspan": 1,
                          "colwidth": null,
                          "rowspan": 1,
                        },
                        "content": [
                          {
                            "text": "cell",
                            "type": "text",
                          },
                        ],
                        "type": "tableCell",
                      },
                    ],
                    "type": "tableRow",
                  },
                  {
                    "content": [
                      {
                        "attrs": {
                          "background": null,
                          "colspan": 1,
                          "colwidth": null,
                          "rowspan": 1,
                        },
                        "content": [
                          {
                            "text": "cell",
                            "type": "text",
                          },
                        ],
                        "type": "tableCell",
                      },
                      {
                        "attrs": {
                          "background": null,
                          "colspan": 1,
                          "colwidth": null,
                          "rowspan": 1,
                        },
                        "content": [
                          {
                            "text": "cell",
                            "type": "text",
                          },
                        ],
                        "type": "tableCell",
                      },
                    ],
                    "type": "tableRow",
                  },
                ],
                "type": "table",
              },
            ],
            "type": "doc",
          }
        `)
    })
})
