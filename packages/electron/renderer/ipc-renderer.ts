import type { ElectronApi } from "../types/api"

export function getApi(): ElectronApi {
    return (window as any)["electronContextBridgeApi"]
}
