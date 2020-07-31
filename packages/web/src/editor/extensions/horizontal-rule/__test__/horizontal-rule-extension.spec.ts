import { renderEditor } from "jest-remirror"

import { RinoCorePreset } from "src/editor/components"
import {
    buildMarkdownParser,
    buildMarkdownSerializer,
} from "src/editor/components/wysiwyg/wysiwyg-markdown"
import { RinoHorizontalRuleExtension } from "src/editor/extensions"

const setup = () => {
    const {
        view,
        add,
        nodes: { doc, p, horizontalRule },
        manager,
        schema,
    } = renderEditor([new RinoHorizontalRuleExtension(), new RinoCorePreset({})])
    return {
        manager,
        view,
        schema,
        add,
        doc,
        p,
        hr: horizontalRule,
    }
}

describe("fromMarkdown", () => {
    const { manager, doc, p, hr } = setup()
    const parser = buildMarkdownParser(manager)

    test("base", () => {
        expect(parser.parse("--")).toEqualRemirrorDocument(doc(p("--")))
        expect(parser.parse("---")).toEqualRemirrorDocument(doc(hr()))
        expect(parser.parse("----")).toEqualRemirrorDocument(doc(hr()))
        expect(parser.parse("-----")).toEqualRemirrorDocument(doc(hr()))
    })
})

describe("toMarkdown", () => {
    const { manager, doc, p, hr } = setup()
    const serializer = buildMarkdownSerializer(manager)

    test("base", () => {
        expect(serializer.serialize(doc(hr()))).toEqual("---")
        expect(serializer.serialize(doc(p("1"), hr(), p("2")))).toEqual("1\n\n\n---\n\n\n2")
    })
})
