import type { IpcMainInvokeEvent } from "electron"

export type InvokeRendererAPI = {
    openFile: () => Promise<{ canceled: boolean; path: string; content: string }>

    saveFile: (options: { path: string; content: string }) => Promise<{ canceled: boolean; path: string }>

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