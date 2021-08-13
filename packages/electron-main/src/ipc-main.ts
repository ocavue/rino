import { BrowserWindow, ipcMain as electronIpcMain } from "electron"

import type { InvokeApi, IpcMain, IpcSender, SendApi } from "@rino.app/electron-types"

export const ipcMain: IpcMain<SendApi, InvokeApi> = {
    send: (window: BrowserWindow, channel, ...args): void => {
        window.webContents.send(channel, ...args)
    },

    handle: (channel, listener: any): void => {
        electronIpcMain.handle(channel, listener)
    },

    removeHandler: (channel): void => {
        electronIpcMain.removeHandler(channel)
    },
}

export const ipcSender: IpcSender<SendApi> = new Proxy(
    {},
    {
        get: (_, channel: keyof SendApi) => {
            return async (window: BrowserWindow, ...params: any) => {
                return ipcMain.send(window, channel, ...params)
            }
        },
    },
) as IpcSender<SendApi>
