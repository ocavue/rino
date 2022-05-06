import { describe, expect, test } from "vitest"

import { formatHref } from "../../../src/extensions/inline/format-href"

const cases: Array<[string, string]> = [
    ["/tmp/image.png", "file:///tmp/image.png"],
    ["/tmp/UPPERCASE.IPEG", "file:///tmp/UPPERCASE.IPEG"],
    ["/tmp/with whitespace.svg", "file:///tmp/with%20whitespace.svg"],
    ["file:///tmp/with%20whitespace.svg", "file:///tmp/with%20whitespace.svg"],
    ["https://example.com/hello.png", "https://example.com/hello.png"],
    ["sftp://192.168.1.1/hello.png", "sftp://192.168.1.1/hello.png"],
    [String.raw`C:\Documents\Newsletters\Summer2018.pdf`, "file:///C:/Documents/Newsletters/Summer2018.pdf"],
    [String.raw`\Program Files\Custom Utilities\StringFinder.exe`, "file:///Program%20Files/Custom%20Utilities/StringFinder.exe"],
]

describe("formatHref", () => {
    for (const [input, expected] of cases) {
        test(input, () => {
            expect(formatHref(input)).toEqual(expected)
        })
    }
})
