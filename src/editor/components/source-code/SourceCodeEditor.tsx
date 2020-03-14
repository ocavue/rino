/** @jsx jsx */

import { DevTools } from "../DevTools"
import { EditorProps } from "../types"
import { FC, useEffect, useMemo, useRef } from "react"
import { ProsemirrorNode } from "@remirror/core"
import { RemirrorEventListener, RemirrorProvider, useRemirrorContext } from "@remirror/react"
import {
    SourceCodeExtensions,
    SourceCodeManager,
    SourceCodeSchema,
    useSourceCodeManager,
} from "./manager"
import { StoreContainer } from "src/store"
import { debounce } from "lodash"
import { jsx } from "@emotion/core"

const InnerEditor: FC<{ className: string }> = ({ className }) => {
    const { getRootProps } = useRemirrorContext()
    const rootProps = getRootProps()

    return <div {...rootProps} className={className} data-testid="source-code-mode-textarea" />
}

type Doc = ProsemirrorNode<SourceCodeSchema>

export const SourceCodeEditor: FC<EditorProps> = ({
    className,
    content,
    autoFocus,
    setContent,
}) => {
    const manager: SourceCodeManager = useSourceCodeManager()
    const docRef = useRef<Doc>()
    const {
        state: { editable },
    } = StoreContainer.useContainer()

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
        const onChange: RemirrorEventListener<SourceCodeExtensions> = ({ state }) => {
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
        >
            <>
                <InnerEditor className={className} />
                <DevTools />
            </>
        </RemirrorProvider>
    )
}

SourceCodeEditor.displayName = "SourceCodeEditor"
