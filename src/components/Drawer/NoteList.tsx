import { List } from "@material-ui/core"
import React, { useMemo } from "react"

import { EditContainer } from "src/controller"
import { useIsMobile } from "src/hooks"
import { StoreContainer } from "src/store"

import { NoteListItem } from "./NoteListItem"
import { useBodyStyles } from "./style"

export const NoteList: React.FC<{}> = () => {
    const classes = useBodyStyles()
    const {
        state: { setDrawerActivity },
    } = StoreContainer.useContainer()
    const { noteKey, setNoteKey, collection } = EditContainer.useContainer()

    const isMobile = useIsMobile()

    const selectNote = (key: string) => {
        setNoteKey(key)
        if (isMobile) setDrawerActivity(false)
    }

    const visibleNotes = useMemo(() => collection?.notes || [], [collection])

    return (
        <List className={classes.drawerBody} data-testid="sidebar-notes">
            {visibleNotes.map((note) => (
                <NoteListItem
                    key={note.key}
                    note={note}
                    selected={note.key === noteKey}
                    onClick={() => selectNote(note.key)}
                />
            ))}
        </List>
    )
}
