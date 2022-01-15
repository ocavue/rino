import { BrowserWindow } from "electron"

import type { IpcMainSender } from "@rino.app/electron-types"

export const ipcSender: IpcMainSender = new Proxy(
    {},
    {
        get: (_, type: keyof IpcMainSender) => {
            return async (window: BrowserWindow, option: any) => {
                return window.webContents.send("MAIN_TO_RENDEREER", type, option)
            }
        },
    },
) as any
