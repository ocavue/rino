import { isEqual } from "lodash-es"
import fs from "node:fs/promises"

import { readJson } from "./read-json.mjs"

export async function writeJson(filePath, json) {
    const oldJson = await readJson(filePath)

    if (isEqual(oldJson, json)) {
        return
    }

    return await fs.writeFile(filePath, JSON.stringify(json, null, 4) + "\n", { encoding: "utf-8" })
}
