import fs from "fs/promises"
import vite from "vite"

import { createDisableLogPlugin } from "./disable-log-plugin.mjs"
import plugin from "./plugin.mjs"
import { createServer } from "./server.mjs"

console.log("Welcome to rvite! v7")

const command = process.argv[2]

export async function runCli() {
    if (command === "dev") {
        const { app } = await createServer()
        app.listen(3000, () => {
            console.log("  > Local: http://localhost:3000/")
        })
    } else if (command === "build") {
        await buildServer()
        await buildStatic()
        await clean()
    } else if (command === "preview") {
        const previewServer = await vite.preview({})
        previewServer.printUrls()
    } else {
        console.error("unkwonn command:", command)
    }
}

async function buildStatic() {
    await vite.build({
        build: {
            outDir: "dist/",
        },
        plugins: [plugin()],
    })
}

async function buildServer() {
    await vite.build({
        build: {
            ssr: "node_modules/rvite/entry-server.jsx",
            outDir: ".rvite-tmp/dist/",
        },
        plugins: [createDisableLogPlugin()],
    })
}

async function clean() {
    await fs.rm(".rvite-tmp/", { recursive: true, force: true })
}
