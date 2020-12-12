import { EditorSchema, fromHtml, toHtml } from "@remirror/core"
import { renderEditor, TaggedProsemirrorNode } from "jest-remirror"

import { dedent } from "@rino.app/common/dist/util"

import { buildMarkdownParser, buildMarkdownSerializer } from "../../../components/wysiwyg/wysiwyg-markdown"
import { RinoHardBreakExtension } from "../../../extensions"
import { RinoParagraphExtension } from "../../paragraph"
import { RinoTextExtension } from "../../text"
import { RinoBulletListExtension, RinoCheckboxExtension, RinoListItemExtension, RinoOrderedListExtension } from ".."

const html = String.raw

function simplifyHTML(html: string) {
    return html.replace(/((?<=\>)\s+|^\s+)/g, "")
}

const setup = () => {
    const combineds = [
        new RinoOrderedListExtension(),
        new RinoBulletListExtension(),
        new RinoListItemExtension(),
        new RinoHardBreakExtension(),
        new RinoCheckboxExtension(),
        new RinoParagraphExtension(),
        new RinoTextExtension({}),
    ]
    const result = renderEditor(combineds, {
        core: {
            // Remove `gapCursor` from `CorePreset` since it will cache the click event and cause some error.
            excludeExtensions: ["gapCursor", "paragraph", "text"],
        },
    })
    const {
        view,
        add,
        nodes: { doc, p, rinoListItem, rinoOrderedList, rinoBulletList, hardBreak },
        attributeNodes: { rinoCheckbox },
        manager,
        schema,
    } = result

    return {
        manager,
        view,
        schema,
        add,
        doc,
        p,
        rinoOrderedList,
        rinoBulletList,
        rinoListItem,
        rinoCheckbox,
        hardBreak,
    }
}

describe("schema", () => {
    const { doc, schema, p, rinoOrderedList, rinoBulletList, rinoListItem, rinoCheckbox, hardBreak } = setup()

    function testHtmlTransformation<S extends EditorSchema>(node: TaggedProsemirrorNode<S>, html: string) {
        test("dump to html", () => {
            expect(toHtml({ node, schema })).toBe(html)
        })
        test("parse from html", () => {
            expect(fromHtml({ content: html, schema })).toEqualProsemirrorNode(doc(node))
        })
    }

    describe("single-line", () => {
        describe("bullet list", () => {
            const node = rinoBulletList(rinoListItem(p("111")), rinoListItem(p("222")), rinoListItem(p("333")), rinoListItem(p("444")))

            const html = `<ul>` + `<li><p>111</p></li>` + `<li><p>222</p></li>` + `<li><p>333</p></li>` + `<li><p>444</p></li>` + `</ul>`

            testHtmlTransformation(node, html)
        })
        describe("ordered list", () => {
            const node = rinoOrderedList(rinoListItem(p("111")), rinoListItem(p("222")), rinoListItem(p("333")), rinoListItem(p("444")))

            const html = `<ol>` + `<li><p>111</p></li>` + `<li><p>222</p></li>` + `<li><p>333</p></li>` + `<li><p>444</p></li>` + `</ol>`

            testHtmlTransformation(node, html)
        })
        describe("checkbox list", () => {
            const checked = rinoCheckbox({ checked: true })()
            const uncheck = rinoCheckbox()()

            const node = rinoBulletList(
                rinoListItem(checked, p("111")),
                rinoListItem(checked, p("222")),
                rinoListItem(uncheck, p("333")),
                rinoListItem(uncheck, p("444")),
            )

            const html =
                `<ul>` +
                `<li><input type="checkbox" checked=""><p>111</p></li>` +
                `<li><input type="checkbox" checked=""><p>222</p></li>` +
                `<li><input type="checkbox"><p>333</p></li>` +
                `<li><input type="checkbox"><p>444</p></li>` +
                `</ul>`

            testHtmlTransformation(node, html)
        })
    })

    describe("multiple-line", () => {
        describe("bullet list", () => {
            testHtmlTransformation(
                rinoBulletList(rinoListItem(p("1.a", hardBreak(), "1.b")), rinoListItem(p("2.a", hardBreak(), "2.b"))),
                // prettier-ignore
                simplifyHTML(html`
                    <ul>
                        <li>
                            <p>1.a<br>1.b</p>
                        </li><li>
                            <p>2.a<br>2.b</p>
                        </li>
                    </ul>
                `),
            )
        })
        describe("ordered list", () => {
            testHtmlTransformation(
                rinoOrderedList(rinoListItem(p("1.a", hardBreak(), "1.b")), rinoListItem(p("2.a", hardBreak(), "2.b"))),
                // prettier-ignore
                simplifyHTML(html`
                    <ol>
                        <li>
                            <p>1.a<br>1.b</p>
                        </li><li>
                            <p>2.a<br>2.b</p>
                        </li>
                    </ol>
                `),
            )
        })
        describe("checkbox list", () => {
            const checked = rinoCheckbox({ checked: true })()
            const uncheck = rinoCheckbox()()
            testHtmlTransformation(
                rinoOrderedList(rinoListItem(checked, p("1.a", hardBreak(), "1.b")), rinoListItem(uncheck, p("2.a", hardBreak(), "2.b"))),
                // prettier-ignore
                simplifyHTML(html`
                    <ol>
                        <li>
                            <input type="checkbox" checked="">
                            <p>1.a<br>1.b</p>
                        </li>
                        <li>
                            <input type="checkbox">
                            <p>2.a<br>2.b</p>
                        </li>
                    </ol>
                `).replace(/((?<=\>)\s+|^\s+)/g, ''),
            )
        })
    })

    describe("mixed list", () => {
        testHtmlTransformation(
            // prettier-ignore
            rinoBulletList(
                rinoListItem(
                    rinoCheckbox({checked: true})(),
                    p(
                        '1',
                        hardBreak(),
                        '1b',
                        hardBreak(),
                        '1c'
                    ),
                    rinoOrderedList(
                        rinoListItem(p("1.1"),
                        rinoBulletList(
                            rinoListItem(p("1.1.1")))
                        ),
                    ),
                ),
            ),
            // prettier-ignore
            simplifyHTML(html`
                <ul>
                    <li>
                        <input type="checkbox" checked="">
                        <p>1<br>1b<br>1c</p>
                        <ol>
                            <li>
                                <p>1.1</p>
                                <ul>
                                    <li><p>1.1.1</p></li>
                                </ul>
                            </li>
                        </ol>
                    </li>
                </ul>
            `),
        )
    })
})

