import { createStyles, makeStyles, Theme } from "@material-ui/core"
import { useTheme } from "@material-ui/core/styles"
import React from "react"

import { Editor } from "@rino.app/editor"

import { MAX_DRAWER_WIDTH } from "src/constants"
import { Note } from "src/controller/edit"
import { WorksapceStateContainer } from "src/controller/workspace-state/hook"
import { isTestEnv } from "src/utils"

import { tableMenuSvgs } from "./table-menu-svg"

type StylesProps = {
    maxEditorWidth: number
}

type StylesClassKey = "editor"

const useStyles = makeStyles<Theme, StylesProps, StylesClassKey>((theme: Theme) => {
    return createStyles({
        editor: (props) => ({
            height: "100%",
            width: "100%",
            maxWidth: props.maxEditorWidth,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "stretch",
            "& .ProseMirror": {
                paddingTop: "40px !important",
                flex: "1 !important",
                border: "none",
                outline: "none",
                boxShadow: "none",
            },
        }),
    })
})

type EditorProps = {
    autoFocus: boolean
    note: Note
    setNoteContent: (content: string) => void
}

export const NoteEditor: React.FC<EditorProps> = ({ autoFocus, note, setNoteContent }) => {
    const classes = useStyles({ maxEditorWidth: MAX_DRAWER_WIDTH })
    const theme = useTheme()

    return (
        <Editor
            autoFocus={autoFocus}
            note={note}
            setNoteContent={setNoteContent}
            extraClassName={classes.editor}
            isDarkMode={theme.palette.type === "dark"}
            maxDrawerWidth={MAX_DRAWER_WIDTH}
            isTestEnv={isTestEnv()}
            DrawerActivityContainer={WorksapceStateContainer}
            tableMenuSvgs={tableMenuSvgs}
        />
    )
}

NoteEditor.displayName = "NoteEditor"
