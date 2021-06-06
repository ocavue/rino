import { contextBridge } from "electron"

import { electronApi } from "./api"

contextBridge.exposeInMainWorld("electronContextBridgeApi", electronApi)
