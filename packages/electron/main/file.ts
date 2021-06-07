import { app, dialog } from "electron"
import fs from "fs/promises"

import { logger } from "./logger"

export async function askMarkdownFileForOpen(): Promise<string> {
    const result = await dialog.showOpenDialog({
        properties: ["openFile"],
        filters: [{ name: "Markdown Files", extensions: ["md", "markdown"] }],
    })
    logger.info(`showOpenDialog result: ${result}`)
    return result.filePaths[0] // TODO: allow users to open many files
}

export async function askMarkdownFileForSave(): Promise<string | undefined> {
    const result = await dialog.showSaveDialog({
        title: "Save Markdown",
        defaultPath: app.getPath("documents"),
        filters: [{ name: "Markdown Files", extensions: ["md", "markdown"] }],
    })
    logger.info(`showSaveDialog result: ${result}`)
    return result.filePath // If the dialog is canceled, this will be be undefined
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
