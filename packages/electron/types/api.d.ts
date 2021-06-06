export interface ElectronIpcApi {
    openFile: () => Promise<{ path: string; content: string }>
    newWindow: () => Promise<void>
    getCurrentWindow: () => Promise<{ id: string; title: string } | null>
    setTitle: (options: { title: string }) => Promise<void>
}
