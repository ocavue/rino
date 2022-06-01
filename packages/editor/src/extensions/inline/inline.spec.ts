import { AnyExtension } from "@remirror/core"
import { EditorState } from "@remirror/pm/state"
import { RemirrorTestChain, renderEditor, TaggedProsemirrorNode } from "jest-remirror"
import prettier from "prettier"
import { describe, expect, test } from "vitest"

import {
    RinoHeadingExtension,
    RinoInlineDecorationExtension,
    RinoInlineMarkExtension,
    rinoMarkExtensions,
    RinoParagraphExtension,
    RinoTextExtension,
} from ".."
import { applyDocMarks } from "./inline-mark-helpers"

const setup = () => {
    const editor = renderEditor([
        ...rinoMarkExtensions,
        new RinoInlineDecorationExtension(),
        new RinoInlineMarkExtension(true),
        new RinoParagraphExtension(),
        new RinoTextExtension(),
        new RinoHeadingExtension(),
    ])
    const {
        view,
        add,
        nodes: { doc, p },
        attributeNodes: { heading },
        attributeMarks: { mdCodeSpace, mdCodeText, mdText, mdMark, mdStrong, mdEm, mdDel },
        manager,
        schema,
    } = editor

    const h1 = heading({ level: 1 })

    return {
        manager,
        view,
        schema,
        add: (node: TaggedProsemirrorNode) => {
            const result = add(node)
            applyDocMarks(view)
            return result
        },
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
        test("base case", async () => {
            const root = doc(p("text`code`text<cursor>"))

            const editor = add(root).insertText(" ")

            expect(editor.state.doc).toEqualRemirrorDocument(
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
        const expectSimpleResult = <Extension extends AnyExtension>(
            originText: string,
            i: number,
            j: number,
            editor: RemirrorTestChain<Extension>,
        ) => {
            expect(editor.state.doc).toEqualRemirrorDocument(doc(p(mdText({ depth: 1, first: true, last: true })("hello world"))))

            const expectedSelectedText = originText.slice(i, j).replaceAll("|", "").replaceAll("*", "")
            expect(getSelectedText(editor.state)).toEqual(expectedSelectedText)
            if (!expectedSelectedText) {
                editor.insertText("X")
                expect(editor.state.doc.textContent).toEqual(
                    "hello " + (originText.slice(0, i) + "X" + originText.slice(j)).replaceAll("|", "").replaceAll("*", ""),
                )
            }
        }

        describe("simple strong", () => {
            const originText = "**|world|**"

            for (let i = 0; i <= originText.length; i++) {
                for (let j = i; j <= originText.length; j++) {
                    const tagedText = originText.slice(0, i) + "<start>" + originText.slice(i, j) + "<end>" + originText.slice(j)

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
                        expectSimpleResult(originText, i, j, editor)
                    })
                }
            }
        })

        describe("simple emphasis", () => {
            const originText = "*|world|*"

            for (let i = 0; i <= originText.length; i++) {
                for (let j = i; j <= originText.length; j++) {
                    const tagedText = originText.slice(0, i) + "<start>" + originText.slice(i, j) + "<end>" + originText.slice(j)

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
                        expectSimpleResult(originText, i, j, editor)
                    })
                }
            }
        })
    })
})

