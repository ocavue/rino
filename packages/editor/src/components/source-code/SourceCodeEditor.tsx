import { Remirror, useRemirrorContext } from "@remirror/react"
import { debounce } from "lodash"
import React, { FC, useCallback, useLayoutEffect, useMemo } from "react"

import DevTools from "../DevTools"
import { EditorProps } from "../types"
import { useSourceCodeRemirror } from "./manager"

const InnerEditor: FC<{ className: string }> = ({ className }) => {
    const { getRootProps } = useRemirrorContext()
    return <div {...getRootProps()} className={className} />
}

const SourceCodeEditor: FC<EditorProps> = React.memo<EditorProps>(
    ({ className, initialContent, editable, autoFocus, beforeUnmount, onContentEdit, onContentSave, onContentSaveDelay }) => {
        const { manager } = useSourceCodeRemirror()

        const initialNode = useMemo(() => {
            const schema = manager.schema
            return schema.nodes.doc.create({}, schema.nodes.codeMirror.create({}, initialContent ? schema.text(initialContent) : undefined))
        }, [manager, initialContent])

        const getContent: () => string | null = useCallback(() => {
            const doc = manager.view?.state?.doc
            if (!doc) return null
            return doc.textContent
        }, [manager])

        const onChange = useMemo(() => {
            const saveContent = () => onContentSave(getContent())
            const saveContentWithDelay = debounce(saveContent, onContentSaveDelay)
            return () => {
                onContentEdit()
                saveContentWithDelay()
            }
        }, [getContent, onContentEdit, onContentSave, onContentSaveDelay])

        // We use `useLayoutEffect` instead of `useEffect` because we want `beforeUnmount` to be called ASAP
        useLayoutEffect(() => {
            // console.debug(`Mounting <${SourceCodeEditor.displayName}/>`)
            return () => {
                // console.debug(`Unmounting <${SourceCodeEditor.displayName}/>`)
                const content = getContent()
                if (content === null) {
                    beforeUnmount()
                } else {
                    beforeUnmount(content)
                    onContentSave(content)
                }
            }
        }, [getContent, onContentSave, beforeUnmount])

        return (
            <Remirror
                manager={manager}
                autoFocus={autoFocus}
                initialContent={initialNode}
                onChange={(event) => event.tr?.docChanged && onChange()}
                editable={editable}
                attributes={{ "data-testid": "source_code_mode_textarea" }}
            >
                <InnerEditor className={className} />
                <DevTools />
            </Remirror>
        )
    },
)

SourceCodeEditor.displayName = "SourceCodeEditor"

export default SourceCodeEditor
