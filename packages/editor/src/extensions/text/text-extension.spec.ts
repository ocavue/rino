import { renderEditor } from "jest-remirror"
import { describe, expect, test } from "vitest"

import { buildMarkdownParser } from "../../components/wysiwyg"
import { RinoParagraphExtension, RinoTextExtension } from ".."

const setup = () => {
    const editor = renderEditor([new RinoTextExtension(), new RinoParagraphExtension()])
    const {
        view,
        add,
        nodes: { doc, p },
        manager,
        schema,
    } = editor

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

    test("non newline", () => {
        expect(parser.parse("text")).toEqualRemirrorDocument(doc(p("text")))
    })
    test("one newline", () => {
        expect(parser.parse("text\ntext")).toEqualRemirrorDocument(doc(p("text\ntext")))
    })
    test("two newlines", () => {
        expect(parser.parse("text\n\ntext")).toEqualRemirrorDocument(doc(p("text"), p("text")))
    })
    test("three newlines", () => {
        expect(parser.parse("text\n\n\ntext")).toEqualRemirrorDocument(doc(p("text"), p("text")))
    })
})
