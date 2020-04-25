import { TaggedProsemirrorNode } from "prosemirror-test-builder"

import { buildMarkdownSerializer } from "src/editor/components/wysiwyg/wysiwyg-markdown"

import { createBaseTestcases, wysiwygManager } from "./base"

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
