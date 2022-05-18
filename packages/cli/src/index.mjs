import { program } from "commander"

import { build } from "./commands/build.mjs"
import { clean } from "./commands/clean.mjs"
import { dev } from "./commands/dev.mjs"
import { generate } from "./commands/generate.mjs"
import { test } from "./commands/test.mjs"

export function run() {
    program
        .command("clean")
        .description("Clean all temporary files")
        .action(() => {
            clean()
        })

    program
        .command("gen")
        .description("Generate files")
        .action(() => {
            generate()
        })

    program
        .command("dev")
        .description("Run dev commands for selected packages")
        .argument("<packages...>", "Package names to run")
        .action((packages) => {
            dev(packages)
        })

    program
        .command("build")
        .description("Run build commands for selected packages")
        .argument("<packages...>", "Package names to run")
        .action((packages) => {
            build(packages)
        })

    program
        .command("test")
        .description("Test")
        .argument("[path]", "File path or directory path", process.cwd())
        .action((path) => {
            test(path)
        })

    program.parse()
}
