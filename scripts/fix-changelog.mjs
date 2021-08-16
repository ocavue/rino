#!/usr/bin/env node

// Workaround for https://github.com/conventional-changelog/standard-version/issues/317

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const dirPath = path.dirname(fileURLToPath(import.meta.url))
const changelogPath = path.join(dirPath, "..", "CHANGELOG.md")

let content = fs.readFileSync(changelogPath, "utf-8")
const re = /^### (\[\d+\.\d+\.\d+\]\(http)/gm
content = content.replace(re, "## $1")
fs.writeFileSync(changelogPath, content)
