import { InlineLexer } from "src/editor/extensions/inline/inline-lexer"
import { InlineToken as Token } from "src/editor/extensions/inline/inline-types"

describe("InlineLexer", function () {
    const lexer = new InlineLexer()

    describe("code", function () {
        test("without space", function () {
            expect(lexer.scan("`code`", 1)).toStrictEqual([
                { text: "`", marks: ["mdKey"], attrs: { depth: 1, start: true } },
                { text: "code", marks: ["mdCodeText"], attrs: { depth: 1 } },
                { text: "`", marks: ["mdKey"], attrs: { depth: 1, end: true } },
            ])
        })
        test("with two trim spaces", function () {
            expect(lexer.scan("` code `", 1)).toStrictEqual([
                { text: "`", marks: ["mdKey"], attrs: { depth: 1, start: true } },
                { text: " ", marks: ["mdCodeSpace"], attrs: { depth: 1 } },
                { text: "code", marks: ["mdCodeText"], attrs: { depth: 1 } },
                { text: " ", marks: ["mdCodeSpace"], attrs: { depth: 1 } },
                { text: "`", marks: ["mdKey"], attrs: { depth: 1, end: true } },
            ])
        })
        test("with one trim space", function () {
            expect(lexer.scan("` code`", 1)).toStrictEqual([
                { text: "`", marks: ["mdKey"], attrs: { depth: 1, start: true } },
                { text: " ", marks: ["mdCodeSpace"], attrs: { depth: 1 } },
                { text: "code", marks: ["mdCodeText"], attrs: { depth: 1 } },
                { text: "`", marks: ["mdKey"], attrs: { depth: 1, end: true } },
            ])
            expect(lexer.scan("`code `", 1)).toStrictEqual([
                { text: "`", marks: ["mdKey"], attrs: { depth: 1, start: true } },
                { text: "code", marks: ["mdCodeText"], attrs: { depth: 1 } },
                { text: " ", marks: ["mdCodeSpace"], attrs: { depth: 1 } },
                { text: "`", marks: ["mdKey"], attrs: { depth: 1, end: true } },
            ])
        })
    })

    describe("emphasis", function () {
        test("without spaces", function () {
            expect(lexer.scan("*word*")).toStrictEqual([
                { text: "*", marks: ["mdKey"], attrs: { depth: 1, start: true } },
                { text: "word", marks: ["mdEm"], attrs: { depth: 2, start: true, end: true } },
                { text: "*", marks: ["mdKey"], attrs: { depth: 1, end: true } },
            ])
            expect(lexer.scan("**word**")).toStrictEqual([
                { text: "**", marks: ["mdKey"], attrs: { depth: 1, start: true } },
                { text: "word", marks: ["mdStrong"], attrs: { depth: 2, start: true, end: true } },
                { text: "**", marks: ["mdKey"], attrs: { depth: 1, end: true } },
            ])
            expect(lexer.scan("***word***")).toStrictEqual([
                { text: "**", marks: ["mdKey"], attrs: { depth: 1, start: true } },
                { text: "*", marks: ["mdKey"], attrs: { depth: 2, start: true } },
                {
                    text: "word",
                    marks: ["mdEm", "mdStrong"],
                    attrs: { depth: 3, start: true, end: true },
                },
                { text: "*", marks: ["mdKey"], attrs: { depth: 2, end: true } },
                { text: "**", marks: ["mdKey"], attrs: { depth: 1, end: true } },
            ])
        })
        test("with spaces", function () {
            expect(lexer.scan("* word *")).toStrictEqual([
                { text: "*", marks: ["mdKey"], attrs: { depth: 1, start: true } },
                { text: " word ", marks: ["mdEm"], attrs: { depth: 2, start: true, end: true } },
                { text: "*", marks: ["mdKey"], attrs: { depth: 1, end: true } },
            ])
            expect(lexer.scan("** word **")).toStrictEqual([
                { text: "**", marks: ["mdKey"], attrs: { depth: 1, start: true } },
                {
                    text: " word ",
                    marks: ["mdStrong"],
                    attrs: { depth: 2, start: true, end: true },
                },
                { text: "**", marks: ["mdKey"], attrs: { depth: 1, end: true } },
            ])
            expect(lexer.scan("*** word ***")).toStrictEqual([
                { text: "**", marks: ["mdKey"], attrs: { depth: 1, start: true } },
                { text: "*", marks: ["mdKey"], attrs: { depth: 2, start: true } },
                {
                    text: " word ",
                    marks: ["mdEm", "mdStrong"],
                    attrs: { depth: 3, start: true, end: true },
                },
                { text: "*", marks: ["mdKey"], attrs: { depth: 2, end: true } },
                { text: "**", marks: ["mdKey"], attrs: { depth: 1, end: true } },
            ])
        })
        test("mix", function () {
            expect(lexer.scan("*1234**1234**1234*")).toStrictEqual([
                { text: "*", marks: ["mdKey"], attrs: { depth: 1, start: true } },
                {
                    text: "1234",
                    marks: ["mdEm"],
                    attrs: { depth: 2, start: true, end: true },
                },
                { text: "**", marks: ["mdKey"], attrs: { depth: 2, start: true } },
                {
                    text: "1234",
                    marks: ["mdStrong", "mdEm"],
                    attrs: { depth: 3, start: true, end: true },
                },
                { text: "**", marks: ["mdKey"], attrs: { depth: 2, end: true } },
                {
                    text: "1234",
                    marks: ["mdEm"],
                    attrs: { depth: 2, start: true, end: true },
                },
                { text: "*", marks: ["mdKey"], attrs: { depth: 1, end: true } },
            ])
            expect(lexer.scan("**1234*1234*1234**")).toStrictEqual([
                { text: "**", marks: ["mdKey"], attrs: { depth: 1, start: true } },
                {
                    text: "1234",
                    marks: ["mdStrong"],
                    attrs: { depth: 2, start: true, end: true },
                },
                { text: "*", marks: ["mdKey"], attrs: { depth: 2, start: true } },
                {
                    text: "1234",
                    marks: ["mdEm", "mdStrong"],
                    attrs: { depth: 3, start: true, end: true },
                },
                { text: "*", marks: ["mdKey"], attrs: { depth: 2, end: true } },
                {
                    text: "1234",
                    marks: ["mdStrong"],
                    attrs: { depth: 2, start: true, end: true },
                },
                { text: "**", marks: ["mdKey"], attrs: { depth: 1, end: true } },
            ])
        })
    })
    describe("delete", function () {
        test("normal", function () {
            expect(lexer.scan("~~1234~~")).toStrictEqual([
                {
                    text: "~~",
                    marks: ["mdKey"],
                    attrs: { depth: 1, start: true },
                },
                {
                    text: "1234",
                    marks: ["mdDel"],
                    attrs: { depth: 2, start: true, end: true },
                },
                {
                    text: "~~",
                    marks: ["mdKey"],
                    attrs: { depth: 1, end: true },
                },
            ])
        })
        test("with inside tilde", function () {
            expect(lexer.scan("~~12~34~~")).toStrictEqual([
                {
                    text: "~~",
                    marks: ["mdKey"],
                    attrs: { depth: 1, start: true },
                },
                {
                    text: "12",
                    marks: ["mdDel"],
                    attrs: { depth: 2, start: true, end: true },
                },
                {
                    text: "~34",
                    marks: ["mdDel"],
                    attrs: { depth: 2, start: true, end: true },
                },
                {
                    text: "~~",
                    marks: ["mdKey"],
                    attrs: { depth: 1, end: true },
                },
            ])
        })
        test("with space", function () {
            expect(lexer.scan("~~ 1234 ~~")).toStrictEqual([
                {
                    text: "~~",
                    marks: ["mdKey"],
                    attrs: { depth: 1, start: true },
                },
                {
                    text: " 1234 ",
                    marks: ["mdDel"],
                    attrs: { depth: 2, start: true, end: true },
                },
                {
                    text: "~~",
                    marks: ["mdKey"],
                    attrs: { depth: 1, end: true },
                },
            ])
        })
    })
    describe("autolink", function () {
        test("normal", function () {
            expect(lexer.scan("<https://rino.app>")).toStrictEqual([
                { text: "<", marks: ["mdKey"], attrs: { depth: 1, start: true } },
                {
                    text: "https://rino.app",
                    marks: ["mdLinkText"],
                    attrs: { depth: 1, href: "https://rino.app" },
                },
                { text: ">", marks: ["mdKey"], attrs: { depth: 1, end: true } },
            ])
        })
        test("wrap by text", function () {
            expect(lexer.scan("text<https://rino.app>text")).toStrictEqual([
                { text: "text", marks: ["mdText"], attrs: { depth: 1, start: true, end: true } },
                { text: "<", marks: ["mdKey"], attrs: { depth: 1, start: true } },
                {
                    text: "https://rino.app",
                    marks: ["mdLinkText"],
                    attrs: { depth: 1, href: "https://rino.app" },
                },
                { text: ">", marks: ["mdKey"], attrs: { depth: 1, end: true } },
                { text: "text", marks: ["mdText"], attrs: { depth: 1, start: true, end: true } },
            ])
        })
    })
    describe("image", function () {
        test("Solid image", function () {
            const actualTokens: Token[] = lexer.scan("![Image](https://via.placeholder.com/42)")
            const expectedTokens: Token[] = [
                { text: "![", marks: ["mdKey"], attrs: { depth: 1, start: true } },
                { text: "Image", marks: ["mdImgText"], attrs: { depth: 1 } },
                { text: "](", marks: ["mdKey"], attrs: { depth: 1 } },
                {
                    text: "https://via.placeholder.com/42",
                    marks: ["mdImgUri"],
                    attrs: { depth: 1, href: "https://via.placeholder.com/42" },
                },
                { text: ")", marks: ["mdKey"], attrs: { depth: 1, end: true } },
            ]
            expect(actualTokens).toStrictEqual(expectedTokens)
        })

        test("Image with text around", function () {
            const actualTokens: Token[] = lexer.scan(
                "text![Image](https://via.placeholder.com/42)text",
            )
            const expectedTokens: Token[] = [
                { text: "text", marks: ["mdText"], attrs: { depth: 1, start: true, end: true } },
                { text: "![", marks: ["mdKey"], attrs: { depth: 1, start: true } },
                { text: "Image", marks: ["mdImgText"], attrs: { depth: 1 } },
                { text: "](", marks: ["mdKey"], attrs: { depth: 1 } },
                {
                    text: "https://via.placeholder.com/42",
                    marks: ["mdImgUri"],
                    attrs: { depth: 1, href: "https://via.placeholder.com/42" },
                },
                { text: ")", marks: ["mdKey"], attrs: { depth: 1, end: true } },
                { text: "text", marks: ["mdText"], attrs: { depth: 1, start: true, end: true } },
            ]
            expect(actualTokens).toStrictEqual(expectedTokens)
        })
    })
    describe("link", function () {
        test("normal", function () {
            const actualTokens: Token[] = lexer.scan("[GitHub](https://github.com)")
            const expectedTokens: Token[] = [
                { text: "[", marks: ["mdKey"], attrs: { depth: 1, start: true } },
                { text: "GitHub", marks: ["mdLinkText"], attrs: { depth: 1 } },
                { text: "](", marks: ["mdKey"], attrs: { depth: 1 } },
                {
                    text: "https://github.com",
                    marks: ["mdLinkUri"],
                    attrs: { depth: 1, href: "https://github.com" },
                },
                { text: ")", marks: ["mdKey"], attrs: { depth: 1, end: true } },
            ]
            expect(actualTokens).toStrictEqual(expectedTokens)
        })
    })
})
