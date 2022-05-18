import glob from "fast-glob"
import fs from "node:fs/promises"

import { findRoot } from "../utils/find-root.mjs"

const TO_CLEAN = [".next", "dist", "dist-types", ".cache", "coverage", "coverage-e2e", "out", "build", ".turbo"]
const TO_IGNORE = ["node_modules"]

async function cleanAll() {
    const root = findRoot()

    const dirs = [
        ...glob.sync(
            TO_CLEAN.map((dir) => `**/${dir}/`),
            {
                ignore: TO_IGNORE.map((dir) => `**/${dir}/**`),
                cwd: root,
                onlyDirectories: true,
                absolute: true,
            },
        ),
        ...glob.sync("node_modules/.cache", {
            cwd: root,
            onlyDirectories: true,
            absolute: true,
        }),
    ]

    for (const dir of dirs) {
        await fs.rm(dir, { recursive: true, force: true })
        console.log(`deleted ${dir}`)
    }

    console.log(`deleted ${dirs.length} items in total`)
}

export { cleanAll as clean }
