import { Box, CircularProgress } from "@material-ui/core"
import React, { useMemo } from "react"

import { AuthContainer } from "src/controller/auth/hook"
import { EditContainer } from "src/controller/edit"
import { WorksapceStateContainer } from "src/controller/workspace-state/hook"

import { NoteList } from "./NoteList"

export const NoteBody: React.FC = () => {
    const { loadingData } = WorksapceStateContainer.useContainer()
    const { loadingUser } = AuthContainer.useContainer()

    const loading = useMemo(() => loadingUser || loadingData, [loadingData, loadingUser])

    const { noteKey, setNoteKey, searchQuery, visibleNotes } = EditContainer.useContainer()

    // `notesNotFound` is true when the user is searching notes but nothing match the query
    const notesNotFound = searchQuery && visibleNotes.length == 0

    if (loading) {
        return (
            <Box display="flex" alignItems="center" justifyContent="center" height="100%" data-testid="drawer_note_body_loading">
                <CircularProgress />
            </Box>
        )
    } else if (notesNotFound) {
        return (
            <Box pt={3} mx="auto" color="text.hint" data-testid="drawer_note_body_note_not_fount">
                <h3>No results found.</h3>
            </Box>
        )
    } else {
        return <NoteList visibleNotes={visibleNotes} noteKey={noteKey} setNoteKey={setNoteKey} />
    }
}
