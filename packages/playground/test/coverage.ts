import fs from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import v8toIstanbul from "v8-to-istanbul"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const playgroundRoot = resolve(__dirname, "..")
const coverageDir = resolve(playgroundRoot, "coverage-e2e")
const playgroundDistAssetsDir = resolve(playgroundRoot, "dist", "assets")

function isCoverageEnable(): boolean {
    return !!process.env.VITEST_PLAYWRIGHT_ENABLE_COVERAGE
}

export async function setupCoverageDir(): Promise<void> {
    await fs.mkdir(coverageDir, { recursive: true })
    await fs.rm(coverageDir, { recursive: true })
    await fs.mkdir(coverageDir, { recursive: true })
    await fs.writeFile(resolve(coverageDir, ".gitignore"), "*", "utf-8")
}

export async function startJSCoverage(): Promise<void> {
    if (!isCoverageEnable()) {
        return
    }

    // Passing `{resetOnNavigation: false}` to `startJSCoverage` could cause
    // wrong coverage result.
    await page.coverage.startJSCoverage()
}

function excludePath(filePath: string): boolean {
    // exclude some virtual files generated by vite, like
    // "react/jsx-runtime" and "vite/modulepreload-polyfill"
    const isRealFile = /\.[cm]?(js|ts)x?$/.test(filePath)

    // exclude files in node_modules
    const isDep = filePath.includes("/node_modules/")

    return isDep || !isRealFile
}

export async function collectJSCoverage(): Promise<void> {
    if (!isCoverageEnable()) {
        return
    }

    const v8coverage = await page.coverage.stopJSCoverage()

    for (const entry of v8coverage) {
        if (!entry.url) continue

        try {
            const converter = v8toIstanbul(
                entry.url.replace("http://localhost:3001/assets", playgroundDistAssetsDir),
                0,
                { source: entry.source || "" },
                excludePath,
            )
            await converter.load()
            converter.applyCoverage(entry.functions)
            const istanbulData = converter.toIstanbul()

            if (Object.keys(istanbulData).length) {
                const fileName = `coverage.${Math.random()}.${Date.now()}.json`
                const filePath = resolve(coverageDir, fileName)
                await fs.mkdir(coverageDir, { recursive: true })
                await fs.writeFile(filePath, JSON.stringify(istanbulData), "utf-8")
            }
        } catch (error) {
            console.warn(`failed to collect coverage from ${entry.url}:`, error)
        }
    }
}
