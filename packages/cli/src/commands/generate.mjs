import glob from "fast-glob"
import path from "node:path"

import { findRoot } from "../utils/find-root.mjs"
import { readJson } from "../utils/read-json.mjs"
import { writeJson } from "../utils/write-json.mjs"

async function generateTsconfig() {
    const root = findRoot()
    const tsconfigPaths = glob.sync("packages/*/*/tsconfig.json", { cwd: root, ignore: "**/node_modules/**" })
    tsconfigPaths.sort()

    const rootTsconfigPath = path.join(root, "tsconfig.json")
    const rootTsconfigJson = { include: [], files: [], references: [] }

    rootTsconfigJson.references = tsconfigPaths.map((tsconfigPath) => ({
        path: tsconfigPath,
    }))

    await writeJson(rootTsconfigPath, rootTsconfigJson)

    for (let tsconfigPath of glob.sync("packages/*/src/tsconfig.json", { cwd: root, ignore: "**/node_modules/**" })) {
        const absPath = path.join(root, tsconfigPath)
        const oldJson = await readJson(absPath)
        const newJson = {
            ...oldJson,
            compilerOptions: {
                composite: true,
                outDir: "../dist-types/",
                ...oldJson.compilerOptions,
            },
        }
        await writeJson(absPath, newJson)
    }

    for (let tsconfigPath of glob.sync("packages/*/test/tsconfig.json", { cwd: root, ignore: "**/node_modules/**" })) {
        const absPath = path.join(root, tsconfigPath)
        const oldJson = await readJson(absPath)
        const newJson = {
            ...oldJson,
            compilerOptions: {
                composite: true,
                outDir: "./.cache/typescript/",
                ...oldJson.compilerOptions,
            },
        }
        await writeJson(absPath, newJson)
    }
}

export function generate() {
    generateTsconfig()
}
