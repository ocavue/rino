import { describe, expect, test } from "vitest"

import { fromInlineMarkdown } from "./from-inline-markdown"

describe("text", function () {
    test("normal", function () {
        expect(fromInlineMarkdown("text")).toStrictEqual([
            {
                text: "text",
                start: 0,
                end: 4,
                marks: ["mdText"],
                attrs: { depth: 1, first: true, last: true },
            },
        ])
    })

    test("with whitespace", function () {
        expect(fromInlineMarkdown(" abc  def ")).toStrictEqual([
            {
                text: "abc  def",
                start: 1,
                end: 9,
                marks: ["mdText"],
                attrs: { depth: 1, first: true, last: true },
            },
        ])
    })

    test("only whitespace", function () {
        expect(fromInlineMarkdown(" ")).toStrictEqual([])
    })
})

describe("strong + emphasis", function () {
    test("without spaces", function () {
        expect(fromInlineMarkdown("*word*")).toStrictEqual([
            {
                text: "*",
                marks: ["mdMark"],
                attrs: { depth: 1, first: true },
                start: 0,
                end: 1,
            },
            {
                text: "word",
                marks: ["mdEm"],
                attrs: { depth: 2, first: true, last: true },
                start: 1,
                end: 5,
            },
            {
                text: "*",
                marks: ["mdMark"],
                attrs: { depth: 1, last: true },
                start: 5,
                end: 6,
            },
        ])
        expect(fromInlineMarkdown("**word**")).toStrictEqual([
            {
                text: "**",
                marks: ["mdMark"],
                attrs: { depth: 1, first: true },
                start: 0,
                end: 2,
            },
            {
                text: "word",
                marks: ["mdStrong"],
                attrs: { depth: 2, first: true, last: true },
                start: 2,
                end: 6,
            },
            {
                text: "**",
                marks: ["mdMark"],
                attrs: { depth: 1, last: true },
                start: 6,
                end: 8,
            },
        ])
        expect(fromInlineMarkdown("***word***")).toStrictEqual([
            {
                text: "*",
                marks: ["mdMark"],
                attrs: { depth: 1, first: true },
                start: 0,
                end: 1,
            },
            {
                text: "**",
                marks: ["mdMark"],
                attrs: { depth: 2, first: true },
                start: 1,
                end: 3,
            },
            {
                text: "word",
                marks: ["mdStrong", "mdEm"],
                attrs: { depth: 3, first: true, last: true },
                start: 3,
                end: 7,
            },
            {
                text: "**",
                marks: ["mdMark"],
                attrs: { depth: 2, last: true },
                start: 7,
                end: 9,
            },
            {
                text: "*",
                marks: ["mdMark"],
                attrs: { depth: 1, last: true },
                start: 9,
                end: 10,
            },
        ])
    })
    test("with spaces", function () {
        expect(fromInlineMarkdown("* word *")).toStrictEqual([
            {
                text: "* word *",
                marks: ["mdText"],
                attrs: { depth: 1, first: true, last: true },
                start: 0,
                end: 8,
            },
        ])
        expect(fromInlineMarkdown("** word **")).toStrictEqual([
            {
                text: "** word **",
                marks: ["mdText"],
                attrs: { depth: 1, first: true, last: true },
                start: 0,
                end: 10,
            },
        ])
        expect(fromInlineMarkdown("*** word ***")).toStrictEqual([
            {
                text: "*** word ***",
                marks: ["mdText"],
                attrs: { depth: 1, first: true, last: true },
                start: 0,
                end: 12,
            },
        ])
    })
    test("mix", function () {
        expect(fromInlineMarkdown("*1234**1234**1234*")).toStrictEqual([
            {
                text: "*",
                marks: ["mdMark"],
                attrs: { depth: 1, first: true },
                start: 0,
                end: 1,
            },
            {
                text: "1234",
                marks: ["mdEm"],
                attrs: { depth: 2, first: true, last: true },
                start: 1,
                end: 5,
            },
            {
                text: "**",
                marks: ["mdMark"],
                attrs: { depth: 2, first: true },
                start: 5,
                end: 7,
            },
            {
                text: "1234",
                marks: ["mdStrong", "mdEm"],
                attrs: { depth: 3, first: true, last: true },
                start: 7,
                end: 11,
            },
            {
                text: "**",
                marks: ["mdMark"],
                attrs: { depth: 2, last: true },
                start: 11,
                end: 13,
            },
            {
                text: "1234",
                marks: ["mdEm"],
                attrs: { depth: 2, first: true, last: true },
                start: 13,
                end: 17,
            },
            {
                text: "*",
                marks: ["mdMark"],
                attrs: { depth: 1, last: true },
                start: 17,
                end: 18,
            },
        ])
        expect(fromInlineMarkdown("**1234*1234*1234**")).toStrictEqual([
            {
                text: "**",
                marks: ["mdMark"],
                attrs: { depth: 1, first: true },
                start: 0,
                end: 2,
            },
            {
                text: "1234",
                marks: ["mdStrong"],
                attrs: { depth: 2, first: true, last: true },
                start: 2,
                end: 6,
            },
            {
                text: "*",
                marks: ["mdMark"],
                attrs: { depth: 2, first: true },
                start: 6,
                end: 7,
            },
            {
                text: "1234",
                marks: ["mdEm", "mdStrong"],
                attrs: { depth: 3, first: true, last: true },
                start: 7,
                end: 11,
            },
            {
                text: "*",
                marks: ["mdMark"],
                attrs: { depth: 2, last: true },
                start: 11,
                end: 12,
            },
            {
                text: "1234",
                marks: ["mdStrong"],
                attrs: { depth: 2, first: true, last: true },
                start: 12,
                end: 16,
            },
            {
                text: "**",
                marks: ["mdMark"],
                attrs: { depth: 1, last: true },
                start: 16,
                end: 18,
            },
        ])
    })
})

