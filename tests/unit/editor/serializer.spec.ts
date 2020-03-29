import { TaggedProsemirrorNode } from "prosemirror-test-builder"

import { buildMarkdownSerializer } from "src/editor/components/wysiwyg/wysiwyg-markdown"
import { dedent } from "src/utils"

import { createBaseTestcases, nodes, wysiwygManager } from "./base"

const { doc, p, li, ul, uncheckedCheckbox, checkedCheckbox } = nodes

const markdownSerializer = buildMarkdownSerializer(wysiwygManager)
function assertEqual(expectedMarkdown: string, receivedNode: TaggedProsemirrorNode) {
    expect(markdownSerializer.serialize(receivedNode)).toBe(expectedMarkdown)
}

describe("base markdown serializer", () => {
    describe("base test cases", function () {
        for (const [caseName, [markdown, node]] of Object.entries(createBaseTestcases())) {
            test(caseName, function () {
                assertEqual(markdown, node)
            })
        }
    })
})

describe("list markdown serializer", () => {
    describe("selectable list", function () {
        it("checked list", function () {
            assertEqual(
                dedent(
                    `
                    * [x] list item 1
                    * [x] list item 2
                    * [x] list item 3
                    `,
                ).trim(),
                doc(
                    ul(
                        li(checkedCheckbox(), p("list item 1")),
                        li(checkedCheckbox(), p("list item 2")),
                        li(checkedCheckbox(), p("list item 3")),
                    ),
                ),
            )
        })
        it("unchecked list", function () {
            assertEqual(
                dedent(
                    `
                    * [ ] list item 1
                    * [ ] list item 2
                    * [ ] list item 3
                    `,
                ).trim(),
                doc(
                    ul(
                        li(uncheckedCheckbox(), p("list item 1")),
                        li(uncheckedCheckbox(), p("list item 2")),
                        li(uncheckedCheckbox(), p("list item 3")),
                    ),
                ),
            )
        })
        it("mixed list", function () {
            assertEqual(
                dedent(
                    `
                    * [ ] list item 1
                    * [x] list item 2
                    * [ ] list item 3
                    `,
                ).trim(),
                doc(
                    ul(
                        li(uncheckedCheckbox(), p("list item 1")),
                        li(checkedCheckbox(), p("list item 2")),
                        li(uncheckedCheckbox(), p("list item 3")),
                    ),
                ),
            )
        })
        it("selectable list item and bullet list item", function () {
            assertEqual(
                dedent(
                    `
                    * [ ] list item 1
                    * [x] list item 2
                    * list item 3
                    `,
                ).trim(),
                doc(
                    ul(
                        li(uncheckedCheckbox(), p("list item 1")),
                        li(checkedCheckbox(), p("list item 2")),
                        li(p("list item 3")),
                    ),
                ),
            )
            assertEqual(
                dedent(
                    `
                    * list item 0
                    * [ ] list item 1
                    * [x] list item 2
                    `,
                ).trim(),
                doc(
                    ul(
                        li(p("list item 0")),
                        li(uncheckedCheckbox(), p("list item 1")),
                        li(checkedCheckbox(), p("list item 2")),
                    ),
                ),
            )
        })
    })
})
