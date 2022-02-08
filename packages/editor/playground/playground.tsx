import "./style.css"

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

const contentMap: { [key: string]: string } = {
    default: defaultContent,
    "just-code": justCodeContent,
    long: longContent,
    customize: "",
}

const DebugButton: FC<{ enableDevTools: boolean; toggleEnableDevTools: () => void }> = ({ enableDevTools, toggleEnableDevTools }) => {
    return (
        <button
            className={enableDevTools ? "playground-debug-button-enable" : "playground-debug-button-disable"}
            onClick={(e) => toggleEnableDevTools()}
        >
            Debug
        </button>
    )
}

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

const DebugConsole: FC<{ hasUnsavedChanges: boolean; contentId: string; content: string; onSelect: (content: string) => void }> = ({
    hasUnsavedChanges,
    contentId,
    content,
    onSelect,
}) => {
    const options = Object.keys(contentMap).map((k) => (
        <option key={k} value={k}>
            {k}
        </option>
    ))
    return (
        <div
            style={{
                paddingTop: "32px",
                paddingBottom: "64px",
                paddingLeft: "max(32px, calc(50% - 400px))",
                paddingRight: "max(32px, calc(50% - 400px))",
                fontSize: "16px",
                lineHeight: "1.5",
            }}
        >
            <p>
                <strong>hasUnsavedChanges: </strong>
                {JSON.stringify(hasUnsavedChanges)}
            </p>
            <p>
                <strong>content:</strong>
            </p>
            <select id="contentType" value={contentId} onChange={(e) => onSelect(e.target.value)}>
                {options}
            </select>
            <pre
                style={{
                    whiteSpace: "pre-wrap",
                    fontFamily: "monospace",
                    marginBottom: "16px",
                    backgroundColor: "#f6f8fa",
                    fontSize: "85%",
                    borderRadius: "3px",
                    padding: "16px",
                    overflowWrap: "break-word",
                    overflow: "hidden",
                }}
            >
                {content}
            </pre>
        </div>
    )
}

const wysiwygOptions: WysiwygOptions = {
    isTesting: true,
}

const App: FC = () => {
    const params = new URLSearchParams(document.location.search)
    const initialContent = params.get("content")
    let initialContentId = params.get("contentid")
    const defaultEnableDevTools = params.get("devtools") === "true"

    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

    if (isString(initialContent)) {
        // initialContent having priority over contentId
        contentMap["customize"] = initialContent
        initialContentId = "customize"
    }
    let defaultContentId = "default"
    if (initialContentId !== null && initialContentId in contentMap) {
        defaultContentId = initialContentId
    }

    const [content, setContent] = useState(contentMap[defaultContentId])
    const [contentId, setContentId] = useState(defaultContentId)
    const [enableDevTools, setEnableDevTools] = useState(defaultEnableDevTools)

    const note = useMemo(() => {
        return {
            content,
            deleted: false,
        }
    }, [content])

    const changeContentSelect = (s: string) => {
        setContentId(s)
        setContent(contentMap[s])
    }

    const editor = (
        <Editor
            key={contentId}
            note={note}
            wysiwygOptions={wysiwygOptions}
            enableDevTools={enableDevTools}
            onHasUnsavedChanges={setHasUnsavedChanges}
            onContentSave={setContent}
        />
    )
    return (
        <div style={{ width: "100%" }}>
            <DebugButton enableDevTools={enableDevTools} toggleEnableDevTools={() => setEnableDevTools(!enableDevTools)} />
            <div className="playground-box">
                <div className="playground-self-scroll">{editor}</div>
                {enableDevTools ? (
                    <div className="playground-self-scroll">
                        <DebugConsole
                            hasUnsavedChanges={hasUnsavedChanges}
                            contentId={contentId}
                            content={content}
                            onSelect={changeContentSelect}
                        />
                    </div>
                ) : null}
            </div>
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
