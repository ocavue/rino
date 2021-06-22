import { renderEditor } from "jest-remirror"

import { dedent } from "@rino.app/common"

import { buildMarkdownParser, buildMarkdownSerializer } from "../../../components/wysiwyg/wysiwyg-markdown"
import { RinoHardBreakExtension } from "../.."
import { RinoParagraphExtension } from "../../paragraph"
import { RinoTextExtension } from "../../text"
import { RinoBulletListExtension, RinoListItemExtension, RinoOrderedListExtension } from ".."
import { RinoListItemSharedExtension, RinoTaskListExtension, RinoTaskListItemExtension } from "../list-extension"

const setup = () => {
    const extensions = [
        new RinoOrderedListExtension(),
        new RinoBulletListExtension({}),
        new RinoListItemExtension({}),
        new RinoHardBreakExtension(),
        new RinoParagraphExtension(),
        new RinoTextExtension({}),
        new RinoTaskListItemExtension(),
        new RinoListItemSharedExtension(),
        new RinoTaskListExtension(),
    ]
    const result = renderEditor(extensions, {
        core: {
            // Remove `gapCursor` from `CorePreset` since it will cache the click event and cause some error.
            excludeExtensions: ["gapCursor", "paragraph", "text"],
        },
    })
    const {
        view,
        add,
        nodes: { doc, p, listItem, orderedList, taskList, hardBreak },
        attributeNodes: { taskListItem, bulletList },
        manager,
        schema,
    } = result

    const checked = taskListItem({ checked: true })
    const unchecked = taskListItem({ checked: false })

    return {
        manager,
        view,
        schema,
        add,
        doc,
        p,
        orderedList,
        bulletList,
        listItem,
        taskList,
        checked,
        unchecked,
        hardBreak,
    }
}

describe("fromMarkdown", () => {
    const { manager, doc, p, orderedList, bulletList, listItem, checked, unchecked, taskList } = setup()
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
        ).toEqualRemirrorDocument(doc(orderedList(listItem(p("111")), listItem(p("222")), listItem(p("333")))))
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
        ).toEqualRemirrorDocument(doc(orderedList(listItem(p("111")), listItem(p("222")), listItem(p("333")))))
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
        ).toEqualRemirrorDocument(doc(bulletList({ bullet: "-" })(listItem(p("111")), listItem(p("222")), listItem(p("333")))))
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
        ).toEqualRemirrorDocument(doc(bulletList({ bullet: "*" })(listItem(p("111")), listItem(p("222")), listItem(p("333")))))
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
                taskList(
                    checked(p("111")), //
                    unchecked(p("222")),
                    checked(p("333")),
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
                bulletList({bullet: "-"})(
                    listItem(
                        p("1"),
                        orderedList(
                            listItem(p("1.1")),
                            listItem(p("1.2")),
                        ),
                    ),
                    listItem(
                        p("2"),
                        orderedList(
                            listItem(p("2.1")),
                            listItem(p("2.2")),
                        ),
                    ),
                ),
            ),
        )
    })
})

