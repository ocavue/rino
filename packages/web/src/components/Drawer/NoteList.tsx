import { List } from "@material-ui/core"
import React from "react"

import { Note } from "src/controller/edit"
import { WorksapceStateContainer } from "src/controller/workspace-state/hook"
import { useIsMobile } from "src/hooks"

import { NoteListItem } from "./NoteListItem"
import { useBodyStyles } from "./style"

export const NoteList: React.FC<{
    visibleNotes: Note[]
    noteKey: string | null
    setNoteKey: React.Dispatch<React.SetStateAction<string | null>>
}> = ({ visibleNotes, noteKey, setNoteKey }) => {
    const classes = useBodyStyles()
    const { setDrawerActivity } = WorksapceStateContainer.useContainer()

    const isMobile = useIsMobile()

    const selectNote = (key: string) => {
        setNoteKey(key)
        if (isMobile) setDrawerActivity(false)
    }

    return (
        <List className={classes.drawerBody} data-testid="sidebar_notes">
            {visibleNotes.map((note) => (
                <NoteListItem key={note.key} note={note} selected={note.key === noteKey} onClick={() => selectNote(note.key)} />
            ))}
        </List>
    )
}
