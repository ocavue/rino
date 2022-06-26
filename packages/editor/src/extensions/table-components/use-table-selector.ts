import { useEditorEvent } from "@remirror/react"

import { DATA_TABLE_SELECTOR_TYPE } from "./table-const"

export type UseTableSelectorProps = {
    clickHandler?: (event: MouseEvent) => void
}

export function useTableSelector({ clickHandler }: UseTableSelectorProps) {
    useEditorEvent("mouseup", (event) => {
        const element = event.target as HTMLElement | null
        if (element?.getAttribute(DATA_TABLE_SELECTOR_TYPE)) {
            clickHandler?.(event)
        }
    })
}
