import { isString } from "lodash"
import React, { FC, useState } from "react"
import ReactDOM from "react-dom"
import { createContainer } from "unstated-next"

import { Editor } from "../src"

const useDrawerActivityState = () => {
    const [drawerActivity, setDrawerActivity] = useState(true)
    return {
        drawerActivity,
        setDrawerActivity,
    }
}

const drawerActivityContainer = createContainer(useDrawerActivityState)

const DefaultEditor: FC = () => {
    const params = new URLSearchParams(document.location.search)
    const content = params.get("content")
    const enableDevTools = params.get("devtools") !== "false"

    const [note] = useState({ content: isString(content) ? content : "# Title\nhello world", deleted: false })

    return (
        <drawerActivityContainer.Provider>
            <Editor note={note} drawerActivityContainer={drawerActivityContainer} isTestEnv enableDevTools={enableDevTools} />
        </drawerActivityContainer.Provider>
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
