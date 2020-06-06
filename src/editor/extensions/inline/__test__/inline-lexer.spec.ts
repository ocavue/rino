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
        test("with two side spaces", function () {
            expect(lexer.scan("` code `", 1)).toStrictEqual([
                { text: "`", marks: ["mdKey"], attrs: { depth: 1, start: true } },
                { text: " ", marks: ["mdCodeSpace"], attrs: { depth: 1 } },
                { text: "code", marks: ["mdCodeText"], attrs: { depth: 1 } },
                { text: " ", marks: ["mdCodeSpace"], attrs: { depth: 1 } },
                { text: "`", marks: ["mdKey"], attrs: { depth: 1, end: true } },
            ])
        })
        test("with one side space", function () {
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
        test.only("normal", function () {
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
        test.only("with inside tilde", function () {
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
        test.only("with space", function () {
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
            assertTokenEqual(lexer.scan("<https://github.com>"), [
                { length: 1, classes: ["decoration_mark"] },
                {
                    length: 18,
                    classes: ["decoration_link_url"],
                    nodeName: "a",
                    nodeAttrs: {
                        href: "https://github.com",
                        onClick: 'window.open("https://github.com")',
                    },
                },
                { length: 1, classes: ["decoration_mark"] },
            ])
        })
        test("wrap by text", function () {
            assertTokenEqual(lexer.scan("text<https://github.com>text"), [
                { length: 4, classes: [] },
                { length: 1, classes: ["decoration_mark"] },
                {
                    length: 18,
                    classes: ["decoration_link_url"],
                    nodeName: "a",
                    nodeAttrs: {
                        href: "https://github.com",
                        onClick: 'window.open("https://github.com")',
                    },
                },
                { length: 1, classes: ["decoration_mark"] },
                { length: 4, classes: [] },
            ])
        })
    })
    describe("image", function () {
        // Mocha environment has not global variable "Image", so I have to mock one.
        const ImageMock = class {
            public src: string
            public constructor() {
                this.src = ""
            }
        } as typeof HTMLImageElement

        global.Image = ImageMock

        test("Solid image", function () {
            const image = new ImageMock()
            image.src = "https://via.placeholder.com/42"

            const actualTokens: Token[] = lexer.scan("![Image](https://via.placeholder.com/42)")
            const expectedTokens: Token[] = [
                { length: 2, classes: ["decoration_mark"] },
                { length: 5, classes: ["decoration_image_text"] },
                { length: 2, classes: ["decoration_mark"] },
                { length: 30, classes: ["decoration_image_url"] },
                {
                    isWidget: true,
                    length: 0,
                    classes: [],
                    key: "https://via.placeholder.com/42",
                    dom: image,
                },
                { length: 1, classes: ["decoration_mark"] },
            ]
            assertTokenEqual(actualTokens, expectedTokens)
        })

        test("Image with text around", function () {
            const image = new ImageMock()
            image.src = "https://via.placeholder.com/42"

            const actualTokens: Token[] = lexer.scan(
                "text![Image](https://via.placeholder.com/42)text",
            )
            const expectedTokens: Token[] = [
                { length: 4, classes: [] },
                { length: 2, classes: ["decoration_mark"] },
                { length: 5, classes: ["decoration_image_text"] },
                { length: 2, classes: ["decoration_mark"] },
                { length: 30, classes: ["decoration_image_url"] },
                {
                    isWidget: true,
                    length: 0,
                    classes: [],
                    key: "https://via.placeholder.com/42",
                    dom: image,
                },
                { length: 1, classes: ["decoration_mark"] },
                { length: 4, classes: [] },
            ]
            assertTokenEqual(actualTokens, expectedTokens)
        })
    })
    describe("link", function () {
        test("normal", function () {
            assertTokenEqual(lexer.scan("[GitHub](https://github.com)"), [
                { length: 1, classes: ["decoration_mark"] },
                { length: 6, classes: ["decoration_link_text"] },
                { length: 2, classes: ["decoration_mark"] },
                {
                    length: 18,
                    classes: ["decoration_link_url"],
                    nodeName: "a",
                    nodeAttrs: {
                        href: "https://github.com",
                        onClick: 'window.open("https://github.com")',
                    },
                },
                { length: 1, classes: ["decoration_mark"] },
            ])
        })
    })
})
