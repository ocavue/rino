import { useEvent } from "@remirror/react"

import { DATA_TABLE_SELECTOR_TYPE } from "./table-const"

export type ClickSelectorHandler = (event: MouseEvent) => void

export function useSelectorEvent(clickSelectorHandler: ClickSelectorHandler) {
    useEvent("mouseup", (event) => {
        const element = event.target as HTMLElement

        if (element?.getAttribute(DATA_TABLE_SELECTOR_TYPE)) {
            console.log("[useEvent] mouseup", element.getBoundingClientRect())
            clickSelectorHandler(event)
        }
    })
}
