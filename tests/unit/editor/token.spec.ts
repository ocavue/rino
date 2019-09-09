import { mergeTokens, pushClass } from "../../../src/editor/token"

function assertDeepEqual(a: any, b: any) {
    expect(a).toStrictEqual(b)
}

describe("Token", function() {
    it("cleanTokens", function() {
        assertDeepEqual(mergeTokens([{ classes: ["A"], length: 0 }]), [])
        assertDeepEqual(
            mergeTokens([{ classes: ["A"], length: 0 }, { classes: ["A"], length: 0 }]),
            [],
        )
        assertDeepEqual(
            mergeTokens([{ classes: ["A"], length: 1 }, { classes: ["A"], length: 0 }]),
            [{ classes: ["A"], length: 1 }],
        )
        assertDeepEqual(
            mergeTokens([{ classes: ["A"], length: 1 }, { classes: ["A"], length: 1 }]),
            [{ classes: ["A"], length: 2 }],
        )
        assertDeepEqual(
            mergeTokens([
                { classes: ["A"], length: 1 },
                { classes: ["A"], length: 1 },
                { classes: ["A"], length: 1 },
                { classes: ["A"], length: 1 },
                { classes: ["A"], length: 1 },
            ]),
            [{ classes: ["A"], length: 5 }],
        )
        assertDeepEqual(
            mergeTokens([
                { classes: ["A"], length: 1 },
                { classes: ["B"], length: 1 },
                { classes: ["C"], length: 1 },
            ]),
            [
                { classes: ["A"], length: 1 },
                { classes: ["B"], length: 1 },
                { classes: ["C"], length: 1 },
            ],
        )
    })
    it("pushClass", function() {
        assertDeepEqual(pushClass({ classes: ["B"], length: 0 }, "A"), {
            classes: ["A", "B"],
            length: 0,
        })
        assertDeepEqual(pushClass({ classes: ["B"], length: 0 }, "B"), {
            classes: ["B"],
            length: 0,
        })
        assertDeepEqual(pushClass({ classes: ["decoration_mark"], length: 0 }, "B"), {
            classes: ["decoration_mark"],
            length: 0,
        })
    })
})
