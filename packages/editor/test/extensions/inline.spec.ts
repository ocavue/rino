import { renderEditor } from "jest-remirror"
import { EditorState } from "prosemirror-state"

import {
    RinoHeadingExtension,
    RinoInlineDecorationExtension,
    RinoInlineMarkExtension,
    rinoMarkExtensions,
    RinoParagraphExtension,
    RinoTextExtension,
} from "../../src/extensions"

const setup = () => {
    const {
        view,
        add,
        nodes: { doc, p },
        attributeNodes: { heading },
        attributeMarks: { mdCodeSpace, mdCodeText, mdText, mdMark, mdStrong, mdEm, mdDel },
        manager,
        schema,
    } = renderEditor([
        ...rinoMarkExtensions,
        new RinoInlineDecorationExtension(),
        new RinoInlineMarkExtension(true),
        new RinoParagraphExtension(),
        new RinoTextExtension(),
        new RinoHeadingExtension(),
    ])

    const h1 = heading({ level: 1 })

    return {
        manager,
        view,
        schema,
        add,
        doc,
        p,
        h1,
        mdStrong,
        mdEm,
        mdDel,
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

describe("Toggle inline marks by using shortcuts", () => {
    const { doc, p, h1, add, mdStrong, mdEm, mdDel, mdText, mdMark } = setup()

    describe("add marks", () => {
        test("strong", () => {
            const editor = add(doc(p("hello <start>world<end>")))

            editor.shortcut("Mod-b")

            expect(editor.state.doc).toEqualRemirrorDocument(
                doc(
                    p(
                        mdText({ depth: 1, first: true, last: true })("hello "),
                        mdMark({ depth: 1, first: true })("**"),
                        mdStrong({ depth: 2 })("world"),
                        mdMark({ depth: 1, last: true })("**"),
                    ),
                ),
            )

            expect(getSelectedText(editor.state)).toEqual("world")
        })

        test("emphasis", () => {
            const editor = add(doc(h1("hello <start>w<end>orld")))

            editor.shortcut("Mod-i")

            expect(editor.state.doc).toEqualRemirrorDocument(
                doc(
                    h1(
                        mdText({ depth: 1, first: true, last: true })("hello "),
                        mdMark({ depth: 1, first: true })("*"),
                        mdEm({ depth: 2 })("w"),
                        mdMark({ depth: 1, last: true })("*"),
                        mdText({ depth: 1, first: true, last: true })("orld"),
                    ),
                ),
            )

            expect(getSelectedText(editor.state)).toEqual("w")
        })

        test("strike", () => {
            const editor = add(doc(p("hello <start><end>")))

            editor.shortcut("mod-shift-s")

            expect(editor.state.doc).toEqualRemirrorDocument(
                doc(
                    p(
                        mdText({ depth: 1, first: true, last: true })("hello ~~~~"), //
                    ),
                ),
            )

            expect(getSelectedText(editor.state)).toEqual("")

            editor.insertText("x")

            expect(editor.state.doc).toEqualRemirrorDocument(
                doc(
                    p(
                        mdText({ depth: 1, first: true, last: true })("hello "),
                        mdMark({ depth: 1, first: true })("~~"),
                        mdDel({ depth: 2 })("x"),
                        mdMark({ depth: 1, last: true })("~~"),
                    ),
                ),
            )
        })
    })

    describe("remove marks", () => {
        describe("simple strong", () => {
            const originText = "**|world|**"

            for (let i = 0; i <= originText.length; i++) {
                for (let j = i; j <= originText.length; j++) {
                    const tagedText = originText.slice(0, i) + "<start>" + originText.slice(i, j) + "<end>" + originText.slice(j)
                    const expectedSelectedText = originText.slice(i, j).replaceAll("|", "").replaceAll("*", "")

                    const [part1, part2, part3] = tagedText.split("|")
                    test(`${part1} ${part2} ${part3}`, () => {
                        const editor = add(
                            doc(
                                p(
                                    mdText({ depth: 1, first: true, last: true })("hello "),
                                    mdMark({ depth: 1, first: true })(part1),
                                    mdStrong({ depth: 2 })(part2),
                                    mdMark({ depth: 1, last: true })(part3),
                                ),
                            ),
                        )
                        editor.shortcut("Mod-b")
                        expect(editor.state.doc).toEqualRemirrorDocument(
                            doc(p(mdText({ depth: 1, first: true, last: true })("hello world"))),
                        )
                        expect(getSelectedText(editor.state)).toEqual(expectedSelectedText)
                        // expect(editor.state.selection.from).toEqual(expectedSelectronFrom)
                    })
                }
            }
        })

        describe("simple emphasis", () => {
            const originText = "*|world|*"

            for (let i = 0; i <= originText.length; i++) {
                for (let j = i; j <= originText.length; j++) {
                    const tagedText = originText.slice(0, i) + "<start>" + originText.slice(i, j) + "<end>" + originText.slice(j)
                    const expectedSelectedText = originText.slice(i, j).replaceAll("|", "").replaceAll("*", "")

                    const [part1, part2, part3] = tagedText.split("|")
                    test(`${part1} ${part2} ${part3}`, () => {
                        const editor = add(
                            doc(
                                p(
                                    mdText({ depth: 1, first: true, last: true })("hello "),
                                    mdMark({ depth: 1, first: true })(part1),
                                    mdEm({ depth: 2 })(part2),
                                    mdMark({ depth: 1, last: true })(part3),
                                ),
                            ),
                        )
                        editor.shortcut("Mod-i")
                        expect(editor.state.doc).toEqualRemirrorDocument(
                            doc(p(mdText({ depth: 1, first: true, last: true })("hello world"))),
                        )
                        expect(getSelectedText(editor.state)).toEqual(expectedSelectedText)
                        // expect(editor.state.selection.from).toEqual(expectedSelectronFrom)
                    })
                }
            }
        })
    })
})

function getSelectedText(state: EditorState): string {
    const { from, to } = state.selection
    return state.doc.textBetween(from, to)
}
