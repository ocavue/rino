import { isString } from "lodash"
import React, { FC, useCallback, useState } from "react"
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

    const [note, setNote] = useState({ content: isString(content) ? content : "# Title\nhello world", deleted: false })
    const setNoteContent = useCallback((content: string) => {
        setNote({ content, deleted: false })
    }, [])

    return (
        <drawerActivityContainer.Provider>
            <Editor note={note} setNoteContent={setNoteContent} drawerActivityContainer={drawerActivityContainer} isTestEnv />
        </drawerActivityContainer.Provider>
    )
}

const App: FC = () => {
    return (
        <>

            <DefaultEditor />
        </>
    )
}

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById("root"),
)
