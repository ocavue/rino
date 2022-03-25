import { renderEditor } from "jest-remirror"

import { dedent } from "@rino.app/common"

import { buildMarkdownParser, buildMarkdownSerializer, createRinoCorePreset } from "../../src/components/wysiwyg"
import {
    applyRangeMarks,
    RinoInlineDecorationExtension,
    RinoInlineMarkExtension,
    rinoMarkExtensions,
    RinoTableCellExtension,
    RinoTableExtension,
    RinoTableHeaderCellExtension,
    RinoTableRowExtension,
} from "../../src/extensions"

const setup = () => {
    const editor = renderEditor([
        ...createRinoCorePreset(),
        ...rinoMarkExtensions,
        new RinoInlineMarkExtension(),
        new RinoInlineDecorationExtension(),
        new RinoTableExtension(),
        new RinoTableRowExtension(),
        new RinoTableCellExtension(),
        new RinoTableHeaderCellExtension(),
    ])
    const {
        view,
        add,
        nodes: { doc, p, table, tableRow, tableCell },
        manager,
        schema,
    } = editor

    const buildRegularTable = (rows: string[][]) => {
        // Esnure that all rows have same length
        expect(Array.from(new Set(rows.map((row) => row.length)))).toHaveLength(1)

        return table(...rows.map((row) => tableRow(...row.map((cell) => tableCell(cell)))))
    }

    return {
        manager,
        view,
        schema,
        add,
        doc,
        p,
        buildRegularTable,
        table,
        tableRow,
        tableCell,
    }
}

describe("fromMarkdown", () => {
    const { manager, buildRegularTable, doc } = setup()
    const parser = buildMarkdownParser(manager)

    test("base case", () => {
        expect(
            parser.parse(
                dedent(
                    `
                    | x   | x   | x   |
                    | --- | --- | --- |
                    | x   | x   | x   |
                    | x   | x   | x   |
                    `,
                ),
            ),
        ).toEqualRemirrorDocument(
            doc(
                buildRegularTable([
                    ["x", "x", "x"],
                    ["x", "x", "x"],
                    ["x", "x", "x"],
                ]),
            ),
        )
    })

    test("empty cells", () => {
        expect(
            parser.parse(
                dedent(
                    `
                    |     | xxxxxx | x   |
                    | --- | ------ | --- |
                    | x   |        | x   |
                    | x   | x      |     |
                    `,
                ),
            ),
        ).toEqualRemirrorDocument(
            doc(
                buildRegularTable([
                    ["", "xxxxxx", "x"],
                    ["x", "", "x"],
                    ["x", "x", ""],
                ]),
            ),
        )
    })

    test("bad format markdown text", () => {
        expect(
            parser.parse(
                dedent(
                    `
                    |          x       | x   |    |
                    | --- | -------- | --- |
                    |     x              |      x | x      |
                    | x | x | x |
                    `,
                ),
            ),
        ).toEqualRemirrorDocument(
            doc(
                buildRegularTable([
                    ["x", "x", ""],
                    ["x", "x", "x"],
                    ["x", "x", "x"],
                ]),
            ),
        )
    })
})