describe("code", function () {
    test("without space", function () {
        expect(fromInlineMarkdown("`code`")).toStrictEqual([
            {
                text: "`",
                start: 0,
                end: 1,
                marks: ["mdMark"],
                attrs: { depth: 1, first: true },
            },
            {
                text: "code",
                start: 1,
                end: 5,
                marks: ["mdCodeText"],
                attrs: { depth: 1 },
            },
            {
                text: "`",
                start: 5,
                end: 6,
                marks: ["mdMark"],
                attrs: { depth: 1, last: true },
            },
        ])
    })
    test("with two trim spaces", function () {
        expect(fromInlineMarkdown("` code `")).toStrictEqual([
            {
                text: "`",
                start: 0,
                end: 1,
                marks: ["mdMark"],
                attrs: { depth: 1, first: true },
            },
            {
                text: " code ",
                start: 1,
                end: 7,
                marks: ["mdCodeText"],
                attrs: { depth: 1 },
            },
            {
                text: "`",
                start: 7,
                end: 8,
                marks: ["mdMark"],
                attrs: { depth: 1, last: true },
            },
        ])
    })
    test("with one trim space", function () {
        expect(fromInlineMarkdown("` code`")).toStrictEqual([
            {
                text: "`",
                start: 0,
                end: 1,
                marks: ["mdMark"],
                attrs: { depth: 1, first: true },
            },
            {
                text: " code",
                start: 1,
                end: 6,
                marks: ["mdCodeText"],
                attrs: { depth: 1 },
            },
            {
                text: "`",
                start: 6,
                end: 7,
                marks: ["mdMark"],
                attrs: { depth: 1, last: true },
            },
        ])
        expect(fromInlineMarkdown("`code `")).toStrictEqual([
            {
                text: "`",
                start: 0,
                end: 1,
                marks: ["mdMark"],
                attrs: { depth: 1, first: true },
            },
            {
                text: "code ",
                start: 1,
                end: 6,
                marks: ["mdCodeText"],
                attrs: { depth: 1 },
            },
            {
                text: "`",
                start: 6,
                end: 7,
                marks: ["mdMark"],
                attrs: { depth: 1, last: true },
            },
        ])
    })
})

