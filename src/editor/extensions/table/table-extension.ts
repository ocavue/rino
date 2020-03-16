import { ExtensionManagerNodeTypeParams, KeyBindings } from "@remirror/core"
import { MarkdownNodeExtension, buildBlockEnterKeymapBindings } from "src/editor/utils"
import { ParserTokenType } from "src/editor/transform/parser-type"
import { Node as ProsemirroNode } from "prosemirror-model"
import { TableCellExtension, TableExtension, TableRowExtension } from "@remirror/extension-tables"
import { Transaction } from "prosemirror-state"
import { createTableHeigthlightPlugin } from "./table-plugin"
import { selectedTableCell } from "./table-helper"

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
}
