import { AnyExtension } from "@remirror/core"

import { EditorDelegate } from "./types"
import { useWysiwygEditor } from "./wysiwyg/use-wysiwyg-editor"

// const parser = useMemo(() => buildMarkdownParser(manager), [manager])
// const serializer = useMemo(() => buildMarkdownSerializer(manager), [manager])

// const initialNode = useMemo(() => {
//     try {
//         if (isTestEnv) {
//             if (initialContent.trim() === "HOOK:FAILED_TO_INIT_PROSEMIRROR_VIEW") {
//                 throw new Error("Found error hook for testing")
//             }
//         }
//         return parser.parse(initialContent)
//     } catch (error) {
//         setError(error)
//     }
// }, [parser, isTestEnv, initialContent])

// const getContent = useCallback((): string | null => {
//     const doc = manager.view?.state?.doc
//     if (!doc) return null
//     return serializer.serialize(doc)
// }, [manager, serializer])

// const onChange = useMemo(() => {
//     const saveContent = () => {
//         const content = getContent()
//         if (content !== null) onContentSave(content)
//     }
//     const saveContentWithDelay = debounce(saveContent, onContentSaveDelay)
//     return () => {
//         onContentEdit()
//         saveContentWithDelay()
//     }
// }, [getContent, onContentEdit, onContentSave, onContentSaveDelay])

// // We use `useLayoutEffect` instead of `useEffect` because we want `beforeUnmount` to be called ASAP
// useLayoutEffect(() => {
//     // console.debug(`Mounting <${WysiwygEditor.displayName}/>`)
//     return () => {
//         // console.debug(`Unmounting <${WysiwygEditor.displayName}/>`)
//         const content = getContent()
//         if (content === null) {
//             beforeUnmount()
//         } else {
//             beforeUnmount(content)
//             onContentSave(content)
//         }
//     }
// }, [getContent, onContentSave, beforeUnmount])

