import { renderEditor } from "jest-remirror"

import { RinoParagraphExtension } from "src/editor/extensions"
import { RinoTextExtension } from "src/editor/extensions"

import { RinoInlineDecorationExtension, RinoInlineMarkExtension, rinoMarkExtensions } from ".."

const setup = () => {
    const {
        view,
        add,
        nodes: { doc, p },
        attrMarks: { mdCodeSpace, mdCodeText, mdText, mdKey },
        manager,
        schema,
    } = renderEditor({
        plainNodes: [new RinoParagraphExtension(), new RinoTextExtension()],
        attrMarks: rinoMarkExtensions,
        others: [new RinoInlineDecorationExtension(), new RinoInlineMarkExtension(true)],
    })

    return {
        manager,
        view,
        schema,
        add,
        doc,
        p,
        mdCodeSpace,
        mdCodeText,
        mdText,
        mdKey,
    }
}

describe("Mark transform", () => {
    const { doc, p, add, mdCodeText, mdText, mdKey } = setup()

    describe("inline code", () => {
        test("base case", () => {
            return new Promise((done) => {
                const root = doc(p("text`code`text<cursor>"))

                const context = add(root).insertText(" ")

                context.callback((content) => {
                    expect(content.state.doc).toEqualRemirrorDocument(
                        doc(
                            p(
                                mdText({ depth: 1, start: true, end: true })("text"),
                                mdKey({ depth: 1, start: true })("`"),
                                mdCodeText({ depth: 1 })("code"),
                                mdKey({ depth: 1, end: true })("`"),
                                mdText({ depth: 1, start: true, end: true })("text "),
                            ),
                        ),
                    )
                })
                done()
            })
        })
    })
})
