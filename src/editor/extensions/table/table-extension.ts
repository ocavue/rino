import { ExtensionManagerNodeTypeParams, KeyBindings } from "@remirror/core"
import { Fragment, Node as ProsemirroNode } from "prosemirror-model"
import { MarkdownNodeExtension, buildBlockEnterKeymapBindings } from "src/editor/utils"
import { NodeSerializerOptions } from "src/editor/transform/serializer"
import { ParserTokenType } from "src/editor/transform/parser-type"
import { TableCellExtension, TableExtension, TableRowExtension } from "@remirror/extension-tables"
import { Transaction } from "prosemirror-state"
import { createTableHeigthlightPlugin } from "./table-plugin"
import { selectedTableCell } from "./table-helper"

enum TABLE_ALIGEN {
    DEFAULT = 1,
    CENTER = 2,
    RIGHT = 3,
    LEFT = 4,
}

export class RinoTableExtension extends TableExtension implements MarkdownNodeExtension {
    readonly name = "table"

    public keys({ type, schema }: ExtensionManagerNodeTypeParams): KeyBindings {
        return buildBlockEnterKeymapBindings(/^\|((?:[^\|]+\|){2,})\s*$/, type, {
            transact: (match: string[], tr: Transaction, start: number, end: number) => {
                const texts = match[1]
                    .split("|")
                    .slice(0, -1) // Remove the empty string at the end
                    .map(text => {
                        text = text.trim()
                        if (!text) text = " " // Prosemirror text doesn't allow empty text
                        return schema.text(text)
                    })

                const cells = texts.map(text => schema.nodes.tableCell.create(null, text))
                const row = schema.nodes.tableRow.create(null, cells)
                const table = schema.nodes.table.create(null, row)
                tr = tr.delete(start, end).insert(start, table)
                return tr
            },
        })
    }

    public helpers(params: ExtensionManagerNodeTypeParams) {
        return {
            selectedTableCell: (): ProsemirroNode | null => {
                const state = params.getState()
                return selectedTableCell(state)
            },
        }
    }

    public fromMarkdown() {
        return [
            {
                type: ParserTokenType.block,
                token: "table",
                node: this.name,
                hasOpenClose: true,
            },
            { type: ParserTokenType.ignore, token: "thead_open" },
            { type: ParserTokenType.ignore, token: "thead_close" },
            { type: ParserTokenType.ignore, token: "tbody_open" },
            { type: ParserTokenType.ignore, token: "tbody_close" },
        ] as const
    }

    public toMarkdown({ state, node, parent, index }: NodeSerializerOptions) {
        // TODO Use function `render` to handle each cell text.

        const table: string[][] = []
        const colAligns: TABLE_ALIGEN[] = []
        node.forEach((rowNode, _, rowIndex) => {
            const row: string[] = []
            rowNode.forEach((cellNode, _, colIndex) => {
                const fragment: Fragment = cellNode.content
                const textNode = fragment.firstChild
                const text = textNode ? (textNode.text || "").trim() : ""
                row.push(text)
                if (rowIndex === 0) {
                    colAligns[colIndex] = TABLE_ALIGEN.DEFAULT // TODO
                }
            })
            table.push(row)
        })

        const colWidths: number[] = new Array(colAligns.length)
        table.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (!colWidths[colIndex]) colWidths[colIndex] = 4
                colWidths[colIndex] = Math.max(cell.length, colWidths[colIndex])
            })
        })

        const spliter: string[] = new Array(colAligns.length)
        colWidths.forEach((width, colIndex) => {
            switch (colAligns[colIndex]) {
                case TABLE_ALIGEN.LEFT:
                    spliter[colIndex] = ":" + "-".repeat(width - 1)
                    break
                case TABLE_ALIGEN.RIGHT:
                    spliter[colIndex] = "-".repeat(width - 1) + ":"
                    break
                case TABLE_ALIGEN.CENTER:
                    spliter[colIndex] = ":" + "-".repeat(width - 2) + ":"
                    break
                default:
                    spliter[colIndex] = "-".repeat(width)
                    break
            }
        })
        table.splice(1, 0, spliter)

        let text = "\n"
        table.forEach(row => {
            row.forEach((cell, col) => {
                text += "| "
                const width = colWidths[col]
                if (colAligns[col] === TABLE_ALIGEN.CENTER) {
                    const pad = " ".repeat(Math.round((width - cell.length) / 2))
                    text += (pad + cell + pad).padEnd(width)
                } else if (colAligns[col] === TABLE_ALIGEN.RIGHT) {
                    text += cell.padStart(width)
                } else {
                    text += cell.padEnd(width)
                }
                text += " "
            })
            text += "|\n"
        })

        state.text(text, false)
    }
}

export class RinoTableRowExtension extends TableRowExtension implements MarkdownNodeExtension {
    readonly name = "tableRow"

    public fromMarkdown() {
        return [
            {
                type: ParserTokenType.block,
                token: "tr",
                node: this.name,
                hasOpenClose: true,
            },
        ] as const
    }

    public toMarkdown() {}
}

export class RinoTableCellExtension extends TableCellExtension implements MarkdownNodeExtension {
    readonly name = "tableCell"

    public plugin() {
        return createTableHeigthlightPlugin()
    }

    public fromMarkdown() {
        return [
            {
                type: ParserTokenType.block,
                token: "th",
                node: this.name,
                hasOpenClose: true,
            },
            {
                type: ParserTokenType.block,
                token: "td",
                node: this.name,
                hasOpenClose: true,
            },
        ] as const
    }

    public toMarkdown() {}
}
