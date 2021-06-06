import { contextBridge } from "electron"

import { electronIpcApi } from "./api"

contextBridge.exposeInMainWorld("electronContextBridgeApi", electronIpcApi)
