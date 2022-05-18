import { spawnSync } from "node:child_process"

import { findTurboBin } from "../utils/find-turbo-bin.mjs"
import { build } from "./build.mjs"

export function dev(packages) {
    build(packages, { onlyDependencys: true })
    const turboBin = findTurboBin()
    const args = ["run", "dev", ...packages.map((name) => `--filter=${name}...`), "--parallel"]
    console.log("$", turboBin + " " + args.join(" "))
    spawnSync(turboBin, args, { stdio: "inherit" })
}
