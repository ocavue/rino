import { TableSchemaSpec } from "@remirror/extension-tables"
import { useEvent } from "@remirror/react"
import { useRemirrorContext } from "@remirror/react-core"
import { useCallback, useEffect, useRef } from "react"

import { TABLE_SELECTOR_DATA_TAG_COLUMN } from "./table-const"
import { getTableSelectorMeta } from "./table-selector-transaction"
import { CellSelectionType } from "./table-utils"

export type ClickSelectorHandler = (type: CellSelectionType, event: MouseEvent) => void

export function useSelectorEvent(clickSelectorHandler: ClickSelectorHandler) {
    // const posRef = useRef<number>()
    // const selectionTypeRef = useRef<CellSelectionType>()

    // useRemirrorContext(({ tr }) => {
    //     const meta = tr && getTableSelectorMeta(tr)

    //     if (!meta) {
    //         return
    //     }

    //     if (meta.type === "mousedown") {
    //         posRef.current = meta.pos
    //         selectionTypeRef.current = meta.selectionType
    //     } else if (meta.type === "mouseup") {
    //         if (posRef.current === meta.pos && selectionTypeRef.current === meta.selectionType) {
    //             // The target of the mouseup event is the same as the target of the mousedown event. This means
    //             // that the user clicked on the same selector. We can show the menu.
    //             clickSelectorHandler(meta.selectionType, meta.event)
    //         }
    //         posRef.current = undefined
    //         selectionTypeRef.current = undefined
    //     }
    // })

    // useRemirrorContext(({ tr }) => {
    //     const meta = tr && getTableSelectorMeta(tr)

    //     if (!meta) {
    //         return
    //     }

    //     if (meta.type === "click") {
    //         const event = meta.event
    //         const element = event.target as HTMLElement
    //         console.log("[getTableSelectorMeta] getBoundingClientRect", element.getBoundingClientRect())
    //         clickSelectorHandler(meta.selectionType, meta.event)
    //     }
    // })

    useEvent("click", (event, state) => {
        // console.log('[useEvent] click', state)

        console.log(
            "[useEvent] click getBoundingClientRect",
            (event.target as HTMLElement).className,
            (event.target as HTMLElement).getBoundingClientRect(),
            { state },
        )

        if ((state.nodeWithPosition.node.type.spec as TableSchemaSpec).tableRole === "table") {
            console.log("[useEvent] click node", state.nodeWithPosition.node)

            clickSelectorHandler("column", event)
        }
    })

    useEvent("mousedown", (event) => {
        const element = event.target as HTMLElement

        // if (element?.getAttribute(TABLE_SELECTOR_DATA_TAG_COLUMN)) {
        //     console.log("[useEvent] mousedown", element.getBoundingClientRect())
        // }
        console.log("[useEvent] event mousedown", element.className, element.getBoundingClientRect())
    })

    // useEvent("mousedown", (event) => {
    //     console.log(
    //         "[useEvent] mousedown getBoundingClientRect",
    //         (event.target as HTMLElement).className,
    //         (event.target as HTMLElement).getBoundingClientRect(),
    //     )
    // })

    // useEvent("mouseup", (event) => {
    //     console.log(
    //         "[useEvent] mouseup getBoundingClientRect",
    //         (event.target as HTMLElement).className,
    //         (event.target as HTMLElement).getBoundingClientRect(),
    //     )
    // })

    // const clickListener = useCallback((event: MouseEvent) => {
    //     const element = event.target as HTMLElement
    //     console.log("[useSelectorEvent] event", element.className, element.getBoundingClientRect())
    // }, [])

    // useEffect(() => {
    //     document.addEventListener("click", clickListener)
    //     return () => {
    //         document.removeEventListener("click", clickListener)
    //     }
    // }, [clickListener])
}
