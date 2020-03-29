import { renderEditor } from "jest-remirror"

import {
    buildMarkdownParser,
    buildMarkdownSerializer,
} from "src/editor/components/wysiwyg/wysiwyg-markdown"
import { RinoParagraphExtension } from "src/editor/extensions"
import { RinoTextExtension } from "src/editor/extensions"
import { dedent } from "src/utils"

import { RinoTableCellExtension, RinoTableExtension, RinoTableRowExtension } from ".."

const setup = () => {
    const {
        view,
        add,
        nodes: { doc, p, table, tableRow, tableCell },
        manager,
        schema,
    } = renderEditor({
        plainNodes: [
            new RinoTableExtension(),
            new RinoTableRowExtension(),
            new RinoTableCellExtension(),
            new RinoParagraphExtension(),
            new RinoTextExtension(),
        ],
        others: [],
    })

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

    test("base", () => {
        const node = parser.parse(
            dedent(`
                | 1   | 2   | 3   |
                | --- | --- | --- |
                | 4   | 5   | 6   |
                | 7   | 8   | 9   |
                `),
        )
        expect(node).toEqualRemirrorDocument(
            doc(
                buildRegularTable([
                    ["1", "2", "3"],
                    ["4", "5", "6"],
                    ["7", "8", "9"],
                ]),
            ),
        )
    })
})

describe("toMarkdown", () => {
    const { manager, buildRegularTable, doc } = setup()
    const serializer = buildMarkdownSerializer(manager)

    test("minimal width of cell is 3", () => {
        const node = doc(
            buildRegularTable([
                ["x", "x", "x"],
                ["x", "x", "x"],
                ["x", "x", "x"],
            ]),
        )
        expect(serializer.serialize(node)).toEqual(
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

    test("make all cells with same length in a column (1)", () => {
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

    test("make all cells with same length in a column (2)", () => {
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

    test("make all cells with same length in a column (3)", () => {
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

    test("make all cells with same length in a column (4)", () => {
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
})

describe("inputRules", () => {
    test("replaces string with table", () => {
        const { add, doc, p, table, tableRow, tableCell } = setup()

        add(doc(p("| 1 | 2 | 3 |<cursor>")))
            .press("Enter")
            .callback((content) => {
                expect(content.state.doc).toEqualRemirrorDocument(
                    // prettier-ignore
                    doc(
                        table(
                            tableRow(tableCell("1"), tableCell("2"), tableCell("3"))
                        ),
                    ),
                )
            })
    })

    test("Keep the cursor at the first cell in the second raw", () => {
        //    TODO
    })
})
