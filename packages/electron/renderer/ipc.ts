import type { ElectronIpcApi } from "../types/api"

export const ipc: ElectronIpcApi = (window as any)["electronContextBridgeApi"]