describe("fromMarkdown", () => {
    const { manager, doc, p, rinoOrderedList, rinoBulletList, rinoListItem, rinoCheckbox } = setup()
    const parser = buildMarkdownParser(manager)

    test("simple ordered list", () => {
        expect(
            parser.parse(
                dedent(
                    `
                    1. 111
                    2. 222
                    3. 333
                    `,
                ),
            ),
        ).toEqualRemirrorDocument(doc(rinoOrderedList(rinoListItem(p("111")), rinoListItem(p("222")), rinoListItem(p("333")))))
    })

    test("ordered list with mess umber", () => {
        expect(
            parser.parse(
                dedent(
                    `
                    4. 111
                    2. 222
                    0. 333
                    `,
                ),
            ),
        ).toEqualRemirrorDocument(doc(rinoOrderedList(rinoListItem(p("111")), rinoListItem(p("222")), rinoListItem(p("333")))))
    })

    test("bullet list with '-'", () => {
        expect(
            parser.parse(
                dedent(
                    `
                    - 111
                    - 222
                    - 333
                    `,
                ),
            ),
        ).toEqualRemirrorDocument(doc(rinoBulletList(rinoListItem(p("111")), rinoListItem(p("222")), rinoListItem(p("333")))))
    })

    test("bullet list with '*'", () => {
        expect(
            parser.parse(
                dedent(
                    `
                    * 111
                    * 222
                    * 333
                    `,
                ),
            ),
        ).toEqualRemirrorDocument(doc(rinoBulletList(rinoListItem(p("111")), rinoListItem(p("222")), rinoListItem(p("333")))))
    })

    test("checkbox list", () => {
        expect(
            parser.parse(
                dedent(
                    `
                    - [x] 111
                    - [ ] 222
                    - [x] 333
                    `,
                ),
            ),
        ).toEqualRemirrorDocument(
            doc(
                rinoBulletList(
                    rinoListItem(rinoCheckbox({ checked: true })(), p("111")),
                    rinoListItem(rinoCheckbox({ checked: false })(), p("222")),
                    rinoListItem(rinoCheckbox({ checked: true })(), p("333")),
                ),
            ),
        )
    })

    test("nested list", () => {
        expect(
            parser.parse(
                dedent(
                    `
                    - 1
                      1. 1.1
                      2. 1.2
                    - 2
                      1. 2.1
                      2. 2.2
                    `,
                ),
            ),
        ).toEqualRemirrorDocument(
            // prettier-ignore
            doc(
                rinoBulletList(
                    rinoListItem(
                        p("1"),
                        rinoOrderedList(
                            rinoListItem(p("1.1")),
                            rinoListItem(p("1.2")),
                        ),
                    ),
                    rinoListItem(
                        p("2"),
                        rinoOrderedList(
                            rinoListItem(p("2.1")),
                            rinoListItem(p("2.2")),
                        ),
                    ),
                ),
            ),
        )
    })
})

