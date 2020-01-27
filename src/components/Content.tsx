import { EditContainer } from "src/controller"
import { Editor } from "./Editor"
import { StoreContainer } from "src/store"
import { Theme, createStyles, makeStyles } from "@material-ui/core"
import { Welcome } from "./Welcome"
import { maxDrawerWidth } from "src/constants"
import React from "react"
import clsx from "clsx"
const useStyles = makeStyles((theme: Theme) => {
    return createStyles({
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
            transition: theme.transitions.create("margin", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: 0,
            display: "flex",
            flexDirection: "column",
        },
        contentShift: {
            [theme.breakpoints.up("md")]: {
                transition: theme.transitions.create("margin", {
                    easing: theme.transitions.easing.easeOut,
                    duration: theme.transitions.duration.enteringScreen,
                }),
                marginLeft: maxDrawerWidth,
            },
        },
    })
})

export const Content: React.FC = () => {
    const classes = useStyles()

    const {
        state: { drawerActivity },
    } = StoreContainer.useContainer()

    const { setNoteContent, note } = EditContainer.useContainer()

    return (
        <main
            className={clsx(classes.content, { [classes.contentShift]: drawerActivity })}
            data-testid="main"
        >
            {note ? (
                <Editor
                    note={note}
                    setNoteContent={setNoteContent}
                    autoFocus={true}
                    key={note.key}
                />
            ) : (
                <Welcome />
            )}
        </main>
    )
}
