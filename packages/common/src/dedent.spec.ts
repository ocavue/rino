import { expect, test } from "vitest"

import { dedent } from "./dedent"

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
