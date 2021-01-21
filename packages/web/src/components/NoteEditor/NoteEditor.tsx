import { createStyles, makeStyles } from "@material-ui/core"
import { useTheme } from "@material-ui/core/styles"
import React from "react"

import { Editor } from "@rino.app/editor"

import { MAX_DRAWER_WIDTH, MAX_EDITOR_WIDTH } from "src/constants"
import { Note } from "src/controller/edit"
import { WorksapceStateContainer } from "src/controller/workspace-state/hook"
import { isTestEnv } from "src/utils"

type StylesProps = {
    maxEditorWidth: number
}

const useStyles = makeStyles(() => {
    return createStyles({
        editor: {
            height: "100%",
            width: "100%",
            maxWidth: (props: StylesProps) => props.maxEditorWidth,
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
        },
    })
})

type EditorProps = {
    autoFocus: boolean
    note: Note
    setNoteContent: (content: string) => void
}

const NoteEditor: React.FC<EditorProps> = ({ autoFocus, note, setNoteContent }) => {
    const classes = useStyles({ maxEditorWidth: MAX_EDITOR_WIDTH })
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
            drawerActivityContainer={WorksapceStateContainer}
        />
    )
}

NoteEditor.displayName = "NoteEditor"

export default NoteEditor
