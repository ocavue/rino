import { ProsemirrorNode, RemirrorEventListener } from "@remirror/core"
import { RemirrorProvider, useRemirror } from "@remirror/react"
import { debounce } from "lodash"
import React, { FC, useEffect, useMemo, useRef, useState } from "react"
import { Container } from "unstated-next"

import { DevTools } from "../DevTools"
import { ErrorBoundary } from "../ErrorBoundary"
import { TableMenuSvgs } from "../table-menu/svg"
import { EditorProps } from "../types"
import { TableMenu } from "./TableMenu"
import { WysiwygCombined } from "./wysiwyg-extension"
import { useWysiwygManager, WysiwygManager, WysiwygSchema } from "./wysiwyg-manager"
import { buildMarkdownParser, buildMarkdownSerializer } from "./wysiwyg-markdown"

const InnerEditor: FC<{
    className: string
    tableMenuSvgs: TableMenuSvgs
    maxDrawerWidth: number
    DrawerActivityContainer: Container<{ drawerActivity: boolean }>
}> = ({ className, tableMenuSvgs, maxDrawerWidth, DrawerActivityContainer }) => {
    const { getRootProps, commands, helpers } = useRemirror<WysiwygCombined>()
    return (
        <>
            <TableMenu
                commands={commands}
                helpers={helpers}
                svgs={tableMenuSvgs}
                maxDrawerWidth={maxDrawerWidth}
                DrawerActivityContainer={DrawerActivityContainer}
            />
            <div {...getRootProps()} className={className} />
            <DevTools />
        </>
    )
}

type Doc = ProsemirrorNode<WysiwygSchema>

type WysiwygEditorProps = EditorProps & {
    tableMenuSvgs: TableMenuSvgs
    maxDrawerWidth: number
    DrawerActivityContainer: Container<{ drawerActivity: boolean }>
    isTestEnv: boolean
}

export const WysiwygEditor: FC<WysiwygEditorProps> = ({
    className,
    autoFocus,
    editable,
    content,
    setContent,
    tableMenuSvgs,
    maxDrawerWidth,
    DrawerActivityContainer,
    isTestEnv,
}) => {
    const manager: WysiwygManager = useWysiwygManager()
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
        const onChange: RemirrorEventListener<WysiwygCombined> = ({ state }) => {
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
            <RemirrorProvider
                manager={manager}
                autoFocus={autoFocus}
                initialContent={initialNode}
                onChange={onChange}
                editable={editable}
                attributes={{ "data-testid": "wysiwyg_mode_textarea" }}
            >
                <InnerEditor
                    className={className}
                    tableMenuSvgs={tableMenuSvgs}
                    maxDrawerWidth={maxDrawerWidth}
                    DrawerActivityContainer={DrawerActivityContainer}
                />
            </RemirrorProvider>
        </ErrorBoundary>
    )
}

WysiwygEditor.displayName = "WysiwygEditor"
