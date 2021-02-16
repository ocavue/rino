import { ProsemirrorNode, RemirrorEventListener } from "@remirror/core"
import { Remirror, useRemirrorContext } from "@remirror/react"
import { debounce } from "lodash"
import React, { FC, useEffect, useMemo, useRef } from "react"

import DevTools from "../DevTools"
import { EditorProps } from "../types"
import { SourceCodeExtension, SourceCodeSchema, useSourceCodeRemirror } from "./manager"

const InnerEditor: FC<{ className: string }> = ({ className }) => {
    const { getRootProps } = useRemirrorContext()
    return <div {...getRootProps()} className={className} />
}

type Doc = ProsemirrorNode<SourceCodeSchema>

const SourceCodeEditor: FC<EditorProps> = ({ className, content, editable, autoFocus, setContent }) => {
    const { manager } = useSourceCodeRemirror()
    const docRef = useRef<Doc>()

    const { initialNode, onChange, saveContent } = useMemo(() => {
        const schema = manager.schema
        const initialNode = schema.nodes.doc.create({}, schema.nodes.codeMirror.create({}, content ? schema.text(content) : undefined))
        const getContent = (doc: Doc) => {
            return doc.textContent
        }
        const saveContent = () => {
            const doc = docRef.current
            if (doc) setContent(getContent(doc))
        }
        const saveContentWithDelay = debounce(saveContent, 500)
        const onChange: RemirrorEventListener<SourceCodeExtension> = ({ state }) => {
            docRef.current = state.doc
            saveContentWithDelay()
        }
        return {
            initialNode,
            onChange,
            saveContent,
        }
    }, [manager.schema, content, setContent])

    useEffect(() => {
        // console.debug(`Mounting <${SourceCodeEditor.displayName}/>`)
        return () => {
            // console.debug(`Unmounting <${SourceCodeEditor.displayName}/>`)
            saveContent()
        }
    }, [saveContent])

    return (
        <Remirror
            manager={manager}
            autoFocus={autoFocus}
            initialContent={initialNode}
            onChange={onChange}
            editable={editable}
            attributes={{ "data-testid": "source_code_mode_textarea" }}
        >
            <InnerEditor className={className} />
            <DevTools />
        </Remirror>
    )
}

SourceCodeEditor.displayName = "SourceCodeEditor"

export default SourceCodeEditor
