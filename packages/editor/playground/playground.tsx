import "./style.css"

import { isString } from "lodash-es"
import React, { FC, useEffect, useMemo, useState } from "react"
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

const DebugButton: FC<{ debugState: DebugState; toggleEnableDevTools: () => void }> = ({ debugState, toggleEnableDevTools }) => {
    useDebugState(debugState)
    return (
        <button
            className={debugState.enableDevTools ? "playground-debug-button-enable" : "playground-debug-button-disable"}
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

const DebugConsole: FC<{ hasUnsavedChanges: boolean; debugState: DebugState; onSelect: (content: string) => void }> = ({
    hasUnsavedChanges,
    debugState,
    onSelect,
}) => {
    useDebugState(debugState)
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
            <select id="contentType" value={debugState.contentId} onChange={(e) => onSelect(e.target.value)}>
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
                {debugState.content}
            </pre>
        </div>
    )
}

const wysiwygOptions: WysiwygOptions = {
    isTesting: true,
}

const initDebugState = (params: URLSearchParams): DebugState => {
    let content = params.get("content")
    let contentId = params.get("contentid")
    const enableDevTools = params.get("devtools") === "true"
    if (isString(content)) {
        // initialContent having priority over contentId
        contentMap["customize"] = content
        contentId = "customize"
    }
    if (!(contentId !== null && contentId in contentMap)) {
        contentId = "default"
    }
    content = contentMap[contentId]
    return { contentId, content, enableDevTools }
}

interface DebugState {
    contentId: string
    content: string
    enableDevTools: boolean
}

const useDebugState = (s: DebugState): void => {
    useEffect(() => {
        const params = new URLSearchParams(document.location.search)
        params.set("contentid", s.contentId)
        params.set("devtools", s.enableDevTools ? "true" : "false")
    })
}

const App: FC = () => {
    const params = new URLSearchParams(document.location.search)
    // const debugState = initDebugState(params)

    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const [debugState, setDebugState] = useState(initDebugState(params))

    // const [content, setContent] = useState(debugState.content)
    // const [contentId, setContentId] = useState(debugState.contentId)
    // const [enableDevTools, setEnableDevTools] = useState(debugState.enableDevTools)

    const note = useMemo(() => {
        return {
            content: debugState.content,
            deleted: false,
        }
    }, [debugState.content])

    const editor = (
        <Editor
            key={debugState.contentId}
            note={note}
            wysiwygOptions={wysiwygOptions}
            enableDevTools={debugState.enableDevTools}
            onHasUnsavedChanges={setHasUnsavedChanges}
            onContentSave={(s: string) => {
                debugState.content = s
                setDebugState(debugState)
            }}
        />
    )
    const debugConsole = (
        <DebugConsole
            hasUnsavedChanges={hasUnsavedChanges}
            debugState={debugState}
            onSelect={(s: string) => setDebugState((prevState) => ({ ...prevState, contentId: s, content: contentMap[s] }))}
        />
    )
    return (
        <div style={{ width: "100%" }}>
            <DebugButton
                debugState={debugState}
                toggleEnableDevTools={() => setDebugState((prevState) => ({ ...prevState, enableDevTools: !prevState.enableDevTools }))}
            />
            <div className="playground-box">
                <div className="playground-self-scroll">{editor}</div>
                {debugState.enableDevTools ? <div className="playground-self-scroll">{debugConsole}</div> : null}
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
