import { renderEditor } from "jest-remirror"

import { dedent } from "@rino.app/common"

import { buildMarkdownParser, buildMarkdownSerializer, createRinoCorePreset } from "../../../src/components/wysiwyg"
import { RinoTableCellExtension, RinoTableExtension, RinoTableHeaderCellExtension, RinoTableRowExtension } from "../../../src/extensions"

const setup = () => {
    const {
        view,
        add,
        nodes: { doc, p, table, tableRow, tableCell },
        manager,
        schema,
    } = renderEditor([
        ...createRinoCorePreset(),
        new RinoTableExtension(),
        new RinoTableRowExtension(),
        new RinoTableCellExtension(),
        new RinoTableHeaderCellExtension(),
    ])

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
    const { manager, buildRegularTable, doc } = setup()
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
