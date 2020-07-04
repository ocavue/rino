import { ProsemirrorNode } from "@remirror/core"
import { RemirrorEventListener, RemirrorProvider, useRemirrorContext } from "@remirror/react"
import { debounce } from "lodash"
import React, { FC, useEffect, useMemo, useRef, useState } from "react"

import { isTestEnv } from "src/utils"

import { DevTools } from "../DevTools"
import { EditorProps } from "../types"
import { TableMenu } from "./TableMenu"
import { WysiwygExtensions, WysiwygSchema } from "./wysiwyg-extension"
import { useWysiwygManager, WysiwygManager } from "./wysiwyg-manager"
import { buildMarkdownParser, buildMarkdownSerializer } from "./wysiwyg-markdown"

const InnerEditor: FC<{ className: string }> = ({ className }) => {
    const context = useRemirrorContext()
    const rootProps = context.getRootProps()

    // workaround for remirror
    if (Object.prototype.hasOwnProperty.call(rootProps, "css")) delete rootProps["css"]

    return <div {...rootProps} className={className} />
}

type Doc = ProsemirrorNode<WysiwygSchema>

export const WysiwygEditor: FC<EditorProps> = ({
    className,
    autoFocus,
    editable,
    content,
    setContent,
}) => {
    const manager: WysiwygManager = useWysiwygManager()
    const docRef = useRef<Doc>()
    const [error, setError] = useState<Error | null>(null)

    const { initialNode, onChange, saveContent } = useMemo(() => {
        const parser = buildMarkdownParser(manager)
        const serializer = buildMarkdownSerializer(manager)
        const initialNode = (() => {
            try {
                if (isTestEnv()) {
                    if (content.trim() === "HOOK:FAILED_TO_INIT_PROSEMIRROR_VIEW") {
                        throw new Error("Found error hook for testing")
                    }
                }
                return parser.parse(content)
            } catch (error) {
                setError(error)
            }
        })()
        const getContent = (doc: Doc) => {
            const content = serializer.serialize(doc)
            return content
        }
        const saveContent = () => {
            try {
                const doc = docRef.current
                if (doc) setContent(getContent(doc))
            } catch (error) {
                setError(error)
            }
        }
        const saveContentWithDelay = debounce(saveContent, 500)
        const onChange: RemirrorEventListener<WysiwygExtensions> = ({ state }) => {
            docRef.current = state.doc
            saveContentWithDelay()
        }
        return {
            initialNode,
            onChange,
            saveContent,
        }
    }, [manager, content, setContent])

    useEffect(() => {
        console.debug(`Mounting <${WysiwygEditor.displayName}/>`)
        return () => {
            console.debug(`Unmounting <${WysiwygEditor.displayName}/>`)
            saveContent()
        }
    }, [saveContent])

    if (error) {
        // I didn't use React `componentDidCatch` method because I can't turn off `react-error-overlay` (easily) and
        // it will show an error overlay window in development mode when `componentDidCatch` been called.
        console.error(error)
        return (
            <div data-testid="wysiwyg-mode-error">
                <h1>
                    <br />
                    Something went wrong.
                </h1>
                <p>{`${error}`}</p>
            </div>
        )
    }
    return (
        <RemirrorProvider
            manager={manager}
            autoFocus={autoFocus}
            initialContent={initialNode}
            onChange={onChange}
            editable={editable}
            attributes={{ "data-testid": "wysiwyg-mode-textarea" }}
        >
            <>
                <InnerEditor className={className} />
                <TableMenu />
                <DevTools />
            </>
        </RemirrorProvider>
    )
}

WysiwygEditor.displayName = "WysiwygEditor"
