import { renderEditor } from "jest-remirror"

import { buildMarkdownParser } from "src/editor/components/wysiwyg/wysiwyg-markdown"
import {
    RinoHardBreakExtension,
    RinoHeadingExtension,
    RinoParagraphExtension,
    RinoTextExtension,
} from "src/editor/extensions"

const setup = () => {
    const {
        view,
        add,
        nodes: { doc, p },
        attrNodes: { heading },
        manager,
        schema,
    } = renderEditor({
        plainNodes: [
            new RinoHardBreakExtension(),
            new RinoTextExtension(),
            new RinoParagraphExtension(),
        ],
        attrNodes: [new RinoHeadingExtension()],
        others: [],
    })

    const [h1, h2, h3, h4, h5, h6] = [
        heading({ level: 1 }),
        heading({ level: 2 }),
        heading({ level: 3 }),
        heading({ level: 4 }),
        heading({ level: 5 }),
        heading({ level: 6 }),
    ]

    return {
        manager,
        view,
        schema,
        add,
        doc,
        p,
        h1,
        h2,
        h3,
        h4,
        h5,
        h6,
    }
}

describe("fromMarkdown", () => {
    const { manager, doc, p, h1, h2, h3, h4, h5, h6 } = setup()
    const parser = buildMarkdownParser(manager)

    test("h1 ~ h6", () => {
        expect(parser.parse("# H1")).toEqualRemirrorDocument(doc(h1("H1")))
        expect(parser.parse("## H2")).toEqualRemirrorDocument(doc(h2("H2")))
        expect(parser.parse("### H3")).toEqualRemirrorDocument(doc(h3("H3")))
        expect(parser.parse("#### H4")).toEqualRemirrorDocument(doc(h4("H4")))
        expect(parser.parse("##### H5")).toEqualRemirrorDocument(doc(h5("H5")))
        expect(parser.parse("###### H6")).toEqualRemirrorDocument(doc(h6("H6")))
    })

    test("heading + pargraph", () => {
        expect(parser.parse("# H\nP")).toEqualRemirrorDocument(doc(h1("H"), p("P")))
        expect(parser.parse("# H\n\nP")).toEqualRemirrorDocument(doc(h1("H"), p("P")))
        expect(parser.parse("# H\n\n\nP")).toEqualRemirrorDocument(doc(h1("H"), p("P")))
    })

    test("pargraph + heading", () => {
        expect(parser.parse("P\n# H")).toEqualRemirrorDocument(doc(p("P"), h1("H")))
        expect(parser.parse("P\n\n# H")).toEqualRemirrorDocument(doc(p("P"), h1("H")))
        expect(parser.parse("P\n\n\n# H")).toEqualRemirrorDocument(doc(p("P"), h1("H")))
    })
})
