import type { InvokeApi, IpcInvoker, IpcRenderer, IpcSyncInvoker, SendApi, SyncInvokeApi } from "@rino.app/electron-types"

export const ipcRenderer: IpcRenderer<SendApi, InvokeApi, SyncInvokeApi> = (window as any)["ELECTRON_PRELOAD_IPC_RENDERER"]

export const ipcInvoker: IpcInvoker<InvokeApi> = new Proxy(
    {},
    {
        get: (_, channel: keyof InvokeApi) => {
            return async (...params: any) => {
                return await ipcRenderer.invoke(channel, ...params)
            }
        },
    },
) as IpcInvoker<InvokeApi>

export const ipcSyncInvoker: IpcSyncInvoker<SyncInvokeApi> = new Proxy(
    {},
    {
        get: (_, channel: keyof SyncInvokeApi) => {
            return (...params: any) => {
                return ipcRenderer.invokeSync(channel, ...params)
            }
        },
    },
) as IpcSyncInvoker<SyncInvokeApi>
