import { spawnSync } from "node:child_process"
import path from "node:path"

import { findRoot } from "../utils/find-root.mjs"
import { findTurboBin } from "../utils/find-turbo-bin.mjs"

export function test(testPath, extraArgs) {
    const root = findRoot()
    const absTestPath = path.resolve(process.cwd(), testPath)
    const packageName = path.relative(root, absTestPath).split(path.sep)[1]
    const turboBin = findTurboBin()
    const env = {
        // Force turbo to output colors
        FORCE_COLOR: 1,
        ...process.env,
    }

    if (packageName) {
        const args = ["run", "test:vitest", `--filter=${packageName}`, "--", absTestPath, ...extraArgs]
        console.log("$", turboBin + " " + args.join(" "))
        spawnSync(turboBin, args, { stdio: "inherit", cwd: root, env })
    } else if (root == absTestPath) {
        const args = ["run", "test:vitest", ...extraArgs]
        console.log("$", turboBin + " " + args.join(" "))
        spawnSync(turboBin, args, { stdio: "inherit", cwd: root, env })
    } else {
        throw new Error(`Test path ${absTestPath} must be inside a package`)
    }
}
