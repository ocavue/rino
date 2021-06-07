export interface ElectronIpcApi {
    openFile: () => Promise<{ canceled: boolean; path: string; content: string }>
    saveFile: (options: { path: string; content: string }) => Promise<{ canceled: boolean; path: string }>
    newWindow: () => Promise<void>
    getCurrentWindow: () => Promise<{ id: string; title: string } | null>
    setTitle: (options: { title: string }) => Promise<void>
}
