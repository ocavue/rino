import type { InvokeApi, IpcInvoker, IpcRenderer, SendApi } from "@rino.app/electron-types"

export const ipcRenderer: IpcRenderer<SendApi, InvokeApi> = (window as any)["ELECTRON_PRELOAD_IPC_RENDERER"]

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
