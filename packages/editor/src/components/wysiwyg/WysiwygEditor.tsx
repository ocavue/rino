import { Remirror, useCommands, useHelpers, useRemirrorContext } from "@remirror/react"
import { debounce } from "lodash"
import React, { FC, useCallback, useLayoutEffect, useMemo, useState } from "react"

import DevTools from "../DevTools"
import ErrorBoundary from "../ErrorBoundary"
import { DrawerActivityContainer, EditorProps } from "../types"
import TableMenu from "./TableMenu"
import { WysiwygExtension } from "./wysiwyg-extension"
import { useWysiwygRemirror } from "./wysiwyg-manager"
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

type WysiwygEditorProps = EditorProps & {
    maxDrawerWidth: number
    drawerActivityContainer: DrawerActivityContainer
    isTestEnv: boolean
}

const WysiwygEditor = React.memo<WysiwygEditorProps>(
    ({
        className,
        autoFocus,
        editable,
        initialContent,
        maxDrawerWidth,
        drawerActivityContainer,
        isTestEnv,
        beforeUnmount,
        onContentEdit,
        onContentSave,
        onContentSaveDelay,
    }) => {
        const [error, setError] = useState<Error | null>(null)

        const { manager } = useWysiwygRemirror()

        const initialNode = useMemo(() => {
            const parser = buildMarkdownParser(manager)
            try {
                if (isTestEnv) {
                    if (initialContent.trim() === "HOOK:FAILED_TO_INIT_PROSEMIRROR_VIEW") {
                        throw new Error("Found error hook for testing")
                    }
                }
                return parser.parse(initialContent)
            } catch (error) {
                setError(error)
            }
        }, [manager, isTestEnv, initialContent])

        const serializer = useMemo(() => buildMarkdownSerializer(manager), [manager])

        const getContent: () => string | null = useCallback(() => {
            const doc = manager.view?.state?.doc
            if (!doc) return null
            return serializer.serialize(doc)
        }, [manager, serializer])

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
            // console.debug(`Mounting <${WysiwygEditor.displayName}/>`)
            return () => {
                // console.debug(`Unmounting <${WysiwygEditor.displayName}/>`)
                const content = getContent()
                if (content === null) return
                beforeUnmount(content)
                onContentSave(content)
            }
        }, [getContent, onContentSave, beforeUnmount])

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
                    onChange={(event) => event.tr?.docChanged && onChange()}
                    editable={editable}
                    attributes={{ "data-testid": "wysiwyg_mode_textarea" }}
                >
                    <InnerEditor className={className} maxDrawerWidth={maxDrawerWidth} drawerActivityContainer={drawerActivityContainer} />
                </Remirror>
            </ErrorBoundary>
        )
    },
)

WysiwygEditor.displayName = "WysiwygEditor"

export default WysiwygEditor
