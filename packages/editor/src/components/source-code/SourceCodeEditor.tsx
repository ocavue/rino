import { Remirror, useRemirrorContext } from "@remirror/react"
import { debounce } from "lodash-es"
import React, { FC, useCallback, useLayoutEffect, useMemo } from "react"

import DevTools from "../DevTools"
import { EditorProps } from "../types"
import { useSourceCodeRemirror } from "./source-code-manager"

const InnerEditor: FC<{ className: string }> = ({ className }) => {
    const { getRootProps } = useRemirrorContext()
    return <div {...getRootProps()} className={className} />
}

const SourceCodeEditor: FC<EditorProps> = React.memo<EditorProps>(
    ({
        className,
        initialContent,
        editable,
        autoFocus,
        beforeUnmount,
        onContentEdit,
        onContentSave,
        onContentSaveDelay,
        enableDevTools,
    }) => {
        const { manager } = useSourceCodeRemirror()

        const initialNode = useMemo(() => {
            const schema = manager.schema
            const attrs = { language: "markdown" }
            const child = initialContent ? schema.text(initialContent) : undefined
            return schema.nodes.doc.create({}, schema.nodes.codeMirror.create(attrs, child))
        }, [manager, initialContent])

        const getContent: () => string | null = useCallback(() => {
            const doc = manager.view?.state?.doc
            if (!doc) return null
            return doc.textContent
        }, [manager])

        const onChange = useMemo(() => {
            const saveContent = () => {
                const content = getContent()
                if (content !== null) onContentSave(content)
            }
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
                {enableDevTools ? <DevTools /> : null}
            </Remirror>
        )
    },
)

SourceCodeEditor.displayName = "SourceCodeEditor"

export default SourceCodeEditor
