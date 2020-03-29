import * as icons from "@material-ui/icons"
import React, { useMemo } from "react"

import { AppbarIconButton } from "src/components/AppbarIconButton"
import { EditContainer } from "src/controller"
import { StoreContainer } from "src/store"

import { useHeaderStyles } from "./style"

export const NoteHeader: React.FC = () => {
    const classes = useHeaderStyles()

    const {
        auth: { user },
        state: { loading },
    } = StoreContainer.useContainer()

    const { createServerNote, createLocalNote, collection } = EditContainer.useContainer()

    const disableCreateBtn = useMemo(() => loading || collection.role === "trash", [
        loading,
        collection,
    ])

    const onClickCreateBtn = () => {
        if (user) createServerNote(user.uid)
        else createLocalNote()
    }

    return (
        <div className={classes.drawerHeader}>
            {/* <AppbarIconButton
                className={classes.drawerHeaderButton}
                disabled={loading}
                data-testid={`sidebar-notes-btn-search${loading ? "-disabled" : ""}`}
            >
                <icons.Search />
            </AppbarIconButton> */}
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
