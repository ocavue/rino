import type { IpcMainInvokeEvent, IpcRenderer } from "electron"

export type InvokeRendererAPI = {
    openFile: (options: { path?: string }) => Promise<{ canceled: boolean; path: string; content: string }>

    saveFile: (options: { path: string; content: string }) => Promise<{ canceled: boolean; path: string }>

    askMarkdownFileForSave: () => Promise<{ canceled: boolean; path: string }>

    newWindow: () => Promise<void>

    getCurrentWindow: () => Promise<{ id: number; title: string } | null>

    setTitle: (options: { title: string }) => Promise<void>
}

export type InvokeMainAPI = {
    [Channel in keyof InvokeRendererAPI]: (
        event: IpcMainInvokeEvent,
        ...params: Parameters<InvokeRendererAPI[Channel]>
    ) => ReturnType<InvokeRendererAPI[Channel]>
}

export type PreloadIpcRenderer = {
    invoke: IpcRenderer["invoke"]
    on: (...args: Parameters<IpcRenderer["on"]>) => void
    removeAllListeners: (...args: Parameters<IpcRenderer["removeAllListeners"]>) => void
}
