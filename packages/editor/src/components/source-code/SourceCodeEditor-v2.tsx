import { Remirror, RemirrorProps, useRemirrorContext } from "@remirror/react"
import React, { FC } from "react"

import ErrorBoundary from "../ErrorBoundary"
import { SourceCodeExtension } from "./source-code-manager"

type InnerEditorProps = { className: string }

const InnerEditor: FC<InnerEditorProps> = ({ className }) => {
    const { getRootProps } = useRemirrorContext()
    return <div {...getRootProps()} className={className} />
}

type SourceCodeEditorProps = {
    remirrorProps: RemirrorProps<SourceCodeExtension>
    innerEditorProps: InnerEditorProps
}

const SourceCodeEditor: React.FC<SourceCodeEditorProps> = ({ remirrorProps, innerEditorProps }) => {
    return (
        <ErrorBoundary>
            <Remirror {...remirrorProps} attributes={{ "data-testid": "source_code_mode_textarea" }}>
                <InnerEditor {...innerEditorProps} />
            </Remirror>
        </ErrorBoundary>
    )
}

SourceCodeEditor.displayName = "SourceCodeEditor"

export default SourceCodeEditor
