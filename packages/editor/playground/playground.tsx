import { isString } from "lodash-es"
import React, { FC, useMemo, useState } from "react"
import ReactDOM from "react-dom"

import type { WysiwygOptions } from "../src"
import { Editor } from "../src"

const singleRow = `hello **strong**! hello *italic*! hello \`code\`! hello [link](https://www.google.com)!`

const longContent = (singleRow.repeat(200) + "\n\n").repeat(5)

const justCodeContent = `
\`\`\`python
while True:
    print("hello world")
\`\`\`
`.trim()

const defaultContent = [
    `

# Title

hello world!

`.trim(),
    singleRow,
    justCodeContent,
    `

- list item
- list item
  - [x] checked
  - [ ] unchecked

1. first
1. second
1. third

`.trim(),
].join("\n")

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
        <div className="css-t4vd4r" style={{ borderTop: "1px solid gray" }}>
            <div className="ProseMirror">
                <p>
                    <strong>hasUnsavedChanges: </strong>
                    {JSON.stringify(hasUnsavedChanges)}
                </p>
                <p>
                    <strong>content:</strong>
                </p>
                <pre
                    style={{
                        whiteSpace: "pre-wrap",
                        fontFamily: "monospace",
                        marginBottom: "16px",
                        backgroundColor: "#f6f8fa",
                        fontSize: "85%",
                        borderRadius: "3px",
                        padding: "16px",
                    }}
                >
                    {content}
                </pre>
            </div>
        </div>
    )
}

const wysiwygOptions: WysiwygOptions = {
    isTesting: true,
}

const App: FC = () => {
    const params = new URLSearchParams(document.location.search)
    const initialContent = params.get("content")
    const initialContentId = params.get("contentid")
    const enableDevTools = params.get("devtools") !== "false"

    const note = useMemo(() => {
        let content = defaultContent
        if (isString(initialContent)) {
            content = initialContent
        } else if (initialContentId === "long") {
            content = longContent
        } else if (initialContentId === "just-code") {
            content = justCodeContent
        }

        return {
            content,
            deleted: false,
        }
    }, [initialContent, initialContentId])

    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const [content, setContent] = useState("")

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <Editor
                note={note}
                wysiwygOptions={wysiwygOptions}
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
