import { execSync } from "child_process"

/**
 * Find the git repo root absolute path.
 */
export function findRoot() {
    return execSync("git rev-parse --show-toplevel", { encoding: "utf-8" }).trim()
}