describe("Decoration", () => {
    const { doc, p, add, view } = setup()

    const getHTML = () => prettier.format(view.dom.innerHTML, { parser: "html" }).trim()

    test("plain text", () => {
        add(doc(p("plain text")))
        expect(getHTML()).toMatchInlineSnapshot('"<p><span>plain text</span></p>"')
    })

    test("single mark, empty selection", async () => {
        const editor = add(doc(p()))

        editor.add(doc(p("**strong** plain<cursor>")))
        const hiddenMarkHTML = getHTML()
        expect(hiddenMarkHTML).toMatchInlineSnapshot(
            `
          "<p>
            <span class=\\"md-mark\\">**</span><strong>strong</strong
            ><span class=\\"md-mark\\">**</span><span> plain</span>
          </p>"
        `,
        )

        editor.add(doc(p("**str<cursor>ong** plain")))
        const shownMarkHTML = getHTML()
        expect(shownMarkHTML).toMatchInlineSnapshot(
            `
          "<p>
            <span class=\\"md-mark\\"><span class=\\"show\\">**</span></span
            ><strong>strong</strong
            ><span class=\\"md-mark\\"><span class=\\"show\\">**</span></span
            ><span> plain</span>
          </p>"
        `,
        )

        editor.add(doc(p("**strong** plai<cursor>n")))
        expect(getHTML()).toEqual(hiddenMarkHTML)

        editor.add(doc(p("**strong** pl<cursor>ain")))
        expect(getHTML()).toEqual(hiddenMarkHTML)

        editor.add(doc(p("**strong** p<cursor>lain")))
        expect(getHTML()).toEqual(hiddenMarkHTML)

        editor.add(doc(p("**strong** <cursor>plain")))
        expect(getHTML()).toEqual(hiddenMarkHTML)

        editor.add(doc(p("**strong**<cursor> plain")))
        expect(getHTML()).toEqual(shownMarkHTML)

        editor.add(doc(p("**strong*<cursor>* plain")))
        expect(getHTML()).toEqual(shownMarkHTML)

        editor.add(doc(p("**stron<cursor>g** plain")))
        expect(getHTML()).toEqual(shownMarkHTML)

        editor.add(doc(p("**st<cursor>rong** plain")))
        expect(getHTML()).toEqual(shownMarkHTML)

        editor.add(doc(p("**<cursor>strong** plain")))
        expect(getHTML()).toEqual(shownMarkHTML)

        editor.add(doc(p("*<cursor>*strong** plain")))
        expect(getHTML()).toEqual(shownMarkHTML)

        editor.add(doc(p("<cursor>**strong** plain")))
        expect(getHTML()).toEqual(shownMarkHTML)
    })

    test("nested mark, empty selection", async () => {
        const editor = add(doc(p()))

        editor.add(doc(p("plain **strong  ~~code~~** plain<cursor>")))
        const hiddenMarkHTML = getHTML()
        expect(hiddenMarkHTML).toMatchInlineSnapshot(
            `
          "<p>
            <span>plain </span><span class=\\"md-mark\\">**</span><strong>strong </strong
            ><span class=\\"md-mark\\">~~</span><strong><del>code</del></strong
            ><span class=\\"md-mark\\">~~</span><span class=\\"md-mark\\">**</span
            ><span> plain</span>
          </p>"
        `,
        )

        editor.add(doc(p("plain **strong  ~~co<cursor>de~~** plain")))
        const shownMarkHTML = getHTML()
        expect(shownMarkHTML).toMatchInlineSnapshot(
            `
          "<p>
            <span>plain </span><span class=\\"md-mark\\"><span class=\\"show\\">**</span></span
            ><strong>strong </strong
            ><span class=\\"md-mark\\"><span class=\\"show\\">~~</span></span
            ><strong><del>code</del></strong
            ><span class=\\"md-mark\\"><span class=\\"show\\">~~</span></span
            ><span class=\\"md-mark\\"><span class=\\"show\\">**</span></span
            ><span> plain</span>
          </p>"
        `,
        )

        editor.add(doc(p("plain **strong  ~~code~~** <cursor>plain")))
        expect(getHTML()).toEqual(hiddenMarkHTML)

        editor.add(doc(p("plain **strong  ~~code~~**<cursor> plain")))
        expect(getHTML()).toEqual(shownMarkHTML)

        editor.add(doc(p("plain **strong  ~~code~~*<cursor>* plain")))
        expect(getHTML()).toEqual(shownMarkHTML)

        editor.add(doc(p("plain **strong  ~~code~~<cursor>** plain")))
        expect(getHTML()).toEqual(shownMarkHTML)

        editor.add(doc(p("plain **strong  ~~code~<cursor>~** plain")))
        expect(getHTML()).toEqual(shownMarkHTML)

        editor.add(doc(p("plain **strong  ~~code<cursor>~~** plain")))
        expect(getHTML()).toEqual(shownMarkHTML)

        editor.add(doc(p("plain **strong  <cursor>~~code~~** plain")))
        expect(getHTML()).toEqual(shownMarkHTML)

        editor.add(doc(p("plain **strong <cursor> ~~code~~** plain")))
        expect(getHTML()).toEqual(shownMarkHTML)

        editor.add(doc(p("plain **stro<cursor>ng ~~code~~** plain")))
        expect(getHTML()).toEqual(shownMarkHTML)

        editor.add(doc(p("plain **<cursor>strong ~~code~~** plain")))
        expect(getHTML()).toEqual(shownMarkHTML)

        editor.add(doc(p("plain *<cursor>*strong ~~code~~** plain")))
        expect(getHTML()).toEqual(shownMarkHTML)

        editor.add(doc(p("plain <cursor>**strong ~~code~~** plain")))
        expect(getHTML()).toEqual(shownMarkHTML)

        editor.add(doc(p("plain<cursor> **strong ~~code~~** plain")))
        expect(getHTML()).toEqual(hiddenMarkHTML)
    })

    test("multiple nodes, empty selection", async () => {
        add(doc(p("<cursor>A *B*"), p("C *D*"), p("E *F*")))
        expect(getHTML()).toMatchInlineSnapshot(`
          "<p>
            <span>A </span><span class=\\"md-mark\\">*</span><em>B</em
            ><span class=\\"md-mark\\">*</span>
          </p>
          <p>
            <span>C </span><span class=\\"md-mark\\">*</span><em>D</em
            ><span class=\\"md-mark\\">*</span>
          </p>
          <p>
            <span>E </span><span class=\\"md-mark\\">*</span><em>F</em
            ><span class=\\"md-mark\\">*</span>
          </p>"
        `)

        add(doc(p("A *B*"), p("C *<cursor>D*"), p("E *F*")))
        expect(getHTML()).toMatchInlineSnapshot(`
          "<p>
            <span>A </span><span class=\\"md-mark\\">*</span><em>B</em
            ><span class=\\"md-mark\\">*</span>
          </p>
          <p>
            <span>C </span><span class=\\"md-mark\\"><span class=\\"show\\">*</span></span
            ><em>D</em><span class=\\"md-mark\\"><span class=\\"show\\">*</span></span>
          </p>
          <p>
            <span>E </span><span class=\\"md-mark\\">*</span><em>F</em
            ><span class=\\"md-mark\\">*</span>
          </p>"
        `)

        add(doc(p("A *B*"), p("C *D*"), p("E *F*<cursor>")))
        expect(getHTML()).toMatchInlineSnapshot(`
          "<p>
            <span>A </span><span class=\\"md-mark\\">*</span><em>B</em
            ><span class=\\"md-mark\\">*</span>
          </p>
          <p>
            <span>C </span><span class=\\"md-mark\\">*</span><em>D</em
            ><span class=\\"md-mark\\">*</span>
          </p>
          <p>
            <span>E </span><span class=\\"md-mark\\"><span class=\\"show\\">*</span></span
            ><em>F</em><span class=\\"md-mark\\"><span class=\\"show\\">*</span></span>
          </p>"
        `)
    })
})

function getSelectedText(state: EditorState): string {
    const { from, to } = state.selection
    return state.doc.textBetween(from, to)
}
