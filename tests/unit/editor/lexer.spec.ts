import { InlineLexer } from "src/editor/extensions/decoration/lexer"
import { Token } from "src/editor/extensions/decoration/token"

describe("InlineLexer", function () {
    const lexer = new InlineLexer()

    function assertTokenEqual(a: Token[], b: Token[]) {
        a.forEach((token) => token.classes.sort())
        b.forEach((token) => token.classes.sort())
        return expect(a).toEqual(b)
    }

    describe("code", function () {
        it("without space", function () {
            assertTokenEqual(lexer.scan("`code`"), [
                { length: 1, classes: ["decoration_mark"] },
                { length: 4, classes: ["decoration_code_text"] },
                { length: 1, classes: ["decoration_mark"] },
            ])
        })
        it("with two side spaces", function () {
            assertTokenEqual(lexer.scan("` code `"), [
                { length: 1, classes: ["decoration_mark"] },
                { length: 1, classes: ["decoration_code_space"] },
                { length: 4, classes: ["decoration_code_text"] },
                { length: 1, classes: ["decoration_code_space"] },
                { length: 1, classes: ["decoration_mark"] },
            ])
        })
        it("with one side space", function () {
            assertTokenEqual(lexer.scan("` code`"), [
                { length: 1, classes: ["decoration_mark"] },
                { length: 1, classes: ["decoration_code_space"] },
                { length: 4, classes: ["decoration_code_text"] },
                { length: 1, classes: ["decoration_mark"] },
            ])
            assertTokenEqual(lexer.scan("`code `"), [
                { length: 1, classes: ["decoration_mark"] },
                { length: 4, classes: ["decoration_code_text"] },
                { length: 1, classes: ["decoration_code_space"] },
                { length: 1, classes: ["decoration_mark"] },
            ])
        })
    })

    describe("emphasis", function () {
        it("without spaces", function () {
            assertTokenEqual(lexer.scan("*word*"), [
                { length: 1, classes: ["decoration_mark"] },
                { length: 4, classes: ["decoration_emphasis_single_text"] },
                { length: 1, classes: ["decoration_mark"] },
            ])
            assertTokenEqual(lexer.scan("**word**"), [
                { length: 2, classes: ["decoration_mark"] },
                { length: 4, classes: ["decoration_emphasis_double_text"] },
                { length: 2, classes: ["decoration_mark"] },
            ])
            assertTokenEqual(lexer.scan("***word***"), [
                { length: 3, classes: ["decoration_mark"] },
                {
                    length: 4,
                    classes: ["decoration_emphasis_single_text", "decoration_emphasis_double_text"],
                },
                { length: 3, classes: ["decoration_mark"] },
            ])
        })
        it("with spaces", function () {
            assertTokenEqual(lexer.scan("* word *"), [
                { length: 1, classes: ["decoration_mark"] },
                { length: 6, classes: ["decoration_emphasis_single_text"] },
                { length: 1, classes: ["decoration_mark"] },
            ])
            assertTokenEqual(lexer.scan("** word **"), [
                { length: 2, classes: ["decoration_mark"] },
                { length: 6, classes: ["decoration_emphasis_double_text"] },
                { length: 2, classes: ["decoration_mark"] },
            ])
            assertTokenEqual(lexer.scan("*** word ***"), [
                { length: 3, classes: ["decoration_mark"] },
                {
                    length: 6,
                    classes: ["decoration_emphasis_single_text", "decoration_emphasis_double_text"],
                },
                { length: 3, classes: ["decoration_mark"] },
            ])
        })
        it("mix", function () {
            assertTokenEqual(lexer.scan("*1234**1234**1234*"), [
                { length: 1, classes: ["decoration_mark"] },
                { length: 4, classes: ["decoration_emphasis_single_text"] },
                { length: 2, classes: ["decoration_mark"] },
                {
                    length: 4,
                    classes: ["decoration_emphasis_single_text", "decoration_emphasis_double_text"],
                },
                { length: 2, classes: ["decoration_mark"] },
                { length: 4, classes: ["decoration_emphasis_single_text"] },
                { length: 1, classes: ["decoration_mark"] },
            ])
            assertTokenEqual(lexer.scan("**1234*1234*1234**"), [
                { length: 2, classes: ["decoration_mark"] },
                { length: 4, classes: ["decoration_emphasis_double_text"] },
                { length: 1, classes: ["decoration_mark"] },
                {
                    length: 4,
                    classes: ["decoration_emphasis_single_text", "decoration_emphasis_double_text"],
                },
                { length: 1, classes: ["decoration_mark"] },
                { length: 4, classes: ["decoration_emphasis_double_text"] },
                { length: 2, classes: ["decoration_mark"] },
            ])
        })
    })
    describe("delete", function () {
        it("normal", function () {
            assertTokenEqual(lexer.scan("~~1234~~"), [
                { length: 2, classes: ["decoration_mark"] },
                { length: 4, classes: ["decoration_delete"] },
                { length: 2, classes: ["decoration_mark"] },
            ])
        })
        it("with inside tilde", function () {
            assertTokenEqual(lexer.scan("~~12~34~~"), [
                { length: 2, classes: ["decoration_mark"] },
                { length: 5, classes: ["decoration_delete"] },
                { length: 2, classes: ["decoration_mark"] },
            ])
        })
        it("with space", function () {
            assertTokenEqual(lexer.scan("~~ 1234 ~~"), [
                { length: 2, classes: ["decoration_mark"] },
                { length: 6, classes: ["decoration_delete"] },
                { length: 2, classes: ["decoration_mark"] },
            ])
        })
    })
    describe("autolink", function () {
        it("normal", function () {
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
        it("wrap by text", function () {
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
        }
        ;(global as any).Image = ImageMock

        it("Solid image", function () {
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
                    dom: (image as any) as HTMLElement,
                },
                { length: 1, classes: ["decoration_mark"] },
            ]
            assertTokenEqual(actualTokens, expectedTokens)
        })

        it("Image with text around", function () {
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
                    dom: (image as any) as HTMLElement,
                },
                { length: 1, classes: ["decoration_mark"] },
                { length: 4, classes: [] },
            ]
            assertTokenEqual(actualTokens, expectedTokens)
        })
    })
    describe("link", function () {
        it("normal", function () {
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
