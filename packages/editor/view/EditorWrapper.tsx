import React, { useCallback, useState } from "react"
import { createContainer } from "unstated-next"

import { Editor } from "../src/components/Editor"
import { TableMenuSvgs } from "../src/components/table-menu/svg"

const useDrawerActivityState = () => {
    const [drawerActivity, setDrawerActivity] = useState(true)
    return {
        drawerActivity,
        setDrawerActivity,
    }
}

const DrawerActivityContainer = createContainer(useDrawerActivityState)

const EmptyComponent = () => null

const tableMenuSvgs: TableMenuSvgs = {
    AddColumnAfter: EmptyComponent,
    AddColumnBefore: EmptyComponent,
    AddRowAfter: EmptyComponent,
    AddRowBefore: EmptyComponent,
    DeleteColumn: EmptyComponent,
    DeleteRow: EmptyComponent,
}

const EditorWrapper = () => {
    const [note, setNote] = useState({ content: "default content", deleted: false })
    const setNoteContent = useCallback((content: string) => setNote({ content, deleted: false }), [])

    return (
        <DrawerActivityContainer.Provider>
            <Editor
                autoFocus={true}
                note={note}
                setNoteContent={setNoteContent}
                extraClassName={""}
                maxDrawerWidth={100}
                isTestEnv={true}
                isDarkMode={true}
                DrawerActivityContainer={DrawerActivityContainer}
                tableMenuSvgs={tableMenuSvgs}
            />
        </DrawerActivityContainer.Provider>
    )
}

export default EditorWrapper
