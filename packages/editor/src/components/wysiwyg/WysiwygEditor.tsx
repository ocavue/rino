import { ProsemirrorNode, RemirrorEventListener } from "@remirror/core"
import { Remirror, useCommands, useHelpers, useRemirrorContext } from "@remirror/react"
import { debounce } from "lodash"
import React, { FC, useEffect, useMemo, useRef, useState } from "react"

import DevTools from "../DevTools"
import ErrorBoundary from "../ErrorBoundary"
import { DrawerActivityContainer, EditorProps } from "../types"
import TableMenu from "./TableMenu"
import { WysiwygExtension } from "./wysiwyg-extension"
import { useWysiwygRemirror, WysiwygSchema } from "./wysiwyg-manager"
import { buildMarkdownParser, buildMarkdownSerializer } from "./wysiwyg-markdown"

const InnerEditor: FC<{
    className: string
    maxDrawerWidth: number
    drawerActivityContainer: DrawerActivityContainer
}> = ({ className, maxDrawerWidth, drawerActivityContainer }) => {
    const commands = useCommands<WysiwygExtension>()
    const helpers = useHelpers<WysiwygExtension>()
    const { getRootProps } = useRemirrorContext<WysiwygExtension>()
    return (
        <>
            <TableMenu
                commands={commands}
                helpers={helpers}
                maxDrawerWidth={maxDrawerWidth}
                drawerActivityContainer={drawerActivityContainer}
            />
            <div {...getRootProps()} className={className} />
            <DevTools />
        </>
    )
}

type Doc = ProsemirrorNode<WysiwygSchema>

type WysiwygEditorProps = EditorProps & {
    maxDrawerWidth: number
    drawerActivityContainer: DrawerActivityContainer
    isTestEnv: boolean
}

const WysiwygEditor: FC<WysiwygEditorProps> = ({
    className,
    autoFocus,
    editable,
    content,
    setContent,
    maxDrawerWidth,
    drawerActivityContainer,
    isTestEnv,
}) => {
    const { manager } = useWysiwygRemirror()

    const docRef = useRef<Doc>()
    const [error, setError] = useState<Error | null>(null)

    const { initialNode, onChange, saveContent } = useMemo(() => {
        const parser = buildMarkdownParser(manager)
        const serializer = buildMarkdownSerializer(manager)
        const initialNode = (() => {
            try {
                if (isTestEnv) {
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
        const onChange: RemirrorEventListener<WysiwygExtension> = ({ state }) => {
            docRef.current = state.doc
            saveContentWithDelay()
        }
        return {
            initialNode,
            onChange,
            saveContent,
        }
    }, [manager, content, setContent, isTestEnv])

    useEffect(() => {
        // console.debug(`Mounting <${WysiwygEditor.displayName}/>`)
        return () => {
            // console.debug(`Unmounting <${WysiwygEditor.displayName}/>`)
            saveContent()
        }
    }, [saveContent])

    if (error) {
        // I didn't use React `componentDidCatch` method because I can't turn off `react-error-overlay` (easily) and
        // it will show an error overlay window in development mode when `componentDidCatch` been called.
        console.error(error)
        return (
            <div data-testid="wysiwyg_mode_error">
                <h1>
                    <br />
                    Something went wrong.
                </h1>
                <p>{`${error}`}</p>
            </div>
        )
    }
    return (
        <ErrorBoundary>
            <Remirror
                manager={manager}
                autoFocus={autoFocus}
                initialContent={initialNode}
                onChange={onChange}
                editable={editable}
                attributes={{ "data-testid": "wysiwyg_mode_textarea" }}
            >
                <InnerEditor className={className} maxDrawerWidth={maxDrawerWidth} drawerActivityContainer={drawerActivityContainer} />
            </Remirror>
        </ErrorBoundary>
    )
}

WysiwygEditor.displayName = "WysiwygEditor"

export default WysiwygEditor
