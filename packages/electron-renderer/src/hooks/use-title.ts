import { useMemo, useState } from "react"

import { basename } from "@rino.app/common"

export function useTitle(notePath: string) {
    const [saved, setSaved] = useState(true)

    const title: string = useMemo(() => {
        let title = basename(notePath)
        if (!title) {
            title = "Untitled"
        }
        if (!saved) {
            title = `${title} - Edited`
        }
        return title
    }, [notePath, saved])

    return { setSaved, title }
}
