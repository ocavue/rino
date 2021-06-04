import "codemirror/lib/codemirror.css"
import "codemirror/theme/nord.css"
import "prosemirror-tables/style/tables.css"
import "prosemirror-view/style/prosemirror.css"

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
    const [note, setNote] = useState({ content: "default content", deleted: false })
    const setNoteContent = useCallback((content: string) => setNote({ content, deleted: false }), [])

    return (
        <drawerActivityContainer.Provider>
            <Editor
                autoFocus={true}
                note={note}
                setNoteContent={setNoteContent}
                extraClassName={""}
                maxDrawerWidth={100}
                isTestEnv={true}
                isDarkMode={false}
                drawerActivityContainer={drawerActivityContainer}
            />
        </drawerActivityContainer.Provider>
    )
}

const App: FC = () => {
    return (
        <>
            <span className="dev-header">
                <p>notice: this page is only for development</p>
                <p>you can click the editor and press "Command + /" (on macOS/iOS) or "Ctrl + /" (on other OS) to swtich the mode</p>
            </span>
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
