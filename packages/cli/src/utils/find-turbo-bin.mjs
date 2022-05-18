import path from "node:path"

import { findRoot } from "./find-root.mjs"

export function findTurboBin() {
    return path.resolve(findRoot(), "node_modules", ".bin", "turbo")
}
