#!/usr/bin/env zx

import "zx"

import * as fs from "fs/promises"
import { join } from "path"

type Workspace = { name: string; location: string }

async function main() {
    const packageJsonPath = join(__dirname, "..", "package.json")
    const packageJson: Record<string, any> = JSON.parse(await fs.readFile(packageJsonPath, { encoding: "utf-8" }))

    const workspaces: Array<Workspace> = (await $`yarn workspaces list --json`).stdout
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line)
        .map((line) => JSON.parse(line))

    for (const workspace of workspaces) {
        if (workspace.name === "rino") {
            continue
        }
        const shortName = workspace.name.split("/")[1]
        packageJson.scripts[shortName] = "yarn workspace " + workspace.name
    }

    for (const workspace of workspaces) {
        if (workspace.name === "rino") {
            continue
        }
        const shortName = workspace.name.split("/")[1]
        packageJson.scripts["run-all:" + shortName] = "yarn run run-all -p " + workspace.name + " -c"
    }

    await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 4))
}

main()
