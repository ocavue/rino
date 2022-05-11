import { expect, test } from "vitest"

import { basename, dedent, generateRandomId } from "."

test("generateRandomId", async () => {
    const id = generateRandomId()
    expect(id).toBeTruthy()
})

test("basename", () => {
    expect(basename("/Applications/Google Chrome.app/Contents/PkgInfo")).toEqual("PkgInfo")
    expect(basename("C:\\Documents and Settings\\juegos psps.txt")).toEqual("juegos psps.txt")
    expect(basename("a")).toEqual("a")
    expect(basename("hello/data.json.tar.gz")).toEqual("data.json.tar.gz")
    expect(basename("")).toEqual("")
})

test("dedent", () => {
    const input = [
        //
        "  2 spaces",
        "   3 spaces",
        "  2 spaces",
        "    4 spaces",
    ].join("\n")
    const expected = [
        //
        "2 spaces",
        " 3 spaces",
        "2 spaces",
        "  4 spaces",
    ].join("\n")

    expect(dedent(input)).toEqual(expected)
})
