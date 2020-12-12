import { renderEditor } from "jest-remirror"

import { RinoCorePreset } from "../../../components"
import { buildMarkdownSerializer } from "../../../components/wysiwyg/wysiwyg-markdown"
import { RinoHardBreakExtension } from "../../../extensions"

const setup = () => {
    const {
        view,
        add,
        nodes: { doc, p, hardBreak },
        manager,
        schema,
    } = renderEditor([new RinoHardBreakExtension(), new RinoCorePreset({})])

    return {
        manager,
        view,
        schema,
        add,
        doc,
        p,
        hardBreak,
    }
}

describe("shortcut", () => {
    const { add, doc, p, hardBreak } = setup()

    test("press Shift+Enter", () => {
        add(doc(p("123<cursor>456")))
            .press("Shift-Enter")
            .callback((content) => {
                expect(content.state.doc).toEqualRemirrorDocument(doc(p("123", hardBreak(), "456")))
            })
    })
})

describe("toMarkdown", () => {
    const { manager, doc, p, hardBreak } = setup()
    const serializer = buildMarkdownSerializer(manager)

    test("hardbreak in a paragraph", () => {
        expect(serializer.serialize(doc(p("123", hardBreak(), "456")))).toEqual("123\n456")
    })
})
