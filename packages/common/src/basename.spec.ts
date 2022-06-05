import { expect, test } from "vitest"

import { basename } from "./basename"

test("basename", () => {
    expect(basename("/Applications/Google Chrome.app/Contents/PkgInfo")).toEqual("PkgInfo")
    expect(basename("C:\\Documents and Settings\\juegos psps.txt")).toEqual("juegos psps.txt")
    expect(basename("a")).toEqual("a")
    expect(basename("hello/data.json.tar.gz")).toEqual("data.json.tar.gz")
    expect(basename("")).toEqual("")
})
