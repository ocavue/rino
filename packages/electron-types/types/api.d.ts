// Sended by renderer process and recieved by main process, asynchronous
export type InvokeApi = {
    openFile: (options: { path?: string }) => Promise<{ canceled: boolean; path: string; content: string }>

    saveFile: (options: { path: string; content: string }) => Promise<{ filePath?: string; canceled?: boolean }>

    askMarkdownFileForSave: () => Promise<{ filePath?: string; canceled?: boolean }>

    askMarkdownFileForClose: () => Promise<{ filePath?: string; canceled?: boolean; discarded?: boolean }>

    newWindow: () => Promise<void>

    getCurrentWindow: () => Promise<{ id: number; title: string } | null>

    setTitle: (options: { title: string }) => Promise<void>

    closeWindow: () => Promise<void>

    stopQuitting: () => Promise<void>
}

// Sended by renderer process and recieved by main process, synchronous
export type SyncInvokeApi = {
    askMarkdownFileForSaveSync: () => { filePath?: string; canceled?: boolean }

    askBeforeDeleteSync: () => { result: "save" | "delete" | "cancel" }

    // This will not be implemented, just for TypeScript. TypeScript forces me to have at least one function who has parameters so that
    // I can use spread argument ('...') somewhere else.
    fakeAPI: (fakeParam: string) => { fakeResult: string }
}

// Sended by main process and received by renderer process
export type SendApi = {
    openFile: (options: { path: string; content: string }) => void

    ensureFilePath: () => void

    setNotePath: (options: { path: string }) => void

    beforeCloseWindow: () => void

    beforeExportToPdf: () => void
}
