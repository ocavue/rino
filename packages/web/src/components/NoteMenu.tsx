import { Menu, MenuItem } from "@material-ui/core"
import React from "react"

import { EditContainer } from "src/controller"
import { StoreContainer } from "src/store"

export type NoteMenuOptions = {
    noteKey: string | null
    anchorEl: HTMLElement | null
    handleMenuClose: () => void
    anchorPosition?: { top: number; left: number }
}

export const NoteMenu: React.FC<NoteMenuOptions> = ({
    noteKey,
    anchorEl,
    handleMenuClose,
    anchorPosition,
}) => {
    const {
        state: { setDrawerActivity },
    } = StoreContainer.useContainer()

    const { deleteNote } = EditContainer.useContainer()

    const onClickDeleteBtn = () => {
        void deleteNote(noteKey)
        handleMenuClose()
        setDrawerActivity(true) // TODO: test this logic
    }

    return (
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorPosition={anchorPosition || undefined}
            anchorReference={anchorPosition ? "anchorPosition" : undefined}
            data-testid="note-menu"
        >
            <MenuItem onClick={onClickDeleteBtn} data-testid="note-menu-item-delete">
                Delete
            </MenuItem>
        </Menu>
    )
}
