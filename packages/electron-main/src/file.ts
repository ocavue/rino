import { app, BrowserWindow, dialog } from "electron"
import fs from "node:fs/promises"

import { logger } from "./logger"

let a = 0

a = ""

console.log(a)

export async function askMarkdownFileForOpen(): Promise<string | undefined> {
    const result = await dialog.showOpenDialog({
        properties: ["openFile"],
        filters: [{ name: "Markdown Files", extensions: ["md", "markdown"] }],
    })
    logger.info(`showOpenDialog result: ${result}`)
    return result.filePaths[0] // TODO: allow users to open many files
}

async function showDialogBeforeDelete(win: BrowserWindow | null): Promise<"save" | "delete" | "cancel"> {
    const options = {
        type: "warning",
        buttons: ["Save", "Don't save", "Cancel"],
        defaultId: 0,
        cancelId: 2,
        message: "Do you want to save the changes you made?",
        detail: "Your changes will be lost if you don't save them.",
    }
    const result = win ? await dialog.showMessageBox(win, options) : await dialog.showMessageBox(options)
    switch (result.response) {
        case 0:
            return "save"
        case 1:
            return "delete"
        default:
            return "cancel"
    }
}

async function showSaveMarkdownDialog(win: BrowserWindow | null) {
    const options = {
        defaultPath: app.getPath("documents"),
        filters: [{ name: "Markdown Files", extensions: ["md", "markdown"] }],
    }
    const result = win ? await dialog.showSaveDialog(win, options) : await dialog.showSaveDialog(options)
    logger.info(`showSaveDialog result:`, result)
    return { filePath: result.filePath, canceled: result.canceled }
}

export async function askMarkdownFileForSave(win: BrowserWindow | null): Promise<{ filePath?: string; canceled?: boolean }> {
    return showSaveMarkdownDialog(win)
}

export async function askMarkdownFileForClose(
    win: BrowserWindow | null,
): Promise<{ filePath?: string; canceled?: boolean; deleted?: boolean }> {
    const action = await showDialogBeforeDelete(win)
    if (action === "cancel") {
        return { canceled: true }
    } else if (action === "delete") {
        return { deleted: true }
    }
    return showSaveMarkdownDialog(win)
}

export async function openFile(filePath: string): Promise<string> {
    logger.info(`reading file ${filePath}`)
    const buffer = await fs.readFile(filePath) // TODO: what if the file is under other encodings?
    const content = buffer.toString()
    logger.info(`read file ${filePath} with ${content.length} characters`)
    return content
}

export async function saveFile(filePath: string, content: string): Promise<void> {
    logger.info(`saving file ${filePath} with ${content.length} characters`)
    await fs.writeFile(filePath, content, { encoding: "utf-8" })
    logger.info(`saved file ${filePath}`)
}
