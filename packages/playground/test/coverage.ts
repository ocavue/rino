import fs from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import v8toIstanbul from "v8-to-istanbul"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const playgroundRoot = resolve(__dirname, "..")
const coverageDir = resolve(playgroundRoot, "coverage_e2e")
const playgroundDistAssetsDir = resolve(playgroundRoot, "dist", "assets")

export async function setupCoverageDir() {
    await fs.mkdir(coverageDir, { recursive: true })
    await fs.rm(coverageDir, { recursive: true })
    await fs.mkdir(coverageDir, { recursive: true })
    await fs.writeFile(resolve(coverageDir, ".gitignore"), "*", "utf-8")
}

export async function startJSCoverage() {
    await page.coverage.startJSCoverage({ reportAnonymousScripts: true, resetOnNavigation: false })
}

export async function collectJSCoverage() {
    const v8coverage = await page.coverage.stopJSCoverage()

    for (const entry of v8coverage) {
        if (!entry.url) continue

        const converter = v8toIstanbul(
            entry.url.replace("http://localhost:3001/assets", playgroundDistAssetsDir),
            0,
            { source: entry.source || "" },
            (path) => {
                const exclude = path.includes("/.pnpm/")
                return exclude
            },
        )
        await converter.load()
        converter.applyCoverage(entry.functions)
        const istanbulData = converter.toIstanbul()

        for (const key of Object.keys(istanbulData)) {
            if (!key.includes("editor")) {
                delete istanbulData[key]
            }
        }

        if (Object.keys(istanbulData).length) {
            const fileName = `coverage.${Math.random()}.${Date.now()}.json`
            const filePath = resolve(coverageDir, fileName)
            await fs.mkdir(coverageDir, { recursive: true })
            await fs.writeFile(filePath, JSON.stringify(istanbulData), "utf-8")
        }
    }
}