describe("toMarkdown", () => {
    const { manager, doc, p, rinoOrderedList, rinoBulletList, rinoListItem, rinoCheckbox } = setup()
    const serializer = buildMarkdownSerializer(manager)

    test("ol", () => {
        expect(serializer.serialize(doc(rinoOrderedList(rinoListItem(p("111")), rinoListItem(p("222")), rinoListItem(p("333")))))).toEqual(
            "1. 111\n" + "2. 222\n" + "3. 333\n",
        )
        // Append a new line at the end
    })

    test("ul", () => {
        expect(serializer.serialize(doc(rinoBulletList(rinoListItem(p("111")), rinoListItem(p("222")), rinoListItem(p("333")))))).toEqual(
            "* 111\n" + "* 222\n" + "* 333\n",
        )
    })

    test("checbox", () => {
        expect(
            serializer.serialize(
                doc(
                    rinoBulletList(
                        rinoListItem(rinoCheckbox({ checked: true })(), p("111")),
                        rinoListItem(rinoCheckbox({ checked: true })(), p("222")),
                        rinoListItem(rinoCheckbox({ checked: false })(), p("333")),
                    ),
                ),
            ),
        ).toEqual("* [x] 111\n" + "* [x] 222\n" + "* [ ] 333\n")
    })

    test("nested list", () => {
        expect(
            serializer.serialize(
                doc(
                    rinoOrderedList(
                        rinoListItem(p("1"), rinoOrderedList(rinoListItem(p("1.1")), rinoListItem(p("1.2")), rinoListItem(p("1.3")))),
                        rinoListItem(p("2"), rinoBulletList(rinoListItem(p("2.1")), rinoListItem(p("2.2")), rinoListItem(p("2.3")))),
                        rinoListItem(
                            p("3"),
                            rinoBulletList(
                                rinoListItem(rinoCheckbox({ checked: true })(), p("3.1")),
                                rinoListItem(rinoCheckbox({ checked: true })(), p("3.2")),
                                rinoListItem(rinoCheckbox({ checked: false })(), p("3.3")),
                            ),
                        ),
                        rinoListItem(p("4")),
                    ),
                ),
            ),
        ).toEqual(
            dedent(
                `
                1. 1
                   1. 1.1
                   2. 1.2
                   3. 1.3
                2. 2
                   * 2.1
                   * 2.2
                   * 2.3
                3. 3
                   * [x] 3.1
                   * [x] 3.2
                   * [ ] 3.3
                4. 4
                `,
            ).trimStart(),
        )
    })
})