describe("toMarkdown", () => {
    const { manager, buildRegularTable, doc, add, view } = setup()
    const serializer = buildMarkdownSerializer(manager)

    test("base case", () => {
        expect(
            serializer.serialize(
                doc(
                    buildRegularTable([
                        ["x", "x", "x"],
                        ["x", "x", "x"],
                        ["x", "x", "x"],
                    ]),
                ),
            ),
        ).toEqual(
            dedent(
                `
                | x   | x   | x   |
                | --- | --- | --- |
                | x   | x   | x   |
                | x   | x   | x   |

                `,
            ).trimStart(),
        )
    })

    test("cell length (1)", () => {
        expect(
            serializer.serialize(
                doc(
                    buildRegularTable([
                        ["x", "x", "x"],
                        ["x", "x", "xxxxx"],
                        ["x", "x", "x"],
                    ]),
                ),
            ),
        ).toEqual(
            dedent(
                `
                | x   | x   | x     |
                | --- | --- | ----- |
                | x   | x   | xxxxx |
                | x   | x   | x     |

                `,
            ).trimStart(),
        )
    })

    test("cell length (2)", () => {
        expect(
            serializer.serialize(
                doc(
                    buildRegularTable([
                        ["xxxxx", "x", "x"],
                        ["x", "x", "x"],
                        ["x", "x", "x"],
                    ]),
                ),
            ),
        ).toEqual(
            dedent(
                `
                | xxxxx | x   | x   |
                | ----- | --- | --- |
                | x     | x   | x   |
                | x     | x   | x   |

                `,
            ).trimStart(),
        )
    })

    test("cell length (3)", () => {
        expect(
            serializer.serialize(
                doc(
                    buildRegularTable([
                        ["x", "xxxxxx", "x"],
                        ["x", "x", "x"],
                        ["x", "x", "x"],
                    ]),
                ),
            ),
        ).toEqual(
            dedent(
                `
                | x   | xxxxxx | x   |
                | --- | ------ | --- |
                | x   | x      | x   |
                | x   | x      | x   |

                `,
            ).trimStart(),
        )
    })

    test("cell length (4)", () => {
        expect(
            serializer.serialize(
                doc(
                    buildRegularTable([
                        ["x", "x", "x"],
                        ["x", "xxxxx", "x"],
                        ["x", "x", "x"],
                    ]),
                ),
            ),
        ).toEqual(
            dedent(
                `
                | x   | x     | x   |
                | --- | ----- | --- |
                | x   | xxxxx | x   |
                | x   | x     | x   |

                `,
            ).trimStart(),
        )
    })

    test("empty cells", () => {
        expect(
            serializer.serialize(
                doc(
                    buildRegularTable([
                        ["", "x", "x"],
                        ["x", "", "x"],
                        ["x", "x", ""],
                    ]),
                ),
            ),
        ).toEqual(
            dedent(
                `
                |     | x   | x   |
                | --- | --- | --- |
                | x   |     | x   |
                | x   | x   |     |

                `,
            ).trimStart(),
        )
    })

    test("with inline marks", () => {
        const initialDoc = doc(
            buildRegularTable([
                ["~~strikethrough~~", "**Strong**", "*italic*"],
                ["[link](https://rino.app)", "mixed **strong *italic***", "plain text"],
            ]),
        )

        add(initialDoc)

        applyRangeMarks(view, true)

        const transformedDoc = view.state.doc

        const firstCell = transformedDoc.firstChild?.firstChild?.firstChild

        expect(firstCell?.toJSON()).toMatchInlineSnapshot(`
          {
            "attrs": {
              "background": null,
              "colspan": 1,
              "colwidth": null,
              "rowspan": 1,
            },
            "content": [
              {
                "marks": [
                  {
                    "attrs": {
                      "depth": 1,
                      "first": true,
                      "last": false,
                    },
                    "type": "mdMark",
                  },
                ],
                "text": "~~",
                "type": "text",
              },
              {
                "marks": [
                  {
                    "attrs": {
                      "depth": 2,
                    },
                    "type": "mdDel",
                  },
                ],
                "text": "strikethrough",
                "type": "text",
              },
              {
                "marks": [
                  {
                    "attrs": {
                      "depth": 1,
                      "first": false,
                      "last": true,
                    },
                    "type": "mdMark",
                  },
                ],
                "text": "~~",
                "type": "text",
              },
            ],
            "type": "tableCell",
          }
        `)

        expect(serializer.serialize(transformedDoc)).toEqual(
            dedent(
                `
                | ~~strikethrough~~        | **Strong**                | *italic*   |
                | ------------------------ | ------------------------- | ---------- |
                | [link](https://rino.app) | mixed **strong *italic*** | plain text |

                `,
            ).trimStart(),
        )
    })
})

describe("inputRules", () => {
    test("replaces string with table", () => {
        const { add, doc, p, table, tableRow, tableCell } = setup()

        add(doc(p("| 1 | 2 | 3 |<cursor>")))
            .press("Enter")
            .callback((content) => {
                expect(content.state.doc).toEqualRemirrorDocument(
                    doc(
                        table(
                            tableRow(tableCell("1"), tableCell("2"), tableCell("3")),
                            tableRow(tableCell(""), tableCell(""), tableCell("")),
                        ),
                    ),
                )
            })
    })

    test("cursor position", () => {
        const { add, doc, p, table, tableRow, tableCell } = setup()

        add(doc(p("| 1 | 2 |<cursor>")))
            .press("Enter")
            .callback((content) => {
                expect(content.state.doc).toEqualRemirrorDocument(
                    doc(table(tableRow(tableCell("1"), tableCell("2")), tableRow(tableCell(""), tableCell("")))),
                )
            })
            .insertText("INSERT")
            .callback((content) => {
                expect(content.state.doc).toEqualRemirrorDocument(
                    doc(table(tableRow(tableCell("1"), tableCell("2")), tableRow(tableCell("INSERT"), tableCell("")))),
                )
            })
    })
})
