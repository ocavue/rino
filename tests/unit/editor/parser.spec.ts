import { TaggedProsemirrorNode } from "prosemirror-test-builder"
import { Node } from "prosemirror-model"
import { defaultMarkdownParser } from "@/editor/parser"
import { testcases } from "./base"
import { nodes } from "./schema.spec"
import { dedent } from "@/editor/utils"
import { range } from "lodash"

const { doc, hr, ol, ul, li, p, checkedCheckbox, uncheckedCheckbox } = nodes

function getChildrenTypeNames(node: Node): string[] {
    return range(node.content.childCount)
        .map(i => node.child(i))
        .map(n => n.type.name)
}

function assertNodeEqual(a: Node, b: Node) {
    // Same logic as `Node#eq`
    expect(typeof a).toEqual(typeof b)
    if (!a.eq(b)) {
        expect(a.type.name).toEqual(b.type.name)
        expect(a.attrs).toStrictEqual(b.attrs)
        expect(a.sameMarkup(b)).toBe(true)

        expect(getChildrenTypeNames(a)).toStrictEqual(getChildrenTypeNames(b))
        for (let i = 0; i < Math.min(a.content.childCount, b.content.childCount); i++) {
            assertNodeEqual(a.child(i), b.child(i))
        }
        expect(a.content.childCount).toEqual(b.content.childCount)
        expect(a.content.eq(b.content)).toBe(true)
        expect(a.eq(b)).toBe(true)
    }
}

function assertEqual(markdown: string, node: TaggedProsemirrorNode) {
    const parsed = defaultMarkdownParser.parse(markdown)
    assertNodeEqual(parsed, node)
}

describe("base markdown parser", () => {
    for (const [caseName, [markdown, node]] of Object.entries(testcases)) {
        it(caseName, function() {
            assertEqual(markdown, node)
        })
    }
})

describe("<hr> markdown parser", () => {
    it("hr", function() {
        assertEqual("---", doc(hr()))
        assertEqual("----", doc(hr()))
        assertEqual("-----", doc(hr()))
        assertEqual("------", doc(hr()))
        assertEqual("-------", doc(hr()))
    })
})

