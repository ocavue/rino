import { useRemirrorContext } from "@remirror/react-core"
import { useRef } from "react"

import { getTableSelectorMeta } from "./table-selector-transaction"
import { CellSelectionType } from "./table-utils"

export function useSelectorEvent(clickSelectorHandler: (type: CellSelectionType) => void) {
    const posRef = useRef<number>()
    const selectionTypeRef = useRef<CellSelectionType>()

    useRemirrorContext(({ tr }) => {
        const meta = tr && getTableSelectorMeta(tr)

        if (!meta) {
            return
        }

        if (meta.type === "mousedown") {
            posRef.current = meta.pos
            selectionTypeRef.current = meta.selectionType
        } else if (meta.type === "mouseup") {
            if (posRef.current === meta.pos && selectionTypeRef.current === meta.selectionType) {
                // The target of the mouseup event is the same as the target of the mousedown event. This means
                // that the user clicked on the same selector. We can show the menu.
                clickSelectorHandler(meta.selectionType)
            }
            posRef.current = undefined
            selectionTypeRef.current = undefined
        }
    })
}
