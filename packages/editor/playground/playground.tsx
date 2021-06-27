import "codemirror/lib/codemirror.css"
import "codemirror/theme/nord.css"
import "prosemirror-tables/style/tables.css"
import "prosemirror-view/style/prosemirror.css"

import { isString } from "lodash"
import React, { FC, useState } from "react"
import ReactDOM from "react-dom"
import { createContainer } from "unstated-next"

import Editor from "../src/components/Editor"

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

const BlurHandler: FC = () => {
    return (
        <button
            className="blur-handler"
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
            <BlurHandler />
        </>
    )
}

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById("root"),
)
