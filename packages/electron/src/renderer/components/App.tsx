import React, { useCallback, useState } from "react"
import { createContainer } from "unstated-next"

import { Editor } from "@rino.app/editor"

const useDrawerActivityState = () => {
    const [drawerActivity, setDrawerActivity] = useState(true)
    return {
        drawerActivity,
        setDrawerActivity,
    }
}

const drawerActivityContainer = createContainer(useDrawerActivityState)

function useNote() {
    const [note, setNote] = useState({ content: "# Hello world", deleted: false })
    const setNoteContent = useCallback((content: string) => {
        setNote((note) => {
            return { ...note, content }
        })
    }, [])
    return { note, setNoteContent }
}

function App() {
    const { note, setNoteContent } = useNote()

    return (
        <div className="App" style={{ background: "white", width: "100%", minHeight: "100vh", height: "100%", position: "absolute" }}>
            <drawerActivityContainer.Provider>
                <Editor
                    autoFocus
                    note={note}
                    setNoteContent={setNoteContent}
                    isDarkMode={false}
                    isTestEnv={false}
                    extraClassName=""
                    maxDrawerWidth={400}
                    drawerActivityContainer={drawerActivityContainer}
                />
            </drawerActivityContainer.Provider>
        </div>
    )
}

export default App
