import * as icons from "@material-ui/icons"
import React, { useMemo } from "react"

import { AppbarIconButton } from "src/components/AppbarIconButton"
import { AuthContainer } from "src/controller/auth/hook"
import { EditContainer } from "src/controller/edit"
import { WorksapceStateContainer } from "src/controller/workspace-state/hook"

import { SearchBar } from "./SearchBar"
import { useHeaderStyles } from "./style"

export const NoteHeader: React.FC = () => {
    const classes = useHeaderStyles()

    const { loadingData } = WorksapceStateContainer.useContainer()
    const { user, loadingUser } = AuthContainer.useContainer()

    const {
        createServerNote,
        createLocalNote,
        collection,
        searchQuery,
        setSearchQuery,
    } = EditContainer.useContainer()

    const disableCreateBtn = useMemo(
        () => loadingData || loadingUser || collection.role === "trash",
        [loadingData, loadingUser, collection],
    )

    const onClickCreateBtn = () => {
        // Exit search if a new note is been added so that the new note will show in the drawer note list
        if (searchQuery) setSearchQuery("")

        if (user) createServerNote(user.uid)
        else createLocalNote()
    }

    return (
        <div className={classes.drawerHeader}>
            <SearchBar />
            <AppbarIconButton
                className={classes.drawerHeaderButton}
                onClick={onClickCreateBtn}
                disabled={disableCreateBtn}
                data-testid={`sidebar-notes-btn-create-note${disableCreateBtn ? "-disabled" : ""}`}
            >
                <icons.Add />
            </AppbarIconButton>
        </div>
    )
}
