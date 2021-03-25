/* Copyright (c) 2020-present ocavue@gmail.com */

import React, { useCallback, useState } from "react"
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

const EditorWrapper = () => {
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

export default EditorWrapper