describe("inputRules", () => {
    const { add, doc, p, rinoBulletList, rinoOrderedList, rinoListItem, rinoCheckbox } = setup()

    test("ol", () => {
        add(doc(p("1.<cursor>")))
            .callback((content) => {
                expect(content.state.doc).toEqualRemirrorDocument(doc(p("1.")))
            })
            .insertText(" ")
            .callback((content) => {
                expect(content.state.doc).toEqualRemirrorDocument(doc(rinoOrderedList(rinoListItem(p("")))))
            })
            .insertText("INSERT")
            .callback((content) => {
                expect(content.state.doc).toEqualRemirrorDocument(doc(rinoOrderedList(rinoListItem(p("INSERT")))))
            })
    })

    test("ul", () => {
        add(doc(p("-<cursor>")))
            .callback((content) => {
                expect(content.state.doc).toEqualRemirrorDocument(doc(p("-")))
            })
            .insertText(" ")
            .callback((content) => {
                expect(content.state.doc).toEqualRemirrorDocument(doc(rinoBulletList(rinoListItem(p("")))))
            })
            .insertText("INSERT")
            .callback((content) => {
                expect(content.state.doc).toEqualRemirrorDocument(doc(rinoBulletList(rinoListItem(p("INSERT")))))
            })
    })

    const testCheckbox = (checked: boolean) =>
        test(`checkbox ${checked}`, () => {
            add(doc(p("-<cursor>")))
                .callback((content) => {
                    expect(content.state.doc).toEqualRemirrorDocument(doc(p("-")))
                })
                .insertText(" ")
                .callback((content) => {
                    expect(content.state.doc).toEqualRemirrorDocument(doc(rinoBulletList(rinoListItem(p("")))))
                })
                .insertText(checked ? "[x]" : "[ ]")
                .callback((content) => {
                    expect(content.state.doc).toEqualRemirrorDocument(doc(rinoBulletList(rinoListItem(p(checked ? "[x]" : "[ ]")))))
                })
                .insertText(" ")
                .callback((content) => {
                    expect(content.state.doc).toEqualRemirrorDocument(
                        doc(rinoBulletList(rinoListItem(rinoCheckbox({ checked: checked })(), p("")))),
                    )
                })
                .insertText("INSERT")
                .callback((content) => {
                    expect(content.state.doc).toEqualRemirrorDocument(
                        doc(rinoBulletList(rinoListItem(rinoCheckbox({ checked: checked })(), p("INSERT")))),
                    )
                })
        })

    testCheckbox(true)
    testCheckbox(false)
})

describe("click the checkbox", () => {
    const { add, doc, p, rinoBulletList, rinoListItem, rinoCheckbox } = setup()

    test("select a checkbox", () => {
        add(
            doc(
                rinoBulletList(
                    rinoListItem(rinoCheckbox({ checked: false })(), p("12")),
                    rinoListItem(rinoCheckbox({ checked: true })(), p("56")),
                ),
            ),
        )
            .fire({ event: "click", position: 2 })
            .callback((content) => {
                expect(content.state.doc).toEqualRemirrorDocument(
                    doc(
                        rinoBulletList(
                            rinoListItem(rinoCheckbox({ checked: true })(), p("12")),
                            rinoListItem(rinoCheckbox({ checked: true })(), p("56")),
                        ),
                    ),
                )
            })
    })

    test("unselect a checkbox", () => {
        add(
            doc(
                rinoBulletList(
                    rinoListItem(rinoCheckbox({ checked: true })(), p("12")),
                    rinoListItem(rinoCheckbox({ checked: true })(), p("56")),
                ),
            ),
        )
            .fire({ event: "click", position: 2 })
            .callback((content) => {
                expect(content.state.doc).toEqualRemirrorDocument(
                    doc(
                        rinoBulletList(
                            rinoListItem(rinoCheckbox({ checked: false })(), p("12")),
                            rinoListItem(rinoCheckbox({ checked: true })(), p("56")),
                        ),
                    ),
                )
            })
    })
})