describe("toMarkdown", () => {
    const { manager, doc, p, orderedList, bulletList, listItem, checked, unchecked, taskList } = setup()
    const serializer = buildMarkdownSerializer(manager)

    test("ol", () => {
        expect(
            serializer.serialize(
                doc(
                    orderedList(
                        listItem(p("111")), //
                        listItem(p("222")),
                        listItem(p("333")),
                    ),
                ),
            ),
        ).toEqual("1. 111\n" + "2. 222\n" + "3. 333")
        // Append a new line at the end
    })

    test("ul", () => {
        expect(
            serializer.serialize(
                doc(
                    bulletList({ bullet: "-" })(
                        listItem(p("111")), //
                        listItem(p("222")),
                        listItem(p("333")),
                    ),
                ),
            ),
        ).toEqual("- 111\n" + "- 222\n" + "- 333")
        expect(
            serializer.serialize(
                doc(
                    bulletList({ bullet: "*" })(
                        listItem(p("111")), //
                        listItem(p("222")),
                        listItem(p("333")),
                    ),
                ),
            ),
        ).toEqual("* 111\n" + "* 222\n" + "* 333")
    })

    test("checbox", () => {
        expect(
            serializer.serialize(
                doc(
                    taskList(
                        checked(p("111")), //
                        unchecked(p("222")),
                        unchecked(p("333")),
                    ),
                ),
            ),
        ).toEqual("- [x] 111\n" + "- [ ] 222\n" + "- [ ] 333")
    })

    test("nested list", () => {
        expect(
            serializer.serialize(
                doc(
                    orderedList(
                        listItem(
                            p("1"),
                            orderedList(
                                listItem(p("1.1")), //
                                listItem(p("1.2")),
                                listItem(p("1.3")),
                            ),
                        ),
                        listItem(
                            p("2"),
                            bulletList({ bullet: "*" })(
                                listItem(p("2.1")), //
                                listItem(p("2.2")),
                                listItem(p("2.3")),
                            ),
                        ),
                        listItem(
                            p("3"),
                            taskList(
                                checked(p("3.1")), //
                                checked(p("3.2")),
                                unchecked(p("3.3")),
                            ),
                        ),
                        listItem(p("4")),
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
                   - [x] 3.1
                   - [x] 3.2
                   - [ ] 3.3
                4. 4
                `,
            ).trim(),
        )
    })
})

describe("inputRules", () => {
    const { add, doc, p, bulletList, orderedList, listItem, checked, unchecked } = setup()

    test("ol", () => {
        add(doc(p("1.<cursor>")))
            .callback((content) => {
                expect(content.state.doc).toEqualRemirrorDocument(doc(p("1.")))
            })
            .insertText(" ")
            .callback((content) => {
                expect(content.state.doc).toEqualRemirrorDocument(doc(orderedList(listItem(p("")))))
            })
            .insertText("INSERT")
            .callback((content) => {
                expect(content.state.doc).toEqualRemirrorDocument(doc(orderedList(listItem(p("INSERT")))))
            })
    })

    test("ul", () => {
        add(doc(p("-<cursor>")))
            .callback((content) => {
                expect(content.state.doc).toEqualRemirrorDocument(doc(p("-")))
            })
            .insertText(" ")
            .callback((content) => {
                expect(content.state.doc).toEqualRemirrorDocument(doc(bulletList({ bullet: "-" })(listItem(p("")))))
            })
            .insertText("INSERT")
            .callback((content) => {
                expect(content.state.doc).toEqualRemirrorDocument(doc(bulletList({ bullet: "-" })(listItem(p("INSERT")))))
            })
    })

    // const testCheckbox = (checked: boolean) =>
    //     test(`checkbox ${checked}`, () => {
    //         add(doc(p("-<cursor>")))
    //             .callback((content) => {
    //                 expect(content.state.doc).toEqualRemirrorDocument(doc(p("-")))
    //             })
    //             .insertText(" ")
    //             .callback((content) => {
    //                 expect(content.state.doc).toEqualRemirrorDocument(doc(bulletList({ bullet: "-" })(listItem(p("")))))
    //             })
    //             .insertText(checked ? "[x]" : "[ ]")
    //             .callback((content) => {
    //                 expect(content.state.doc).toEqualRemirrorDocument(
    //                     doc(bulletList({ bullet: "-" })(listItem(p(checked ? "[x]" : "[ ]")))),
    //                 )
    //             })
    //             .insertText(" ")
    //             .callback((content) => {
    //                 expect(content.state.doc).toEqualRemirrorDocument(
    //                     doc(bulletList({ bullet: "-" })(listItem(rinoCheckbox({ checked: checked })(), p("")))),
    //                 )
    //             })
    //             .insertText("INSERT")
    //             .callback((content) => {
    //                 expect(content.state.doc).toEqualRemirrorDocument(
    //                     doc(bulletList({ bullet: "-" })(listItem(rinoCheckbox({ checked: checked })(), p("INSERT")))),
    //                 )
    //             })
    //     })

    // testCheckbox(true)
    // testCheckbox(false)
})

describe("shortcuts", () => {
    const { add, doc, p, bulletList, orderedList, listItem, checked, unchecked, taskList } = setup()

    describe("split list item", () => {
        test("ordered list", () => {
            add(doc(orderedList(listItem(p("12<cursor>34")), listItem(p("56")))))
                .press("Enter")
                .callback((content) => {
                    expect(content.state.doc).toEqualRemirrorDocument(
                        doc(orderedList(listItem(p("12")), listItem(p("34")), listItem(p("56")))),
                    )
                })
                .insertText("INSERT")
                .callback((content) => {
                    expect(content.state.doc).toEqualRemirrorDocument(
                        doc(orderedList(listItem(p("12")), listItem(p("INSERT34")), listItem(p("56")))),
                    )
                })
        })

        test("bullet list", () => {
            add(doc(bulletList({ bullet: "-" })(listItem(p("12<cursor>34")), listItem(p("56")))))
                .press("Enter")
                .callback((content) => {
                    expect(content.state.doc).toEqualRemirrorDocument(
                        doc(bulletList({ bullet: "-" })(listItem(p("12")), listItem(p("34")), listItem(p("56")))),
                    )
                })
                .insertText("INSERT")
                .callback((content) => {
                    expect(content.state.doc).toEqualRemirrorDocument(
                        doc(bulletList({ bullet: "-" })(listItem(p("12")), listItem(p("INSERT34")), listItem(p("56")))),
                    )
                })
        })

        test("checkbox list", () => {
            add(doc(taskList(checked(p("12<cursor>34")), unchecked(p("56")))))
                .press("Enter")
                .callback((content) => {
                    expect(content.state.doc).toEqualRemirrorDocument(
                        doc(taskList(checked(p("12")), unchecked(p("34")), unchecked(p("56")))),
                    )
                })
                .insertText("INSERT")
                .callback((content) => {
                    expect(content.state.doc).toEqualRemirrorDocument(
                        doc(taskList(checked(p("12")), unchecked(p("INSERT34")), unchecked(p("56")))),
                    )
                })
        })
    })

    test("Mod-]", () => {
        const doc1 = doc(
            taskList(
                checked(p("12")), //
                checked(p("56<cursor>")),
            ),
        )
        const doc2 = doc(
            taskList(
                checked(
                    p("12"),
                    taskList(
                        checked(p("56")), //
                    ),
                ),
            ),
        )
        const doc3 = doc(
            taskList(
                checked(
                    p("12"),
                    taskList(
                        checked(p("56INSERT")), //
                    ),
                ),
            ),
        )

        add(doc1)
            .shortcut("Mod-]")
            .callback((content) => {
                expect(content.state.doc).toEqualRemirrorDocument(doc2)
            })
            .insertText("INSERT")
            .callback((content) => {
                expect(content.state.doc).toEqualRemirrorDocument(doc3)
            })
    })

    test("Mod-[", () => {
        const doc1 = doc(
            taskList(
                checked(
                    p("12"),
                    taskList(
                        unchecked(p("56<cursor>")), //
                    ),
                ),
            ),
        )
        const doc2 = doc(
            taskList(
                checked(p("12")), //
                unchecked(p("56")),
            ),
        )
        const doc3 = doc(
            taskList(
                checked(p("12")), //
                unchecked(p("56INSERT")),
            ),
        )

        add(doc1)
            .shortcut("Mod-[")
            .callback((content) => {
                expect(content.state.doc).toEqualRemirrorDocument(doc2)
            })
            .insertText("INSERT")
            .callback((content) => {
                expect(content.state.doc).toEqualRemirrorDocument(doc3)
            })
    })
})
