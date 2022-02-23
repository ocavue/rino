import "./style.css"

import { isString } from "lodash-es"
import React, { FC, useMemo } from "react"
import ReactDOM from "react-dom"

import type { WysiwygOptions } from "../src"
import { Editor } from "../src"
import useContent, { contentMap } from "./src/hooks/use-content"
import useDevTools from "./src/hooks/use-devtools"

const DebugButton: FC<{ enableDevTools: boolean; toggleEnableDevTools: () => void }> = ({ enableDevTools, toggleEnableDevTools }) => {
    // useDebugState(debugState)
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

const DebugConsole: FC<{ hasUnsavedChanges: boolean; contentId: string; content: string; setContentId: (content: string) => void }> = ({
    hasUnsavedChanges,
    contentId,
    content,
    setContentId,
}) => {
    // useDebugState(debugState)
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
            <select id="contentType" value={contentId} onChange={(e) => setContentId(e.target.value)}>
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

function getInitOptions() {
    const params = new URLSearchParams(document.location.search)
    let initContent = params.get("content")
    let initContentId = params.get("contentid")
    const initEnableDevTools = params.get("devtools") === "true"
    if (isString(initContent)) {
        // initialContent having priority over contentId
        contentMap["customize"] = initContent
        initContentId = "customize"
    }
    if (!(initContentId !== null && initContentId in contentMap)) {
        initContentId = "default"
    }
    initContent = contentMap[initContentId]
    return {
        initContentId,
        initContent,
        initEnableDevTools,
    }
}

const App: FC = () => {
    const { initContentId, initContent, initEnableDevTools } = getInitOptions()

    const { contentId, content, hasUnsavedChanges, setContentId, setContent, setHasUnsavedChanges } = useContent(initContentId, initContent)
    const { enableDevTools, setEnableDevTools } = useDevTools(initEnableDevTools)

    const note = useMemo(() => {
        return {
            content: content,
            deleted: false,
        }
    }, [content])

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
    const debugConsole = (
        <DebugConsole hasUnsavedChanges={hasUnsavedChanges} contentId={contentId} content={content} setContentId={setContentId} />
    )
    return (
        <div style={{ width: "100%" }}>
            <DebugButton enableDevTools={enableDevTools} toggleEnableDevTools={() => setEnableDevTools(!enableDevTools)} />
            <div className="playground-box">
                <div className="playground-self-scroll">{editor}</div>
                {enableDevTools ? <div className="playground-self-scroll">{debugConsole}</div> : null}
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
