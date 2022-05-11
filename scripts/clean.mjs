#!/usr/bin/env node

import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const TO_CLEAN = [".next", "dist", "dist-types", ".cache", "coverage", "coverage_e2e", "out", "build"]
const TO_IGNORE = ["node_modules"]

async function clean(dir) {
    let cleanNumber = 0
    for await (const d of await fs.opendir(dir)) {
        const entry = path.join(dir, d.name)

        if (TO_IGNORE.includes(d.name)) {
            continue
        } else if (TO_CLEAN.includes(d.name)) {
            fs.rm(entry, { recursive: true, force: true })
            console.log(`deleted ${entry}`)
            cleanNumber += 1
        } else if (d.isDirectory()) {
            cleanNumber += await clean(entry)
        }
    }
    return cleanNumber
}

async function main() {
    const root = path.join(fileURLToPath(import.meta.url), "..", "..")
    console.log(`scanning ${root}`)
    const cleanNumber = await clean(root)
    console.log(`deleted ${cleanNumber} items in total`)
}

main()
