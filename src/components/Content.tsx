import { Editor } from "./Editor"
import { StoreContainer } from "src/store"
import { Theme, createStyles, makeStyles } from "@material-ui/core"
import { Welcome } from "./Welcome"
import { drawerWidth } from "src/constants"
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
                marginLeft: drawerWidth,
            },
        },
    })
})

export const Content: React.FC = () => {
    const {
        state: { drawerActivity },
        edit: { note, updateRenderKey },
    } = StoreContainer.useContainer()
    const classes = useStyles()

    return (
        <main
            className={clsx(classes.content, { [classes.contentShift]: drawerActivity })}
            data-testid="main"
        >
            {note ? (
                <Editor
                    note={note}
                    autoFocus={true}
                    key={note.key}
                    updateRenderKey={updateRenderKey}
                />
            ) : (
                <Welcome />
            )}
        </main>
    )
}
