import { ProsemirrorNode } from "@remirror/core"
import { Remirror, useRemirrorContext } from "@remirror/react"
import { debounce } from "lodash"
import React, { FC, useCallback, useEffect, useLayoutEffect, useMemo } from "react"

import DevTools from "../DevTools"
import { EditorProps } from "../types"
import { SourceCodeSchema, useSourceCodeRemirror } from "./manager"

const InnerEditor: FC<{ className: string }> = ({ className }) => {
    const { getRootProps } = useRemirrorContext()
    return <div {...getRootProps()} className={className} />
}

const SourceCodeEditor: FC<EditorProps> = React.memo<EditorProps>(
    ({ className, initialContent, editable, autoFocus, onContentChange, beforeUnmount }) => {
        const { manager } = useSourceCodeRemirror()

        const initialNode = useMemo(() => {
            const schema = manager.schema
            return schema.nodes.doc.create({}, schema.nodes.codeMirror.create({}, initialContent ? schema.text(initialContent) : undefined))
        }, [manager, initialContent])

        const saveContent = useCallback(() => {
            const content = manager.view.state.doc.textContent
            onContentChange(content)
        }, [manager, onContentChange])

        const saveContentWithDelay = useMemo(() => debounce(saveContent, 500), [saveContent])

        useLayoutEffect(() => {
            console.debug(`Mounting <${SourceCodeEditor.displayName}/>`)
            return () => {
                console.debug(`Unmounting <${SourceCodeEditor.displayName}/>`)
                saveContent()
                beforeUnmount()
            }
        }, [saveContent, beforeUnmount])

        return (
            <Remirror
                manager={manager}
                autoFocus={autoFocus}
                initialContent={initialNode}
                onChange={saveContentWithDelay}
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
