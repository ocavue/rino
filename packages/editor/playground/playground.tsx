import { isString } from "lodash-es"
import React, { FC, useState } from "react"
import ReactDOM from "react-dom"

import { Editor } from "../src"

const defaultContent = `

# Title

hello world

\`\`\`python
while True:
    print("hello world")
\`\`\`

`.trim()

const DefaultEditor: FC = () => {
    const params = new URLSearchParams(document.location.search)
    const content = params.get("content")
    const enableDevTools = params.get("devtools") !== "false"

    const [note] = useState({ content: isString(content) ? content : defaultContent, deleted: false })

    return <Editor note={note} isTestEnv enableDevTools={enableDevTools} />
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

const App: FC = () => {
    return (
        <>
            <DefaultEditor />
            <BlurHelper />
        </>
    )
}

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById("root"),
)
