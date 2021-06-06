export interface ElectronIpcApi {
    openFile: () => Promise<{ path: string; content: string }>
    newWindow: () => Promise<void>
}