describe("delete", function () {
    test("normal", function () {
        expect(fromInlineMarkdown("~~1234~~")).toStrictEqual([
            {
                text: "~~",
                start: 0,
                end: 2,
                marks: ["mdMark"],
                attrs: { depth: 1, first: true },
            },
            {
                text: "1234",
                start: 2,
                end: 6,
                marks: ["mdDel"],
                attrs: { depth: 2, first: true, last: true },
            },
            {
                text: "~~",
                start: 6,
                end: 8,
                marks: ["mdMark"],
                attrs: { depth: 1, last: true },
            },
        ])
    })
    test("with inside tilde", function () {
        expect(fromInlineMarkdown("~~12~34~~")).toStrictEqual([
            {
                text: "~~",
                start: 0,
                end: 2,
                marks: ["mdMark"],
                attrs: { depth: 1, first: true },
            },
            {
                text: "12~34",
                start: 2,
                end: 7,
                marks: ["mdDel"],
                attrs: { depth: 2, first: true, last: true },
            },
            {
                text: "~~",
                start: 7,
                end: 9,
                marks: ["mdMark"],
                attrs: { depth: 1, last: true },
            },
        ])
    })
    test("with space", function () {
        expect(fromInlineMarkdown("~~ 1234 ~~")).toStrictEqual([
            {
                text: "~~ 1234 ~~",
                start: 0,
                end: 10,
                marks: ["mdText"],
                attrs: { depth: 1, first: true, last: true },
            },
        ])
    })
    test("do not support strikethrough with a single tilde", function () {
        expect(fromInlineMarkdown("~1234~")).toStrictEqual([
            {
                text: "~1234~",
                start: 0,
                end: 6,
                marks: ["mdText"],
                attrs: { depth: 1, first: true, last: true },
            },
        ])
    })
})

describe("link", function () {
    test("normal", function () {
        expect(fromInlineMarkdown(`[foo](https://example.com)`)).toStrictEqual([
            {
                text: "[",
                marks: ["mdMark"],
                attrs: { depth: 1, first: true },
                start: 0,
                end: 1,
            },
            {
                text: "foo",
                marks: ["mdLinkText"],
                attrs: { depth: 2, first: true, last: true, href: "https://example.com" },
                start: 1,
                end: 4,
            },
            {
                text: "](",
                marks: ["mdMark"],
                attrs: { depth: 1 },
                start: 4,
                end: 6,
            },
            {
                text: `https://example.com`,
                marks: ["mdLinkUri"],
                attrs: { depth: 1 },
                start: 6,
                end: 25,
            },
            {
                text: ")",
                marks: ["mdMark"],
                attrs: { depth: 1, last: true },
                start: 25,
                end: 26,
            },
        ])
    })

    test("with label", function () {
        expect(fromInlineMarkdown(`[foo](https://example.com "bar")`)).toStrictEqual([
            {
                text: "[",
                marks: ["mdMark"],
                attrs: { depth: 1, first: true },
                start: 0,
                end: 1,
            },
            {
                text: "foo",
                marks: ["mdLinkText"],
                attrs: { depth: 2, first: true, last: true, href: "https://example.com" },
                start: 1,
                end: 4,
            },
            {
                text: "](",
                marks: ["mdMark"],
                attrs: { depth: 1 },
                start: 4,
                end: 6,
            },
            {
                text: `https://example.com "bar"`,
                marks: ["mdLinkUri"],
                attrs: { depth: 1 },
                start: 6,
                end: 31,
            },
            {
                text: ")",
                marks: ["mdMark"],
                attrs: { depth: 1, last: true },
                start: 31,
                end: 32,
            },
        ])
    })

    test("with space", function () {
        expect(fromInlineMarkdown('[ foo ]( https://example.com  " bar " )')).toStrictEqual([
            {
                text: "[",
                marks: ["mdMark"],
                attrs: { depth: 1, first: true },
                start: 0,
                end: 1,
            },
            {
                text: " foo ",
                marks: ["mdLinkText"],
                attrs: { depth: 2, first: true, last: true, href: "https://example.com" },
                start: 1,
                end: 6,
            },
            {
                text: "](",
                marks: ["mdMark"],
                attrs: { depth: 1 },
                start: 6,
                end: 8,
            },
            {
                text: ` https://example.com  " bar " `,
                marks: ["mdLinkUri"],
                attrs: { depth: 1 },
                start: 8,
                end: 38,
            },
            {
                text: ")",
                marks: ["mdMark"],
                attrs: { depth: 1, last: true },
                start: 38,
                end: 39,
            },
        ])
    })
})

