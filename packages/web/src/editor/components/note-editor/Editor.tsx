import React, { useEffect } from "react"

import { Note } from "src/controller/edit"

import { CombinedEditor } from "../combined/CombinedEditor"

type EditorProps = {
    autoFocus: boolean
    note: Note
    setNoteContent: (content: string) => void
}

export const Editor: React.FC<EditorProps> = ({ autoFocus, note, setNoteContent }) => {
    useEffect(() => {
        console.debug(`Mounting <${Editor.displayName}/>`)
        return () => console.debug(`Unmounting <${Editor.displayName}/>`)
    }, [])

    return (
        <CombinedEditor
            autoFocus={autoFocus}
            editable={!note.deleted}
            content={note.content}
            setContent={setNoteContent}
        />
    )
}

Editor.displayName = "Editor"
