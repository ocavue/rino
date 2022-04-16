import { EditorView, findParentNodeOfType } from "@remirror/core"
import { useRemirrorContext } from "@remirror/react-core"
import { useCallback } from "react"

interface UseCodeBlockReturn {
    dom: HTMLElement | null
    language: string
    setLanguage: (language: string) => void
}

function findCodeMirror(view: EditorView) {
    return findParentNodeOfType({ types: ["codeMirror"], selection: view.state.selection })
}

export function useCodeBlock(): UseCodeBlockReturn {
    const { view } = useRemirrorContext({ autoUpdate: true })

    let dom: HTMLElement | null = null
    let language = ""

    const setLanguage = useCallback(
        (language: string) => {
            const found = findCodeMirror(view)
            if (!found) {
                return
            }
            const { pos, node } = found
            const tr = view.state.tr.setNodeMarkup(pos, node.type, { ...node.attrs, language })
            view.dispatch(tr)
        },
        [view],
    )

    const found = findCodeMirror(view)
    if (found) {
        const { node, pos } = found
        language = node.attrs.language

        const element = view.nodeDOM(pos)
        if (element) {
            dom = element as HTMLElement
        }
    }

    return { dom, language, setLanguage }
}