describe("image", function () {
    test("normal local file", function () {
        expect(fromInlineMarkdown(`![foo](/tmp/image.png)`)).toStrictEqual([
            {
                attrs: {
                    depth: 1,
                    first: true,
                    href: "/tmp/image.png",
                    last: true,
                },
                marks: ["mdImgUri"],
                text: "![foo](/tmp/image.png)",
                start: 0,
                end: 22,
            },
        ])
    })

    test("normal remote url", function () {
        expect(fromInlineMarkdown(`![foo](http://example.com/image.png)`)).toStrictEqual([
            {
                attrs: {
                    depth: 1,
                    first: true,
                    href: "http://example.com/image.png",
                    last: true,
                },
                marks: ["mdImgUri"],
                text: "![foo](http://example.com/image.png)",
                start: 0,
                end: 36,
            },
        ])
    })

    test("local file path with whitepsace", function () {
        expect(fromInlineMarkdown(`![foo](</tmp/file path/image v2.png>)`)).toStrictEqual([
            {
                attrs: {
                    depth: 1,
                    first: true,
                    href: "/tmp/file path/image v2.png",
                    last: true,
                },
                marks: ["mdImgUri"],
                text: "![foo](</tmp/file path/image v2.png>)",
                start: 0,
                end: 37,
            },
        ])
        expect(fromInlineMarkdown(`![foo](/tmp/file path/image v2.png)`)).toStrictEqual([
            {
                attrs: {
                    depth: 1,
                    first: true,
                    last: true,
                },
                marks: ["mdText"],
                text: "![foo](/tmp/file path/image v2.png)",
                start: 0,
                end: 35,
            },
        ])
    })
})

describe("autolink", function () {
    test("normal", function () {
        expect(fromInlineMarkdown("<https://rino.app>")).toStrictEqual([
            {
                text: "<",
                marks: ["mdMark"],
                attrs: { depth: 1, first: true },
                start: 0,
                end: 1,
            },
            {
                text: "https://rino.app",
                marks: ["mdLinkText"],
                attrs: { depth: 2, first: true, last: true, href: "https://rino.app" },
                start: 1,
                end: 17,
            },
            {
                text: ">",
                marks: ["mdMark"],
                attrs: { depth: 1, last: true },
                start: 17,
                end: 18,
            },
        ])
    })
    test("wrap by text", function () {
        expect(fromInlineMarkdown("text<https://rino.app>text")).toStrictEqual([
            {
                text: "text",
                marks: ["mdText"],
                attrs: { depth: 1, first: true, last: true },
                start: 0,
                end: 4,
            },
            {
                text: "<",
                marks: ["mdMark"],
                attrs: { depth: 1, first: true },
                start: 4,
                end: 5,
            },
            {
                text: "https://rino.app",
                marks: ["mdLinkText"],
                attrs: { depth: 2, first: true, last: true, href: "https://rino.app" },
                start: 5,
                end: 21,
            },
            {
                text: ">",
                marks: ["mdMark"],
                attrs: { depth: 1, last: true },
                start: 21,
                end: 22,
            },
            {
                text: "text",
                marks: ["mdText"],
                attrs: { depth: 1, first: true, last: true },
                start: 22,
                end: 26,
            },
        ])
    })
})

describe("hard break", function () {
    test("no hard break", function () {
        expect(fromInlineMarkdown("abc")).toStrictEqual([
            {
                start: 0,
                end: 3,
                marks: ["mdText"],
                text: "abc",
                attrs: {
                    depth: 1,
                    first: true,
                    last: true,
                },
            },
        ])
    })

    test("one hard break within text", function () {
        expect(fromInlineMarkdown("ab\nc")).toStrictEqual([
            {
                start: 0,
                end: 4,
                marks: ["mdText"],
                text: "ab\nc",
                attrs: {
                    depth: 1,
                    first: true,
                    last: true,
                },
            },
        ])
    })

    test("one hard break at the beginning", function () {
        expect(fromInlineMarkdown("\nabc")).toStrictEqual([
            {
                start: 1,
                end: 4,
                marks: ["mdText"],
                text: "abc",
                attrs: {
                    depth: 1,
                    first: true,
                    last: true,
                },
            },
        ])
    })

    test("one hard break at the end", function () {
        expect(fromInlineMarkdown("abc\n")).toStrictEqual([
            {
                start: 0,
                end: 3,
                marks: ["mdText"],
                text: "abc",
                attrs: {
                    depth: 1,
                    first: true,
                    last: true,
                },
            },
        ])
    })
})
