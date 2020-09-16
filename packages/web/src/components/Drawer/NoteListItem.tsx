import { createStyles, ListItem, ListItemText, makeStyles, Theme } from "@material-ui/core"
import React, { useState } from "react"

import { NoteMenu } from "src/components/NoteMenu"
import { Note } from "src/controller/edit"

const useStyles = makeStyles((theme: Theme) => {
    return createStyles({
        thumbnail: {
            whiteSpace: "pre-line", // Line break with `\n`
            height: 72,
        },
    })
})

export const NoteListItem: React.FC<{ note: Note; onClick: () => void; selected: boolean }> = ({
    note,
    onClick,
    selected,
}) => {
    const classes = useStyles()

    const [menuProps, setMenuProps] = useState<{
        anchorEl: HTMLElement | null
        left: number
        top: number
    }>({ anchorEl: null, left: 0, top: 0 })

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault()
        setMenuProps({ anchorEl: event.currentTarget, left: event.clientX, top: event.clientY })
    }
    const handleMenuClose = () => {
        setMenuProps({ anchorEl: null, left: 0, top: 0 })
    }

    return (
        <>
            <ListItem
                button
                onClick={onClick}
                selected={selected}
                divider={true}
                data-testid={
                    note.local ? "sidebar_notes_list_item_local" : "sidebar_notes_list_item"
                }
                onContextMenu={handleMenuOpen}
            >
                <ListItemText
                    primary={note.thumbnail}
                    primaryTypographyProps={{
                        display: "block",
                        noWrap: true,
                        classes: {
                            root: classes.thumbnail,
                        },
                    }}
                />
            </ListItem>
            <NoteMenu
                noteKey={note.key}
                anchorEl={menuProps.anchorEl}
                anchorPosition={{
                    top: menuProps.top,
                    left: menuProps.left,
                }}
                handleMenuClose={handleMenuClose}
            />
        </>
    )
}
