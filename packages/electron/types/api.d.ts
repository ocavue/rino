export interface ElectronApi {
    openFile: () => Promise<{ path: string; content: string } | null>
}
