import { Remirror, RemirrorProps, useCommands, useRemirrorContext } from "@remirror/react"
import React, { FC } from "react"

import DevTools from "../DevTools"
import ErrorBoundary from "../ErrorBoundary"
import TableMenu from "./TableMenu"
import { WysiwygExtension } from "./wysiwyg-extension"

type InnerEditorProps = { className: string; enableDevTools: boolean }

const InnerEditor: FC<InnerEditorProps> = ({ className, enableDevTools }) => {
    const commands = useCommands<WysiwygExtension>()
    const { getRootProps } = useRemirrorContext<WysiwygExtension>()
    return (
        <>
            <TableMenu commands={commands} />
            <div {...getRootProps()} className={className} spellCheck={false} />
            {enableDevTools ? <DevTools /> : null}
        </>
    )
}

type WysiwygEditorProps = {
    remirrorProps: RemirrorProps<WysiwygExtension>
    innerEditorProps: InnerEditorProps
}

const WysiwygEditor: React.FC<WysiwygEditorProps> = ({ remirrorProps, innerEditorProps }) => {
    return (
        <ErrorBoundary>
            <Remirror {...remirrorProps} attributes={{ "data-testid": "wysiwyg_mode_textarea" }}>
                <InnerEditor {...innerEditorProps} />
            </Remirror>
        </ErrorBoundary>
    )
}

WysiwygEditor.displayName = "WysiwygEditor"

export default WysiwygEditor
