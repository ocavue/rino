import { app, BrowserWindow, dialog } from "electron"
import fs from "node:fs/promises"

import { logger } from "./logger"

export async function askMarkdownFileForOpen(): Promise<string | undefined> {
    const result = await dialog.showOpenDialog({
        properties: ["openFile"],
        filters: [{ name: "Markdown Files", extensions: ["md", "markdown"] }],
    })
    logger.info(`showOpenDialog result: ${result}`)
    return result.filePaths[0] // TODO: allow users to open many files
}

function getDialogBeforeDeleteOptions() {
    return {
        type: "warning",
        buttons: ["Save", "Don't save", "Cancel"],
        defaultId: 0,
        cancelId: 2,
        message: "Do you want to save the changes you made?",
        detail: "Your changes will be lost if you don't save them.",
    }
}

async function showDialogBeforeDelete(win: BrowserWindow | null): Promise<"save" | "delete" | "cancel"> {
    const options = getDialogBeforeDeleteOptions()
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

function showDialogBeforeDeleteSync(win: BrowserWindow | null): "save" | "delete" | "cancel" {
    const options = getDialogBeforeDeleteOptions()
    const result = win ? dialog.showMessageBoxSync(win, options) : dialog.showMessageBoxSync(options)
    switch (result) {
        case 0:
            return "save"
        case 1:
            return "delete"
        default:
            return "cancel"
    }
}

function getSaveMarkdownDialogOptions() {
    return {
        defaultPath: app.getPath("documents"),
        filters: [{ name: "Markdown Files", extensions: ["md", "markdown"] }],
    }
}

async function showSaveMarkdownDialog(win: BrowserWindow | null): Promise<{ filePath?: string; canceled: boolean }> {
    const options = getSaveMarkdownDialogOptions()
    const result = win ? await dialog.showSaveDialog(win, options) : await dialog.showSaveDialog(options)
    logger.info(`showSaveDialog result:`, result)
    return { filePath: result.filePath, canceled: result.canceled }
}

function showSaveMarkdownDialogSync(win: BrowserWindow | null): { filePath?: string; canceled: boolean } {
    const options = getSaveMarkdownDialogOptions()
    const result = win ? dialog.showSaveDialogSync(win, options) : dialog.showSaveDialogSync(options)
    logger.info(`showSaveDialog result:`, result)
    return { filePath: result, canceled: !result }
}

async function showSavePdfDialog(win: BrowserWindow | null) {
    const options = {
        defaultPath: app.getPath("documents"),
        filters: [{ name: "PDF File", extensions: ["pdf"] }],
    }
    const result = win ? await dialog.showSaveDialog(win, options) : await dialog.showSaveDialog(options)
    logger.info(`showSaveDialog result:`, result)
    return { filePath: result.filePath, canceled: result.canceled }
}

export async function askMarkdownFileForSave(win: BrowserWindow | null): Promise<{ filePath?: string; canceled?: boolean }> {
    return showSaveMarkdownDialog(win)
}

export function askMarkdownFileForSaveSync(win: BrowserWindow | null): { filePath?: string; canceled?: boolean } {
    return showSaveMarkdownDialogSync(win)
}

export async function askPdfFileForSave(win: BrowserWindow | null): Promise<{ filePath?: string; canceled?: boolean }> {
    return showSavePdfDialog(win)
}

export async function askMarkdownFileForClose(
    win: BrowserWindow | null,
): Promise<{ filePath?: string; canceled?: boolean; discarded?: boolean }> {
    const action = await showDialogBeforeDelete(win)
    if (action === "cancel") {
        return { canceled: true }
    } else if (action === "delete") {
        return { discarded: true }
    }
    return showSaveMarkdownDialog(win)
}

export function askBeforeDeleteSync(win: BrowserWindow | null): { result: "save" | "delete" | "cancel" } {
    return { result: showDialogBeforeDeleteSync(win) }
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
