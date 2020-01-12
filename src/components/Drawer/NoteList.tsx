import { List } from "@material-ui/core"
import { Note } from "src/controller"
import { NoteListItem } from "./NoteListItem"
import { StoreContainer } from "src/store"
import { useBodyStyles } from "./style"
import { useIsMobile } from "src/hooks"
import React from "react"

export const NoteList: React.FC<{ notes: Note[] }> = ({ notes }) => {
    const classes = useBodyStyles()
    const {
        edit: { setNote, note, renderKey },
        state: { setDrawerActivity },
    } = StoreContainer.useContainer()
    const isMobile = useIsMobile()

    const selectNote = (note: Note) => {
        setNote(note)
        if (isMobile) setDrawerActivity(false)
    }

    return (
        <List className={classes.drawerBody} data-testid="sidebar-notes">
            {notes.map(n => (
                <NoteListItem
                    note={n}
                    key={n.key + renderKey.toString()}
                    selected={n.key === note?.key}
                    onClick={() => selectNote(n)}
                />
            ))}
        </List>
    )
}
