#!/usr/bin/env node

async function main() {
    await import("../esbuild.mjs")
    const { runCli } = await import("../dist/cli/cli.js")
    runCli()
}

main()
