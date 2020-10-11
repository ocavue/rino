import React, { useEffect, useRef } from "react"

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

    const initialContent = useRef<string>(note.content)

    return (
        <CombinedEditor
            autoFocus={autoFocus}
            editable={!note.deleted}
            content={initialContent.current}
            setContent={setNoteContent}
        />
    )
}

Editor.displayName = "Editor"
