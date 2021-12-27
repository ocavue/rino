import type ElectronLog from "electron-log"

const log = (window as any)["ELECTRON_PRELOAD_ELECTRON_LOG"]
export const logger = (log.scope as ElectronLog.Scope)("renderer")
