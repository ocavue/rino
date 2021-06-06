export interface ElectronIpcApi {
    openFile: () => Promise<{ path: string; content: string }>
}