describe("shortcuts", () => {
    const { add, doc, p, rinoBulletList, rinoOrderedList, rinoListItem, rinoCheckbox } = setup()

    describe("split list item", () => {
        test("ordered list", () => {
            add(doc(rinoOrderedList(rinoListItem(p("12<cursor>34")), rinoListItem(p("56")))))
                .press("Enter")
                .callback((content) => {
                    expect(content.state.doc).toEqualRemirrorDocument(
                        doc(rinoOrderedList(rinoListItem(p("12")), rinoListItem(p("34")), rinoListItem(p("56")))),
                    )
                })
                .insertText("INSERT")
                .callback((content) => {
                    expect(content.state.doc).toEqualRemirrorDocument(
                        doc(rinoOrderedList(rinoListItem(p("12")), rinoListItem(p("INSERT34")), rinoListItem(p("56")))),
                    )
                })
        })

        test("bullet list", () => {
            add(doc(rinoBulletList(rinoListItem(p("12<cursor>34")), rinoListItem(p("56")))))
                .press("Enter")
                .callback((content) => {
                    expect(content.state.doc).toEqualRemirrorDocument(
                        doc(rinoBulletList(rinoListItem(p("12")), rinoListItem(p("34")), rinoListItem(p("56")))),
                    )
                })
                .insertText("INSERT")
                .callback((content) => {
                    expect(content.state.doc).toEqualRemirrorDocument(
                        doc(rinoBulletList(rinoListItem(p("12")), rinoListItem(p("INSERT34")), rinoListItem(p("56")))),
                    )
                })
        })

        test("checkbox list", () => {
            add(
                doc(
                    rinoBulletList(
                        rinoListItem(rinoCheckbox({ checked: true })(), p("12<cursor>34")),
                        rinoListItem(rinoCheckbox({ checked: false })(), p("56")),
                    ),
                ),
            )
                .press("Enter")
                .callback((content) => {
                    expect(content.state.doc).toEqualRemirrorDocument(
                        doc(
                            rinoBulletList(
                                rinoListItem(rinoCheckbox({ checked: true })(), p("12")),
                                rinoListItem(rinoCheckbox({ checked: false })(), p("34")),
                                rinoListItem(rinoCheckbox({ checked: false })(), p("56")),
                            ),
                        ),
                    )
                })
                .insertText("INSERT")
                .callback((content) => {
                    expect(content.state.doc).toEqualRemirrorDocument(
                        doc(
                            rinoBulletList(
                                rinoListItem(rinoCheckbox({ checked: true })(), p("12")),
                                rinoListItem(rinoCheckbox({ checked: false })(), p("INSERT34")),
                                rinoListItem(rinoCheckbox({ checked: false })(), p("56")),
                            ),
                        ),
                    )
                })
        })
    })

    test("Mod-]", () => {
        add(
            doc(
                rinoBulletList(
                    rinoListItem(rinoCheckbox({ checked: true })(), p("12")),
                    rinoListItem(rinoCheckbox({ checked: true })(), p("56<cursor>")),
                ),
            ),
        )
            .shortcut("Mod-]")
            .callback((content) => {
                expect(content.state.doc).toEqualRemirrorDocument(
                    doc(
                        rinoBulletList(
                            rinoListItem(
                                rinoCheckbox({ checked: true })(),
                                p("12"),
                                rinoBulletList(rinoListItem(rinoCheckbox({ checked: true })(), p("56"))),
                            ),
                        ),
                    ),
                )
            })
            .insertText("INSERT")
            .callback((content) => {
                expect(content.state.doc).toEqualRemirrorDocument(
                    doc(
                        rinoBulletList(
                            rinoListItem(
                                rinoCheckbox({ checked: true })(),
                                p("12"),
                                rinoBulletList(rinoListItem(rinoCheckbox({ checked: true })(), p("56INSERT"))),
                            ),
                        ),
                    ),
                )
            })
    })

    test("Mod-[", () => {
        add(
            doc(
                rinoBulletList(
                    rinoListItem(
                        rinoCheckbox({ checked: true })(),
                        p("12"),
                        rinoBulletList(rinoListItem(rinoCheckbox({ checked: true })(), p("56<cursor>"))),
                    ),
                ),
            ),
        )
            .shortcut("Mod-[")
            .callback((content) => {
                expect(content.state.doc).toEqualRemirrorDocument(
                    doc(
                        rinoBulletList(
                            rinoListItem(rinoCheckbox({ checked: true })(), p("12")),
                            rinoListItem(rinoCheckbox({ checked: true })(), p("56")),
                        ),
                    ),
                )
            })
            .insertText("INSERT")
            .callback((content) => {
                expect(content.state.doc).toEqualRemirrorDocument(
                    doc(
                        rinoBulletList(
                            rinoListItem(rinoCheckbox({ checked: true })(), p("12")),
                            rinoListItem(rinoCheckbox({ checked: true })(), p("56INSERT")),
                        ),
                    ),
                )
            })
    })
})
