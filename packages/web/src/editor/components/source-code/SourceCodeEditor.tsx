import { ProsemirrorNode, RemirrorEventListener } from "@remirror/core"
import { debounce } from "lodash"
import React, { FC, useEffect, useMemo, useRef } from "react"
import { RemirrorProvider, useRemirror } from "remirror/react"

import { DevTools } from "../DevTools"
import { EditorProps } from "../types"
import {
    SourceCodeExtension,
    SourceCodeManager,
    SourceCodeSchema,
    useSourceCodeManager,
} from "./manager"

const InnerEditor: FC<{ className: string }> = ({ className }) => {
    const { getRootProps } = useRemirror()
    return <div {...getRootProps()} className={className} />
}

type Doc = ProsemirrorNode<SourceCodeSchema>

export const SourceCodeEditor: FC<EditorProps> = ({
    className,
    content,
    editable,
    autoFocus,
    setContent,
}) => {
    const manager: SourceCodeManager = useSourceCodeManager()
    const docRef = useRef<Doc>()

    const { initialNode, onChange, saveContent } = useMemo(() => {
        const schema = manager.schema
        const initialNode = schema.nodes.doc.create(
            {},
            schema.nodes.codeBlock.create(
                { language: "markdown" },
                content ? schema.text(content) : undefined,
            ),
        )
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
        console.debug(`Mounting <${SourceCodeEditor.displayName}/>`)
        return () => {
            console.debug(`Unmounting <${SourceCodeEditor.displayName}/>`)
            saveContent()
        }
    }, [saveContent])

    return (
        <RemirrorProvider
            manager={manager}
            autoFocus={autoFocus}
            initialContent={initialNode}
            onChange={onChange}
            editable={editable}
            attributes={{ "data-testid": "source-code-mode-textarea" }}
        >
            <>
                <InnerEditor className={className} />
                <DevTools />
            </>
        </RemirrorProvider>
    )
}

SourceCodeEditor.displayName = "SourceCodeEditor"
