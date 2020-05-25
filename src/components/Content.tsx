import { createStyles, makeStyles, Theme } from "@material-ui/core"
import clsx from "clsx"
import React from "react"

import { maxDrawerWidth } from "src/constants"
import { EditContainer } from "src/controller"
import { OuterEditorProps } from "src/editor/components/types"
import { StoreContainer } from "src/store"

import { Welcome } from "./Welcome"

const Editor = React.lazy(() => import("src/editor/components/Editor"))

const useStyles = makeStyles((theme: Theme) => {
    const padding = theme.spacing(3)
    return createStyles({
        content: {
            padding: padding,
            transition: theme.transitions.create("padding", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),

            width: "100%",
            minHeight: "100vh",

            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
        },
        contentShift: {
            [theme.breakpoints.up("md")]: {
                paddingLeft: maxDrawerWidth + padding,
                transition: theme.transitions.create("padding", {
                    easing: theme.transitions.easing.easeOut,
                    duration: theme.transitions.duration.enteringScreen,
                }),
            },
        },
    })
})

const LazyEditor: React.FC<OuterEditorProps> = (props) => {
    return (
        <React.Suspense fallback={<p>Loading...</p>}>
            <Editor {...props} />
        </React.Suspense>
    )
}

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
                <LazyEditor
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
