import { renderEditor } from "jest-remirror"

import { buildMarkdownParser } from "src/editor/components/wysiwyg/wysiwyg-markdown"
import { RinoParagraphExtension } from "src/editor/extensions"

import { RinoTextExtension } from ".."

const setup = () => {
    const {
        view,
        add,
        nodes: { doc, p },
        manager,
        schema,
    } = renderEditor({
        plainNodes: [new RinoTextExtension(), new RinoParagraphExtension()],
        others: [],
    })

    return {
        manager,
        view,
        schema,
        add,
        doc,
        p,
    }
}

describe("fromMarkdown", () => {
    const { manager, doc, p } = setup()
    const parser = buildMarkdownParser(manager)

    test("not-break", () => {
        expect(parser.parse("text")).toEqualRemirrorDocument(doc(p("text")))
    })
    test("soft-break", () => {
        expect(parser.parse("text\ntext")).toEqualRemirrorDocument(doc(p("text\ntext")))
    })
    test("hard-break", () => {
        expect(parser.parse("text\n\ntext")).toEqualRemirrorDocument(doc(p("text"), p("text")))
    })
})
