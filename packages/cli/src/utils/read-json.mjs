import JSON5 from "json5"
import fs from "node:fs/promises"

export async function readJson(filePath) {
    return JSON5.parse(await fs.readFile(filePath, { encoding: "utf-8" }))
}
