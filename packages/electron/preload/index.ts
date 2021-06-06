import { contextBridge } from "electron"

import { electronIpcApi } from "./api-renderer"

contextBridge.exposeInMainWorld("electronContextBridgeApi", electronIpcApi)
