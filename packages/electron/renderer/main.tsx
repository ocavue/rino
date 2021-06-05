import React, { FC } from "react"
import ReactDOM from "react-dom"

import Workbench from "./Workbench"

const drawerActivityContainer = {
    useContainer: () => ({
        drawerActivity: false,
    }),
}

const note = {
    content: "hello",
    deleted: false,
}

const setNoteContent = (content: string) => {}

const App: FC = () => {
    return <Workbench note={note} setNoteContent={setNoteContent} drawerActivityContainer={drawerActivityContainer} />
}

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById("root"),
)
