import { tests as commonMarkSpecTestCases } from "commonmark-spec"

import { parseInline } from ".."

describe("ParserInline", () => {
    test("smoke test", () => {
        parseInline("text **strong**")
    })

    test("strong", () => {
        let tokens = parseInline("text **strong**")
        expect(tokens).toHaveLength(5)
        expect(tokens[0].type).toEqual("text")
        expect(tokens[1].type).toEqual("strong_open")
        expect(tokens[2].type).toEqual("text")
        expect(tokens[3].type).toEqual("strong_close")
        expect(tokens[4].type).toEqual("text")
    })

    test("nesting", () => {
        let receivedTokens = parseInline("**strong*italic*strong**")
        let receivedShapes = receivedTokens.map((token) => ({
            level: token.level,
            nesting: token.nesting,
            type: token.type,
        }))
        let expectedShapes = [
            { level: 0, nesting: 0, type: "text" },
            { level: 0, nesting: 1, type: "strong_open" },
            { level: 1, nesting: 0, type: "text" },
            { level: 1, nesting: 1, type: "em_open" },
            { level: 2, nesting: 0, type: "text" },
            { level: 1, nesting: -1, type: "em_close" },
            { level: 1, nesting: 0, type: "text" },
            { level: 0, nesting: -1, type: "strong_close" },
            { level: 0, nesting: 0, type: "text" },
        ]
        expect(receivedShapes).toEqual(expectedShapes)
    })

    test("aaaaaaaaaaaaa", () => {
        let receivedTokens = parseInline("**strong _italic_ strong**")
        let receivedShapes = receivedTokens.map((token) => ({
            level: token.level,
            nesting: token.nesting,
            type: token.type,
        }))
        let expectedShapes = [
            { level: 0, nesting: 0, type: "text" },
            { level: 0, nesting: 1, type: "strong_open" },
            { level: 1, nesting: 0, type: "text" },
            { level: 1, nesting: 1, type: "em_open" },
            { level: 2, nesting: 0, type: "text" },
            { level: 1, nesting: -1, type: "em_close" },
            { level: 1, nesting: 0, type: "text" },
            { level: 0, nesting: -1, type: "strong_close" },
            { level: 0, nesting: 0, type: "text" },
        ]
        expect(receivedShapes).toEqual(expectedShapes)
    })
})

describe("CommonMark inline", () => {
    // All inline test case are between
    // https://spec.commonmark.org/0.29/#example-297
    // and
    // https://spec.commonmark.org/0.29/#example-649
    //
    let inlineTestCases = commonMarkSpecTestCases.filter((i) => 297 <= i.number && i.number <= 649)

    for (let testCase of inlineTestCases) {
        test(`https://spec.commonmark.org/0.29/#example-${testCase.number}`, () => {
            parseInline(testCase.markdown)
        })
    }
})
