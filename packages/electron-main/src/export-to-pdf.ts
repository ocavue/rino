import { BrowserWindow, shell } from "electron"
import fs from "node:fs/promises"

import { askPdfFileForSave } from "./file"
import { ipcSender } from "./ipc-main"

export async function exportToPDF(win: BrowserWindow) {
    ipcSender.beforeExportToPdf(win)
    // wait for the renderer to switch to wysiwyg mode and reset selection
    await new Promise((resolve) => setTimeout(resolve, 400))
    const { filePath, canceled } = await askPdfFileForSave(win)
    const buffer = await win.webContents.printToPDF({ printBackground: true })
    if (canceled || !filePath) return
    await fs.writeFile(filePath, buffer)
    shell.showItemInFolder(filePath)
}
