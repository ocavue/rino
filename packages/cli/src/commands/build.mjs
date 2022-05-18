import { spawnSync } from "node:child_process"

import { findTurboBin } from "../utils/find-turbo-bin.mjs"

export function build(packages, { onlyDependencys = false } = {}) {
    const turboBin = findTurboBin()
    const args = ["run", "build", ...packages.map((name) => `--filter=${name}${onlyDependencys ? "^" : ""}...`)]
    console.log("$", turboBin + " " + args.join(" "))
    spawnSync(turboBin, args, { stdio: "inherit" })
}
