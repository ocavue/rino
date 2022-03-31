import { Remirror, RemirrorProps, useRemirrorContext } from "@remirror/react"
import React, { FC } from "react"

import { TableCellButton, TableTooltip } from "../../extensions/table-components"
import DevTools from "../DevTools"
import ErrorBoundary from "../ErrorBoundary"
import { WysiwygExtension } from "./wysiwyg-extension"

type InnerEditorProps = { className: string; enableDevTools: boolean }

const InnerEditor: FC<InnerEditorProps> = ({ className, enableDevTools }) => {
    const { getRootProps } = useRemirrorContext<WysiwygExtension>()
    return (
        <>
            <TableTooltip />
            <TableCellButton />
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
