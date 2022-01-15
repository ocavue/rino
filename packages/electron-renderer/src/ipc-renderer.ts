import type { IpcRenderer as ElectronIpcRenderer } from "electron"

import { IpcRendererAsyncSender, IpcRendererSyncSender } from "@rino.app/electron-types"

export const ipcRendererV2: Pick<ElectronIpcRenderer, "invoke" | "sendSync" | "on" | "removeListener" | "removeAllListeners"> = (
    window as any
)["ELECTRON_PRELOAD_IPC_RENDERER"]

export const ipcRendererAsyncSender: IpcRendererAsyncSender = new Proxy(
    {},
    {
        get: (_, type: string) => {
            return (option: any) => {
                return ipcRendererV2.invoke("RENDERER_TO_MAIN_ASYNC", type, option)
            }
        },
    },
) as any

export const ipcRendererSyncSender: IpcRendererSyncSender = new Proxy(
    {},
    {
        get: (_, type: string) => {
            return (option: any) => {
                return ipcRendererV2.sendSync("RENDERER_TO_MAIN_SYNC", type, option)
            }
        },
    },
) as any
