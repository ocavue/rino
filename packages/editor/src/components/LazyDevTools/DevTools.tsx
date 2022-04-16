import { useRemirrorContext } from "@remirror/react-core"
import { applyDevTools, removeDevTools } from "prosemirror-dev-toolkit"
import React, { useEffect } from "react"

const DevTools: React.FC = () => {
    const { view } = useRemirrorContext()
    useEffect(() => {
        applyDevTools(view)
        return () => removeDevTools()
    }, [view])
    return null
}

export default DevTools
