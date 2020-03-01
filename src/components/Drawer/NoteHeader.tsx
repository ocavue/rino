import * as icons from "@material-ui/icons"
import { AppbarIconButton } from "src/components/AppbarIconButton"
import { EditContainer } from "src/controller"
import { StoreContainer } from "src/store"
import { useHeaderStyles } from "./style"
import React from "react"

export const NoteHeader: React.FC = () => {
    const classes = useHeaderStyles()

    const {
        auth: { user },
        state: { loading },
    } = StoreContainer.useContainer()

    const { createServerNote, createLocalNote } = EditContainer.useContainer()

    const onClickCreateBtn = () => {
        if (user) createServerNote(user.uid)
        else createLocalNote()
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
                onClick={onClickCreateBtn}
                disabled={loading}
                data-testid={`sidebar-notes-btn-create-note${loading ? "-disabled" : ""}`}
            >
                <icons.Add />
            </AppbarIconButton>
        </div>
    )
}
