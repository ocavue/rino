export interface MarkdownNote {
    content: string
    path: string
}

export type MarkdownNoteState = {
    content: string
    path: string
    deleted: boolean

    // the content id is used to identify the content in the state
    contentId: number

    // main process is saving the file
    savingContentId: number

    lastSavedContentId: number

    lastSavingStartTime: number

    // wait for the editor to serialize the content
    isSerializing: boolean

    // if this is true, the file will be closed after saving
    isWaittingToClose: boolean

}
