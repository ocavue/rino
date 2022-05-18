import { BlockquoteExtension } from "@remirror/extension-blockquote"
import { renderEditor } from "jest-remirror"
import { describe, expect, it } from "vitest"

import { OrderedListItemExtension } from "./ordered-list-item-extension"

const setup = () => {
    const extensions = [new OrderedListItemExtension(), new BlockquoteExtension()]
    const editor = renderEditor(extensions, {})
    const {
        view,
        add,
        nodes: { doc, p, orderedListItem, hardBreak, blockquote },
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
        oli: orderedListItem,
        hardBreak,
        blockquote,
    }
}

describe("keymap", () => {
    const { add, doc, p, oli, blockquote } = setup()

    let editor: ReturnType<typeof add>

    describe("Enter", () => {
        describe("flat", () => {
            it("can split non empty item", () => {
                editor = add(
                    doc(
                        //
                        oli(p("123")),
                        oli(p("456<cursor>")),
                    ),
                )
                editor.press("Enter")
                expect(editor.doc).toEqualRemirrorDocument(
                    doc(
                        //
                        oli(p("123")),
                        oli(p("456")),
                        oli(p("")),
                    ),
                )
                editor.insertText("X")
                expect(editor.doc).toEqualRemirrorDocument(
                    doc(
                        //
                        oli(p("123")),
                        oli(p("456")),
                        oli(p("X")),
                    ),
                )

                editor = add(
                    doc(
                        //
                        oli(p("123")),
                        oli(p("45<cursor>6")),
                    ),
                )
                editor.press("Enter")
                expect(editor.doc).toEqualRemirrorDocument(
                    doc(
                        //
                        oli(p("123")),
                        oli(p("45")),
                        oli(p("6")),
                    ),
                )
                editor.insertText("X")
                expect(editor.doc).toEqualRemirrorDocument(
                    doc(
                        //
                        oli(p("123")),
                        oli(p("45")),
                        oli(p("X6")),
                    ),
                )

                editor = add(
                    doc(
                        //
                        oli(p("1<cursor>23")),
                        oli(p("456")),
                    ),
                )
                editor.press("Enter")
                expect(editor.doc).toEqualRemirrorDocument(
                    doc(
                        //
                        oli(p("1")),
                        oli(p("23")),
                        oli(p("456")),
                    ),
                )
                editor.insertText("X")
                expect(editor.doc).toEqualRemirrorDocument(
                    doc(
                        //
                        oli(p("1")),
                        oli(p("X23")),
                        oli(p("456")),
                    ),
                )
            })

            it("can delete empty item", () => {
                editor = add(
                    doc(
                        //
                        oli(p("123")),
                        oli(p("<cursor>")),
                    ),
                )
                editor.press("Enter")
                expect(editor.doc).toEqualRemirrorDocument(
                    doc(
                        //
                        oli(p("123")),
                        p(""),
                    ),
                )
                editor.insertText("X")
                expect(editor.doc).toEqualRemirrorDocument(
                    doc(
                        //
                        oli(p("123")),
                        p("X"),
                    ),
                )

                editor = add(
                    doc(
                        //
                        oli(p("123")),
                        oli(p("<cursor>")),
                        oli(p("456")),
                    ),
                )
                editor.press("Enter")
                expect(editor.doc).toEqualRemirrorDocument(
                    doc(
                        //
                        oli(p("123")),
                        p(""),
                        oli(p("456")),
                    ),
                )
                editor.insertText("X")
                expect(editor.doc).toEqualRemirrorDocument(
                    doc(
                        //
                        oli(p("123")),
                        p("X"),
                        oli(p("456")),
                    ),
                )

                editor = add(
                    doc(
                        //
                        oli(p("<cursor>")),
                        oli(p("123")),
                    ),
                )
                editor.press("Enter")
                expect(editor.doc).toEqualRemirrorDocument(
                    doc(
                        //
                        p(""),
                        oli(p("123")),
                    ),
                )
                editor.insertText("X")
                expect(editor.doc).toEqualRemirrorDocument(
                    doc(
                        //
                        p("X"),
                        oli(p("123")),
                    ),
                )
            })
        })

        describe("nested", () => {
            it("can split non-empty sub item", () => {
                editor = add(
                    doc(
                        oli(
                            p("123"),
                            //
                            oli(p("456<cursor>")),
                        ),
                    ),
                )
                editor.press("Enter")
                expect(editor.doc).toEqualRemirrorDocument(
                    doc(
                        oli(
                            p("123"),
                            //
                            oli(p("456")),
                            oli(p("")),
                        ),
                    ),
                )
                editor.insertText("X")
                expect(editor.doc).toEqualRemirrorDocument(
                    doc(
                        oli(
                            p("123"),
                            //
                            oli(p("456")),
                            oli(p("X")),
                        ),
                    ),
                )
            })

            it("can dedent empty sub item", () => {
                editor = add(
                    doc(
                        oli(
                            p("123"),
                            //
                            oli(p("<cursor>")),
                        ),
                    ),
                )
                editor.press("Enter")
                expect(editor.doc).toEqualRemirrorDocument(
                    doc(
                        //
                        oli(p("123")),
                        oli(p("")),
                    ),
                )
                editor.insertText("X")
                expect(editor.doc).toEqualRemirrorDocument(
                    doc(
                        //
                        oli(p("123")),
                        oli(p("X")),
                    ),
                )
            })
        })

        describe("multiple paragraphs", () => {
            it("escapes the item when the cursor is in the first paragraph of the item", () => {
                editor = add(
                    doc(
                        oli(
                            //
                            p("123<cursor>"),
                            p("456"),
                            p("789"),
                        ),
                    ),
                )
                editor.press("Enter")
                expect(editor.doc).toEqualRemirrorDocument(
                    doc(
                        oli(
                            //
                            p("123"),
                        ),
                        oli(
                            //
                            p(""),
                            p("456"),
                            p("789"),
                        ),
                    ),
                )
                editor.insertText("X")
                expect(editor.doc).toEqualRemirrorDocument(
                    doc(
                        oli(
                            //
                            p("123"),
                        ),
                        oli(
                            //
                            p("X"),
                            p("456"),
                            p("789"),
                        ),
                    ),
                )
            })

            it("does not escapes the item when the cursor is in the non-first paragraph of the item", () => {
                editor = add(
                    doc(
                        oli(
                            //
                            p("123"),
                            p("456<cursor>"),
                            p("789"),
                        ),
                    ),
                )
                editor.press("Enter")
                expect(editor.doc).toEqualRemirrorDocument(
                    doc(
                        oli(
                            //
                            p("123"),
                            p("456"),
                            p(""),
                            p("789"),
                        ),
                    ),
                )
                editor.insertText("X")
                expect(editor.doc).toEqualRemirrorDocument(
                    doc(
                        oli(
                            //
                            p("123"),
                            p("456"),
                            p("X"),
                            p("789"),
                        ),
                    ),
                )
            })

            it("escapes the item when the cursor is in an empty item", () => {
                editor = add(
                    doc(
                        oli(
                            //
                            p("123"),
                            p("<cursor>"),
                            p("789"),
                        ),
                    ),
                )
                editor.press("Enter")
                expect(editor.doc).toEqualRemirrorDocument(
                    doc(
                        oli(
                            //
                            p("123"),
                        ),
                        oli(
                            //
                            p(""),
                            p("789"),
                        ),
                    ),
                )
                editor.insertText("X")
                expect(editor.doc).toEqualRemirrorDocument(
                    doc(
                        oli(
                            //
                            p("123"),
                        ),
                        oli(
                            //
                            p("X"),
                            p("789"),
                        ),
                    ),
                )
            })
        })

        describe("extra cases", () => {
            it("won't break non-list document", () => {
                editor = add(
                    doc(
                        //
                        p("1<cursor>23"),
                    ),
                )
                editor.press("Enter")
                expect(editor.doc).toEqualRemirrorDocument(
                    doc(
                        //
                        p("1"),
                        p("23"),
                    ),
                )

                editor = add(
                    doc(
                        blockquote(
                            p("123"),
                            blockquote(
                                //
                                p("4<cursor>56"),
                            ),
                        ),
                    ),
                )
                editor.press("Enter")
                expect(editor.doc).toEqualRemirrorDocument(
                    doc(
                        blockquote(
                            p("123"),
                            blockquote(
                                //
                                p("4"),
                                p("56"),
                            ),
                        ),
                    ),
                )
            })
        })
    })
})
