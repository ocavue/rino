import { renderEditor } from "jest-remirror"

import { RinoParagraphExtension } from "../../../extensions"
import { RinoTextExtension } from "../../../extensions"
import { RinoInlineDecorationExtension, RinoInlineMarkExtension, rinoMarkExtensions } from ".."

const setup = () => {
    const {
        view,
        add,
        nodes: { doc, p },
        attributeMarks: { mdCodeSpace, mdCodeText, mdText, mdMark },
        manager,
        schema,
    } = renderEditor([
        ...rinoMarkExtensions,
        new RinoInlineDecorationExtension(),
        new RinoInlineMarkExtension(true),
        new RinoParagraphExtension(),
        new RinoTextExtension(),
    ])

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
        mdMark,
    }
}

describe("Mark transform", () => {
    const { doc, p, add, mdCodeText, mdText, mdMark } = setup()

    describe("inline code", () => {
        test("base case", () => {
            return new Promise((done) => {
                const root = doc(p("text`code`text<cursor>"))

                const context = add(root).insertText(" ")

                context.callback((content) => {
                    expect(content.state.doc).toEqualRemirrorDocument(
                        doc(
                            p(
                                mdText({ depth: 1, first: true, last: true })("text"),
                                mdMark({ depth: 1, first: true })("`"),
                                mdCodeText({ depth: 1 })("code"),
                                mdMark({ depth: 1, last: true })("`"),
                                mdText({ depth: 1, first: true, last: true })("text "),
                            ),
                        ),
                    )
                })
                done(null)
            })
        })
    })
})
