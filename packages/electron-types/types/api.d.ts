// Sended by renderer process and recieved by main process
export type InvokeApi = {
    openFile: (options: { path?: string }) => Promise<{ canceled: boolean; path: string; content: string }>

    saveFile: (options: { path: string; content: string }) => Promise<{ filePath?: string; canceled?: boolean }>

    askMarkdownFileForSave: () => Promise<{ filePath?: string; canceled?: boolean }>

    askMarkdownFileForClose: () => Promise<{ filePath?: string; canceled?: boolean; discarded?: boolean }>

    newWindow: () => Promise<void>

    getCurrentWindow: () => Promise<{ id: number; title: string } | null>

    setTitle: (options: { title: string }) => Promise<void>

    closeWindow: () => Promise<void>
}

// Sended by main process and received by renderer process
export type SendApi = {
    openFile: (options: { path: string }) => void

    ensureFilePath: () => void

    setNotePath: (options: { path: string }) => void

    beforeCloseWindow: () => void
}
