#!/usr/bin/env node

async function main() {
    await import("../esbuild.mjs")
    await new Promise((resolve) => setTimeout(resolve, 100))
    const { runCli } = await import("../dist/cli/cli.js")
    runCli()
}

main()
