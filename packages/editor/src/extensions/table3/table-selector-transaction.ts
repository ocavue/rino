import { Transaction } from "@remirror/pm/state"

import { CellSelectionType } from "./table-utils"

const TABLE_SELECTOR_META_KEY = "table-selector-meta"

export type TableSelectorMeta =
    | {
          type: "mousedown"
          pos: number
          selectionType: CellSelectionType
      }
    | {
          type: "mouseup"
          pos: number
          selectionType: CellSelectionType
          event: MouseEvent
      }
    | {
          type: "click"
          selectionType: CellSelectionType
          event: MouseEvent
      }

export function setTableSelectorMeta(tr: Transaction, meta: TableSelectorMeta): Transaction {
    return tr.setMeta(TABLE_SELECTOR_META_KEY, meta)
}
export function getTableSelectorMeta(tr: Transaction): TableSelectorMeta | undefined {
    return tr.getMeta(TABLE_SELECTOR_META_KEY)
}
