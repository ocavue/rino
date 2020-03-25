#!/usr/bin/env node

/**
 * This is a very simple script to read a JSON file and output an element from this JSON file to stdout.
 * I wrote this script because I don't want to install `jq` in my CI environment.
 */

const path = require("path")
const jsonFile = process.argv[2]
const objPath = process.argv[3]
const obj = require(path.resolve(jsonFile))

function deepFind(obj, path) {
    const paths = path.split(".").filter(path => path)
    let current = obj

    for (const path of paths) {
        if (current[path] == undefined) {
            return undefined
        } else {
            current = current[path]
        }
    }
    return current
}

console.log(deepFind(obj, objPath))
