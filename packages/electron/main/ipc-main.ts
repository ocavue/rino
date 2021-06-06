import { ipcMain } from "electron"

import { getMarkdownFileFromUser, openFile } from "./file"
import { createWindow } from "./window"

export function registerIpcHandlers() {
    ipcMain.handle("open_file", async (event) => {
        const path = await getMarkdownFileFromUser()
        const content = await openFile(path)
        return { path, content }
    })

    ipcMain.handle("new_window", async (event) => {
        await createWindow()
    })
}
