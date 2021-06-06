import { dialog } from "electron"
import fs from "fs/promises"

import { logger } from "./logger"

export async function getMarkdownFileFromUser(): Promise<string> {
    const files = await dialog.showOpenDialog({
        properties: ["openFile"],
        filters: [{ name: "Markdown Files", extensions: ["md", "markdown"] }],
    })
    const filePaths = files.filePaths
    logger.info(`user selected ${filePaths.length} file(s): ${filePaths}`)
    return filePaths[0] // TODO: allow users to open many files
}

export async function openFile(filePath: string): Promise<string> {
    logger.info(`reading file ${filePath}`)
    const buffer = await fs.readFile(filePath) // TODO: what if the file is under other encodings?
    const content = buffer.toString()
    logger.info(`read the content of length ${content.length} in ${filePath}`)
    return content
}
