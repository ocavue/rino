import * as m from "@material-ui/core"
import React from "react"

import { Note } from "src/controller"

const useStyles = m.makeStyles((theme: m.Theme) => {
    return m.createStyles({
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
    return (
        <m.ListItem
            button
            onClick={onClick}
            selected={selected}
            divider={true}
            data-testid={note.local ? "sidebar-notes-list-item-local" : "sidebar-notes-list-item"}
        >
            <m.ListItemText
                primary={note.thumbnail}
                primaryTypographyProps={{
                    display: "block",
                    noWrap: true,
                    classes: {
                        root: classes.thumbnail,
                    },
                }}
            />
        </m.ListItem>
    )
}
