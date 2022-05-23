import { spawnSync } from "node:child_process"
import path from "node:path"

import { findRoot } from "../utils/find-root.mjs"
import { findTurboBin } from "../utils/find-turbo-bin.mjs"

export function test(testPath, extraArgs) {
    const root = findRoot()
    const absTestPath = path.resolve(process.cwd(), testPath)
    const packageName = path.relative(root, absTestPath).split(path.sep)[1]
    const turboBin = findTurboBin()

    if (packageName) {
        const args = ["run", "test:vitest", `--filter=${packageName}`, "--", absTestPath]
        if (extraArgs.length) {
            args.push("--", ...extraArgs)
        }
        console.log("$", turboBin + " " + args.join(" "))
        spawnSync(turboBin, args, { stdio: "inherit", cwd: root })
    } else if (root == absTestPath) {
        const args = ["run", "test:vitest"]
        if (extraArgs.length) {
            args.push("--", ...extraArgs)
        }
        console.log("$", turboBin + " " + args.join(" "))
        spawnSync(turboBin, args, { stdio: "inherit", cwd: root })
    } else {
        throw new Error(`Test path ${absTestPath} must be inside a package`)
    }
}
