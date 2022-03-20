import { Transaction } from "@remirror/pm/state"

import { CellSelectionType } from "./table-utils"

const TABLE_SELECTOR_META_KEY = "table-selector-meta"

export interface TableSelectorMeta {
    type: "mousedown" | "mouseup"
    pos: number
    selectionType: CellSelectionType
}

export function setTableSelectorMeta(tr: Transaction, meta: TableSelectorMeta): Transaction {
    return tr.setMeta(TABLE_SELECTOR_META_KEY, meta)
}
export function getTableSelectorMeta(tr: Transaction): TableSelectorMeta | undefined {
    return tr.getMeta(TABLE_SELECTOR_META_KEY)
}
