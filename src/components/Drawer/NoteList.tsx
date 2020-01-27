import { EditContainer } from "src/controller"
import { List } from "@material-ui/core"
import { NoteListItem } from "./NoteListItem"
import { StoreContainer } from "src/store"
import { useBodyStyles } from "./style"
import { useIsMobile } from "src/hooks"
import React from "react"

export const NoteList: React.FC<{}> = () => {
    const classes = useBodyStyles()
    const {
        state: { setDrawerActivity },
    } = StoreContainer.useContainer()
    const { noteKey, setNoteKey, notes } = EditContainer.useContainer()

    const isMobile = useIsMobile()

    const selectNote = (key: string) => {
        setNoteKey(key)
        if (isMobile) setDrawerActivity(false)
    }

    return (
        <List className={classes.drawerBody} data-testid="sidebar-notes">
            {notes.map(note => (
                <NoteListItem
                    note={note}
                    key={note.key}
                    selected={note.key === noteKey}
                    onClick={() => selectNote(note.key)}
                />
            ))}
        </List>
    )
}
