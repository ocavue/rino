import * as icons from "@material-ui/icons"
import { AppbarIconButton } from "src/components/AppbarIconButton"
import { Note } from "src/controller"
import { StoreContainer } from "src/store"
import { useHeaderStyles } from "./style"
import React from "react"

export const NoteHeader: React.FC = () => {
    const classes = useHeaderStyles()

    const {
        edit: { setNote, setNotes, notes },
        auth: { user },
        state: { loading },
    } = StoreContainer.useContainer()

    const createNote = () => {
        if (user) {
            const newNote = new Note(user.uid)
            setNotes([newNote, ...(notes || [])])
            setNote(newNote)
        }
    }

    return (
        <div className={classes.drawerHeader}>
            <AppbarIconButton
                className={classes.drawerHeaderButton}
                disabled={loading}
                data-testid={`sidebar-notes-btn-search${loading ? "-disabled" : ""}`}
            >
                <icons.Search />
            </AppbarIconButton>
            <AppbarIconButton
                className={classes.drawerHeaderButton}
                onClick={createNote}
                disabled={loading}
                data-testid={`sidebar-notes-btn-create-note${loading ? "-disabled" : ""}`}
            >
                <icons.Add />
            </AppbarIconButton>
        </div>
    )
}
