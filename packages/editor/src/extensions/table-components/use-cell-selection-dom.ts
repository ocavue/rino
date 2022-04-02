import { isCellSelection } from "@remirror/pm/tables"
import { useRemirrorContext } from "@remirror/react-core"

import { isTableCellElement } from "./dom-utils"

/**
 * A hook which returns the anchor and head cell HTML elements of the current
 * cell selection. Returns `null` if there is no cell selection.
 */
export function useCellSelectionDom(): { anchor: HTMLTableCellElement; head: HTMLTableCellElement } | null {
    const { view } = useRemirrorContext({ autoUpdate: true })
    const selection = view.state.selection

    if (!isCellSelection(selection)) {
        return null
    }

    const anchor = view.nodeDOM(selection.$anchorCell.pos) as HTMLElement | null
    const head = view.nodeDOM(selection.$headCell.pos) as HTMLElement | null

    if (!isTableCellElement(anchor) || !isTableCellElement(head)) {
        return null
    }

    return { anchor, head }
}
