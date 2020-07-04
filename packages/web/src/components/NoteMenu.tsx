import { Menu, MenuItem } from "@material-ui/core"
import React from "react"

import { EditContainer } from "src/controller/edit"
import { WorksapceStateContainer } from "src/controller/workspace-state/hook"

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
    const { setDrawerActivity } = WorksapceStateContainer.useContainer()

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
