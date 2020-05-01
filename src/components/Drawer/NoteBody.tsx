import { Box, CircularProgress } from "@material-ui/core"
import React from "react"

import { EditContainer } from "src/controller"
import { StoreContainer } from "src/store"

import { NoteList } from "./NoteList"

export const NoteBody: React.FC = () => {
    const {
        state: { loading },
    } = StoreContainer.useContainer()

    const { noteKey, setNoteKey, searchQuery, visibleNotes } = EditContainer.useContainer()

    // `notesNotFound` is true when the user is searching notes but nothing match the query
    const notesNotFound = searchQuery && visibleNotes.length == 0

    if (loading) {
        return (
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                height="100%"
                data-testid="drawer-note-body-loading"
            >
                <CircularProgress />
            </Box>
        )
    } else if (notesNotFound) {
        return (
            <Box pt={3} mx="auto" color="text.hint" data-testid="drawer-note-body-note-not-fount">
                <h3>No results found.</h3>
            </Box>
        )
    } else {
        return <NoteList visibleNotes={visibleNotes} noteKey={noteKey} setNoteKey={setNoteKey} />
    }
}
