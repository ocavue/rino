import { ipcMain } from "electron"

import { getMarkdownFileFromUser, openFile } from "./file"

export function registerIpcHandlers() {
    ipcMain.handle("open-file", async (event) => {
        const path = await getMarkdownFileFromUser()
        const content = await openFile(path)
        return { path, content }
    })
}
