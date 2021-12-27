import { isString } from "lodash-es"
import React, { FC, useMemo, useState } from "react"
import ReactDOM from "react-dom"

import { Editor } from "../src"

const defaultContent = `

# Title

hello world!

hello **strong**! hello *italic*! hello \`code\`!


\`\`\`python
while True:
    print("hello world")
\`\`\`

- list item
- list item
  - [x] checked
  - [ ] unchecked

1. first
1. second
1. third

`.trim()

/** focus this element to hide the cursor in the editor */
const BlurHelper: FC = () => {
    return (
        <button
            className="blur-helper"
            style={{
                position: "absolute",
                bottom: "64px",
                right: "64px",
                opacity: 0,
            }}
        ></button>
    )
}

const DebugConsole: FC<{ hasUnsavedChanges: boolean; content: string }> = ({ hasUnsavedChanges, content }) => {
    return (
        <div>
            <p>content: {content}</p>
            <p>hasUnsavedChanges: {JSON.stringify(hasUnsavedChanges)}</p>
        </div>
    )
}

const App: FC = () => {
    const params = new URLSearchParams(document.location.search)
    const initialContent = params.get("content")
    const enableDevTools = params.get("devtools") !== "false"

    const note = useMemo(() => {
        return {
            content: isString(initialContent) ? initialContent : defaultContent,
            deleted: false,
        }
    }, [initialContent])

    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const [content, setContent] = useState("")

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <Editor
                note={note}
                isTestEnv
                enableDevTools={enableDevTools}
                onHasUnsavedChanges={setHasUnsavedChanges}
                onContentSave={setContent}
            />
            {enableDevTools ? <DebugConsole hasUnsavedChanges={hasUnsavedChanges} content={content} /> : null}
            <BlurHelper />
        </div>
    )
}

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById("root"),
)
