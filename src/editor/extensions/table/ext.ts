import {
    CommandNodeTypeParams,
    ExtensionManagerNodeTypeParams,
    KeyBindings,
    NodeExtension,
    NodeExtensionSpec,
} from "@remirror/core"
import { MarkdownNodeExtension, buildBlockEnterKeymapBindings } from "src/editor/utils"
import { Node as ProsemirroNode } from "prosemirror-model"
import { Transaction } from "prosemirror-state"
import {
    addColumnAfter,
    addColumnBefore,
    addRowAfter,
    addRowBefore,
    deleteColumn,
    deleteRow,
    tableEditing,
} from "prosemirror-tables"
import { createTableHeigthlightPlugin } from "./plugin"
import { selectedTableCell } from "./helper"

interface TableSchemaSpec extends NodeExtensionSpec {
    tableRole: "table" | "row" | "cell"
}

export class RinoTableExtension extends NodeExtension implements MarkdownNodeExtension {
    readonly name = "rinoTable"

    readonly schema: TableSchemaSpec = {
        content: "rinoTableRow+",
        tableRole: "table",
        isolating: true,
        group: "block",
        parseDOM: [{ tag: "table" }],
        toDOM() {
            return ["table", 0]
        },
    }

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

                const cells = texts.map(text => schema.nodes.rinoTableCell.create(null, text))
                const row = schema.nodes.rinoTableRow.create(null, cells)
                const table = schema.nodes.rinoTable.create(null, row)
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

    plugin() {
        return tableEditing()
    }

    toMarkdown() {}
    fromMarkdown() {}
}

export class RinoTableRowExtension extends NodeExtension implements MarkdownNodeExtension {
    readonly name = "rinoTableRow"

    readonly schema: TableSchemaSpec = {
        content: "rinoTableCell+",
        tableRole: "row",
        parseDOM: [{ tag: "tr" }],
        toDOM() {
            return ["tr", 0]
        },
    }

    toMarkdown() {}
    fromMarkdown() {}
}

export class RinoTableCellExtension extends NodeExtension implements MarkdownNodeExtension {
    readonly name = "rinoTableCell"

    readonly schema: TableSchemaSpec = {
        content: "inline*",
        attrs: {
            colspan: {
                default: 1,
            },
            rowspan: {
                default: 1,
            },
            colwidth: {
                default: null,
            },
        },
        tableRole: "cell",
        isolating: true,
        parseDOM: [{ tag: "td" }, { tag: "th" }],
        toDOM() {
            return ["td", 0]
        },
    }

    commands(params: CommandNodeTypeParams) {
        return {
            tableAddColumnAfter: () => addColumnAfter,
            tableAddColumnBefore: () => addColumnBefore,
            tableAddRowAfter: () => addRowAfter,
            tableAddRowBefore: () => addRowBefore,
            tableDeleteColumn: () => deleteColumn,
            tableDeleteRow: () => deleteRow,
            tableDeleteTable: () => deleteRow,
        }
    }

    plugin() {
        return createTableHeigthlightPlugin()
    }

    toMarkdown() {}
    fromMarkdown() {}
}
