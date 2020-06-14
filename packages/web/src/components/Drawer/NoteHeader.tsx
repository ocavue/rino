import * as icons from "@material-ui/icons"
import React, { useMemo } from "react"

import { AppbarIconButton } from "src/components/AppbarIconButton"
import { EditContainer } from "src/controller"
import { StoreContainer } from "src/store"

import { SearchBar } from "./SearchBar"
import { useHeaderStyles } from "./style"

export const NoteHeader: React.FC = () => {
    const classes = useHeaderStyles()

    const {
        auth: { user },
        state: { loading },
    } = StoreContainer.useContainer()

    const {
        createServerNote,
        createLocalNote,
        collection,
        searchQuery,
        setSearchQuery,
    } = EditContainer.useContainer()

    const disableCreateBtn = useMemo(() => loading || collection.role === "trash", [
        loading,
        collection,
    ])

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