describe("list markdown parser", () => {
    describe("bullet list", function() {
        it("bullet list with *", function() {
            assertEqual(
                dedent(`
                    * list item 0
                    * list item 1
                    * list item 2
                    * list item 3
                    `),
                doc(
                    ul(
                        li(p("list item 0")),
                        li(p("list item 1")),
                        li(p("list item 2")),
                        li(p("list item 3")),
                    ),
                ),
            )
        })
        it("bullet list with -", function() {
            assertEqual(
                dedent(`
                    - list item 0
                    - list item 1
                    - list item 2
                    - list item 3
                    `),
                doc(
                    ul(
                        li(p("list item 0")),
                        li(p("list item 1")),
                        li(p("list item 2")),
                        li(p("list item 3")),
                    ),
                ),
            )
        })
        it("bullet list with - and *", function() {
            assertEqual(
                dedent(`
                    - list item 0
                    - list item 1
                    * list item 2
                    * list item 3
                    `),
                doc(
                    ul(li(p("list item 0")), li(p("list item 1"))),
                    ul(li(p("list item 2")), li(p("list item 3"))),
                ),
            )
        })
    })
    describe("order list", function() {
        it("order list with offset", function() {
            assertEqual(
                dedent(`
                    5. list item 0
                    6. list item 1
                    7. list item 2
                    8. list item 3
                    `),
                doc(
                    ol(
                        li(p("list item 0")),
                        li(p("list item 1")),
                        li(p("list item 2")),
                        li(p("list item 3")),
                    ),
                ),
            )
        })
        it("order list with wrong order", function() {
            assertEqual(
                dedent(`
                    5. list item 0
                    4. list item 1
                    9. list item 2
                    1. list item 3
                    `),
                doc(
                    ol(
                        li(p("list item 0")),
                        li(p("list item 1")),
                        li(p("list item 2")),
                        li(p("list item 3")),
                    ),
                ),
            )
        })
        it("order list with same number (0)", function() {
            assertEqual(
                dedent(`
                    0. list item 0
                    0. list item 1
                    0. list item 2
                    0. list item 3
                    `),
                doc(
                    ol(
                        li(p("list item 0")),
                        li(p("list item 1")),
                        li(p("list item 2")),
                        li(p("list item 3")),
                    ),
                ),
            )
        })
        it("order list with same number (1)", function() {
            assertEqual(
                dedent(`
                    1. list item 0
                    1. list item 1
                    1. list item 2
                    1. list item 3
                    `),
                doc(
                    ol(
                        li(p("list item 0")),
                        li(p("list item 1")),
                        li(p("list item 2")),
                        li(p("list item 3")),
                    ),
                ),
            )
        })
        it("order list with same number (100)", function() {
            assertEqual(
                dedent(`
                    100. list item 0
                    100. list item 1
                    100. list item 2
                    100. list item 3
                    `),
                doc(
                    ol(
                        li(p("list item 0")),
                        li(p("list item 1")),
                        li(p("list item 2")),
                        li(p("list item 3")),
                    ),
                ),
            )
        })
        it("nset order list (shape 1)", function() {
            assertEqual(
                dedent(`
                    1. list item 1
                    2. list item 2
                        1. list item 2.1
                        2. list item 2.2
                            1. list item 2.2.1
                            2. list item 2.2.2
                            3. list item 2.2.3
                        3. list item 2.3
                        3. list item 2.4
                    3. list item 3
                    4. list item 4
                    `),
                doc(
                    ol(
                        li(p("list item 1")),
                        li(
                            p("list item 2"),
                            ol(
                                li(p("list item 2.1")),
                                li(
                                    p("list item 2.2"),
                                    ol(
                                        li(p("list item 2.2.1")),
                                        li(p("list item 2.2.2")),
                                        li(p("list item 2.2.3")),
                                    ),
                                ),
                                li(p("list item 2.3")),
                                li(p("list item 2.4")),
                            ),
                        ),
                        li(p("list item 3")),
                        li(p("list item 4")),
                    ),
                ),
            )
        })
        it("nset order list (shape 2)", function() {
            assertEqual(
                dedent(`
                    1. list item 1
                    2. list item 2
                        1. list item 2.1
                        2. list item 2.2
                            1. list item 2.2.1
                            2. list item 2.2.2
                            3. list item 2.2.3
                    `),
                doc(
                    ol(
                        li(p("list item 1")),
                        li(
                            p("list item 2"),
                            ol(
                                li(p("list item 2.1")),
                                li(
                                    p("list item 2.2"),
                                    ol(
                                        li(p("list item 2.2.1")),
                                        li(p("list item 2.2.2")),
                                        li(p("list item 2.2.3")),
                                    ),
                                ),
                            ),
                        ),
                    ),
                ),
            )
        })
        it("nset order list (shape 3)", function() {
            assertEqual(
                dedent(`
                    1. list item 1
                        1. list item 1.1
                            1. list item 1.1.1
                    2. list item 2
                        1. list item 2.1
                            1. list item 2.1.1
                    3. list item 3
                        1. list item 3.1
                            1. list item 3.1.1
                    `),
                doc(
                    // prettier-ignore
                    ol(
                        li(
                            p("list item 1"),
                            ol(
                                li(
                                    p("list item 1.1"),
                                    ol(
                                        li(p("list item 1.1.1"))
                                    )
                                )
                            ),
                        ),
                        li(
                            p("list item 2"),
                            ol(
                                li(
                                    p("list item 2.1"),
                                    ol(
                                        li(p("list item 2.1.1")),
                                    ),
                                ),
                            ),
                        ),
                        li(
                            p("list item 3"),
                            ol(
                                li(
                                    p("list item 3.1"),
                                    ol(
                                        li(p("list item 3.1.1")),
                                    ),
                                ),
                            ),
                        ),
                    ),
                ),
            )
        })
    })
    describe("selectable list", function() {
        it("checked list", function() {
            assertEqual(
                dedent(
                    `
                    - [x] list item 1
                    - [x] list item 2
                    - [x] list item 3
                    `,
                ),
                doc(
                    ul(
                        li(checkedCheckbox(), p("list item 1")),
                        li(checkedCheckbox(), p("list item 2")),
                        li(checkedCheckbox(), p("list item 3")),
                    ),
                ),
            )
        })
        it("unchecked list", function() {
            assertEqual(
                dedent(
                    `
                    - [ ] list item 1
                    - [ ] list item 2
                    - [ ] list item 3
                    `,
                ),
                doc(
                    ul(
                        li(uncheckedCheckbox(), p("list item 1")),
                        li(uncheckedCheckbox(), p("list item 2")),
                        li(uncheckedCheckbox(), p("list item 3")),
                    ),
                ),
            )
        })
        it("mixed list", function() {
            assertEqual(
                dedent(
                    `
                    - [ ] list item 1
                    - [x] list item 2
                    - [ ] list item 3
                    `,
                ),
                doc(
                    ul(
                        li(uncheckedCheckbox(), p("list item 1")),
                        li(checkedCheckbox(), p("list item 2")),
                        li(uncheckedCheckbox(), p("list item 3")),
                    ),
                ),
            )
        })
        it("selectable list item and bullet list item", function() {
            assertEqual(
                dedent(
                    `
                    - [ ] list item 1
                    - [x] list item 2
                    - list item 3
                    `,
                ),
                doc(
                    ul(
                        li(uncheckedCheckbox(), p("list item 1")),
                        li(checkedCheckbox(), p("list item 2")),
                        li(p("list item 3")),
                    ),
                ),
            )
            assertEqual(
                dedent(
                    `
                    - list item 0
                    - [ ] list item 1
                    - [x] list item 2
                    `,
                ),
                doc(
                    ul(
                        li(p("list item 0")),
                        li(uncheckedCheckbox(), p("list item 1")),
                        li(checkedCheckbox(), p("list item 2")),
                    ),
                ),
            )
        })
    })
})
