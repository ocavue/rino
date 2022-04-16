import { Remirror, RemirrorProps, useRemirrorContext } from "@remirror/react"
import React, { FC } from "react"

import { TableCellButton, TableTooltip } from "../../extensions/table-components"
import ErrorBoundary from "../ErrorBoundary"
import { ENABLE_REACT_CODE_LANGUAGE_SELECTOR } from "../flags"
import LazyDevTools from "../LazyDevTools"
import CodeLanguageSelect from "./CodeLanguageSelect"
import { WysiwygExtension } from "./wysiwyg-extension"

type InnerEditorProps = { className: string; enableDevTools: boolean }

const InnerEditor: FC<InnerEditorProps> = ({ className, enableDevTools }) => {
    const { getRootProps } = useRemirrorContext<WysiwygExtension>()
    return (
        <>
            <TableTooltip />
            <TableCellButton />
            {ENABLE_REACT_CODE_LANGUAGE_SELECTOR ? <CodeLanguageSelect /> : null}
            <div {...getRootProps()} className={className} spellCheck={false} />
            {enableDevTools ? <LazyDevTools /> : null}
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
