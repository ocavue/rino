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

describe("Enter", () => {
    const { add, doc, p, oli, blockquote } = setup()

    let editor: ReturnType<typeof add>

    it("can split non-empty item", () => {
        editor = add(
            doc(
                //
                oli(p("123")),
                oli(p("456<cursor>")),
            ),
        )
        editor.press("Enter")
        expect(editor.state).toEqualRemirrorState(
            doc(
                //
                oli(p("123")),
                oli(p("456")),
                oli(p("<cursor>")),
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
        expect(editor.state).toEqualRemirrorState(
            doc(
                //
                oli(p("123")),
                oli(p("45")),
                oli(p("<cursor>6")),
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
        expect(editor.state).toEqualRemirrorState(
            doc(
                //
                oli(p("1")),
                oli(p("<cursor>23")),
                oli(p("456")),
            ),
        )
    })

    it("can split non-empty sub item", () => {
        editor = add(
            doc(
                oli(
                    //
                    p("123"),
                    oli(p("456<cursor>")),
                ),
            ),
        )
        editor.press("Enter")
        expect(editor.state).toEqualRemirrorState(
            doc(
                oli(
                    //
                    p("123"),
                    oli(p("456")),
                    oli(p("<cursor>")),
                ),
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
        expect(editor.state).toEqualRemirrorState(
            doc(
                //
                oli(p("123")),
                p("<cursor>"),
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
        expect(editor.state).toEqualRemirrorState(
            doc(
                //
                oli(p("123")),
                p("<cursor>"),
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
        expect(editor.state).toEqualRemirrorState(
            doc(
                //
                p("<cursor>"),
                oli(p("123")),
            ),
        )
    })

    it("can dedent empty sub item", () => {
        editor = add(
            doc(
                oli(
                    //
                    p("123"),
                    oli(p("<cursor>")),
                ),
            ),
        )
        editor.press("Enter")
        expect(editor.state).toEqualRemirrorState(
            doc(
                oli(
                    //
                    p("123"),
                    p("<cursor>"),
                ),
            ),
        )
    })

    it("can delete selected text", () => {
        editor = add(
            doc(
                //
                oli(p("<start>123<end>")),
                oli(p("456")),
            ),
        )
        editor.press("Enter")
        expect(editor.state).toEqualRemirrorState(
            doc(
                //
                oli(p("")),
                oli(p("<cursor>")),
                oli(p("456")),
            ),
        )
    })

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
        expect(editor.state).toEqualRemirrorState(
            doc(
                oli(
                    //
                    p("123"),
                ),
                oli(
                    //
                    p("<cursor>"),
                    p("456"),
                    p("789"),
                ),
            ),
        )

        // Nested list item
        editor = add(
            doc(
                oli(
                    p("0"),
                    oli(
                        //
                        p("123<cursor>"),
                        p("456"),
                        p("789"),
                    ),
                ),
            ),
        )
        editor.press("Enter")
        expect(editor.state).toEqualRemirrorState(
            doc(
                oli(
                    p("0"),
                    oli(
                        //
                        p("123"),
                    ),
                    oli(
                        //
                        p("<cursor>"),
                        p("456"),
                        p("789"),
                    ),
                ),
            ),
        )
    })

    it("does not escapes the item when the cursor is not in the first paragraph of the item", () => {
        // Cursor in the last paragraph of the item
        editor = add(
            doc(
                oli(
                    //
                    p("123"),
                    p("456<cursor>"),
                ),
            ),
        )
        editor.press("Enter")
        expect(editor.state).toEqualRemirrorState(
            doc(
                oli(
                    //
                    p("123"),
                    p("456"),
                    p("<cursor>"),
                ),
            ),
        )
        editor.press("Enter")
        expect(editor.state).toEqualRemirrorState(
            doc(
                oli(
                    //
                    p("123"),
                    p("456"),
                    p(""),
                    p("<cursor>"),
                ),
            ),
        )

        // Cursor in the middle paragraph of the item
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
        expect(editor.state).toEqualRemirrorState(
            doc(
                oli(
                    //
                    p("123"),
                    p("456"),
                    p("<cursor>"),
                    p("789"),
                ),
            ),
        )
        editor.press("Enter")
        expect(editor.state).toEqualRemirrorState(
            doc(
                oli(
                    //
                    p("123"),
                    p("456"),
                    p(""),
                    p("<cursor>"),
                    p("789"),
                ),
            ),
        )

        // Cursor in the last paragraph of the item (nested list item)
        editor = add(
            doc(
                oli(
                    p(),
                    oli(
                        //
                        p("123"),
                        p("456<cursor>"),
                    ),
                ),
            ),
        )
        editor.press("Enter")
        expect(editor.state).toEqualRemirrorState(
            doc(
                oli(
                    p(),
                    oli(
                        //
                        p("123"),
                        p("456"),
                        p("<cursor>"),
                    ),
                ),
            ),
        )
        editor.press("Enter")
        expect(editor.state).toEqualRemirrorState(
            doc(
                oli(
                    p(),
                    oli(
                        //
                        p("123"),
                        p("456"),
                        p(""),
                        p("<cursor>"),
                    ),
                ),
            ),
        )

        // Cursor in the middle paragraph of the item (nested list item)
        editor = add(
            doc(
                oli(
                    p(),
                    oli(
                        //
                        p("123"),
                        p("456<cursor>"),
                        p("789"),
                    ),
                ),
            ),
        )
        editor.press("Enter")
        expect(editor.state).toEqualRemirrorState(
            doc(
                oli(
                    p(),
                    oli(
                        //
                        p("123"),
                        p("456"),
                        p("<cursor>"),
                        p("789"),
                    ),
                ),
            ),
        )
        editor.press("Enter")
        expect(editor.state).toEqualRemirrorState(
            doc(
                oli(
                    p(),
                    oli(
                        //
                        p("123"),
                        p("456"),
                        p(""),
                        p("<cursor>"),
                        p("789"),
                    ),
                ),
            ),
        )
    })

    describe("extra cases", () => {
        it("won't effect non-list document", () => {
            editor = add(
                doc(
                    //
                    p("1<cursor>23"),
                ),
            )
            editor.press("Enter")
            expect(editor.state).toEqualRemirrorState(
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
            expect(editor.state).toEqualRemirrorState(
                doc(
                    blockquote(
                        p("123"),
                        blockquote(
                            //
                            p("4"),
                            p("<cursor>56"),
                        ),
                    ),
                ),
            )
        })
    })
})
