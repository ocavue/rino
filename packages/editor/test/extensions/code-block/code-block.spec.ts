import { renderEditor } from "jest-remirror"

import { dedent } from "@rino.app/common"

import { buildMarkdownParser, buildMarkdownSerializer } from "../../../src/components/wysiwyg"
import { RinoCodeBlockExtension, RinoParagraphExtension, RinoTextExtension } from "../../../src/extensions"

const defaultLanguage = ""

const setup = () => {
    const {
        view,
        add,
        nodes: { doc, p },
        attributeNodes: { codeMirror },
        manager,
        schema,
    } = renderEditor([new RinoParagraphExtension(), new RinoTextExtension(), new RinoCodeBlockExtension({})])

    return {
        manager,
        view,
        schema,
        add,
        doc,
        p,
        codeMirror,
        codeBlock: codeMirror,
    }
}

describe("fromMarkdown", () => {
    const { manager, doc, codeBlock } = setup()
    const parser = buildMarkdownParser(manager)

    describe("Indented code blocks", () => {
        test("indented code blocks", () => {
            expect(parser.parse(["    markdown", "    code", "    block"].join("\n"))).toEqualRemirrorDocument(
                doc(
                    codeBlock({
                        language: "",
                        userInputLanguage: "",
                        codeBlockType: "indented",
                    })("markdown\ncode\nblock"),
                ),
            )
        })
    })
    describe("Fenced code blocks", () => {
        test("python language", () => {
            expect(
                parser.parse(["```python", "print('hello world!')", "print('hello world!')", "print('hello world!')", "```"].join("\n")),
            ).toEqualRemirrorDocument(
                doc(
                    codeBlock({
                        language: "python",
                        userInputLanguage: "python",
                        codeBlockType: "fenced",
                    })("print('hello world!')\nprint('hello world!')\nprint('hello world!')"),
                ),
            )
        })

        test("unknow language", () => {
            expect(parser.parse(["```unknow", "bla bla bla bla", "```"].join("\n"))).toEqualRemirrorDocument(
                doc(
                    codeBlock({
                        language: "unknow",
                        userInputLanguage: "unknow",
                        codeBlockType: "fenced",
                    })("bla bla bla bla"),
                ),
            )
        })

        test("empty language", () => {
            expect(parser.parse(["```", "echo 'hello world!'", "```"].join("\n"))).toEqualRemirrorDocument(
                doc(
                    codeBlock({
                        language: "",
                        userInputLanguage: "",
                        codeBlockType: "fenced",
                    })("echo 'hello world!'"),
                ),
            )
        })
    })
})

describe("toMarkdown", () => {
    const { manager, doc, codeBlock, p } = setup()
    const serializer = buildMarkdownSerializer(manager)

    describe("Indented code blocks", () => {
        test("one-line code with 0 newline at the end", () => {
            expect(
                serializer.serialize(
                    doc(
                        codeBlock({
                            language: defaultLanguage,
                            userInputLanguage: "",
                            codeBlockType: "indented",
                        })("markdown"),
                    ),
                ),
            ).toEqual("    markdown\n")
        })
        test("one-line code with 1 newline at the end", () => {
            expect(
                serializer.serialize(
                    doc(
                        codeBlock({
                            language: defaultLanguage,
                            userInputLanguage: "",
                            codeBlockType: "indented",
                        })("markdown\n"),
                    ),
                ),
            ).toEqual("    markdown\n    \n")
        })
        test("multi-line code with 0 newline at the end", () => {
            expect(
                serializer.serialize(
                    doc(
                        codeBlock({
                            language: defaultLanguage,
                            userInputLanguage: "",
                            codeBlockType: "indented",
                        })("markdown\nmarkdown\nmarkdown"),
                    ),
                ),
            ).toEqual("    markdown\n    markdown\n    markdown\n")
        })
        test("multi-line code with 1 newline at the end", () => {
            expect(
                serializer.serialize(
                    doc(
                        codeBlock({
                            language: defaultLanguage,
                            userInputLanguage: "",
                            codeBlockType: "indented",
                        })("markdown\nmarkdown\nmarkdown\n"),
                    ),
                ),
            ).toEqual("    markdown\n    markdown\n    markdown\n    \n")
        })
    })

    describe("Fenced code blocks", () => {
        test("one-line code with 0 newline at the end", () => {
            expect(
                serializer.serialize(
                    doc(
                        codeBlock({
                            language: defaultLanguage,
                            userInputLanguage: "",
                            codeBlockType: "fenced",
                        })("markdown"),
                    ),
                ),
            ).toEqual("```\nmarkdown\n```\n")
        })
        test("one-line code with 1 newline at the end", () => {
            expect(
                serializer.serialize(
                    doc(
                        codeBlock({
                            language: defaultLanguage,
                            userInputLanguage: "",
                            codeBlockType: "fenced",
                        })("markdown\n"),
                    ),
                ),
            ).toEqual("```\nmarkdown\n\n```\n")
        })
        test("one-line code with 2 newlines at the end", () => {
            expect(
                serializer.serialize(
                    doc(
                        codeBlock({
                            language: defaultLanguage,
                            userInputLanguage: "",
                            codeBlockType: "fenced",
                        })("markdown\n\n"),
                    ),
                ),
            ).toEqual("```\nmarkdown\n\n\n```\n")
        })

        describe("Mixed with other blocks", () => {
            test("case 1", () => {
                expect(
                    serializer.serialize(
                        doc(
                            p("p0"),
                            p("p1"),
                            codeBlock({
                                language: defaultLanguage,
                                userInputLanguage: "",
                                codeBlockType: "fenced",
                            })("code"),
                            codeBlock({
                                language: defaultLanguage,
                                userInputLanguage: "",
                                codeBlockType: "indented",
                            })("code"),
                            p("p2"),
                        ),
                    ),
                ).toEqual(
                    // TODO: I don't need two empty lines between two blocks
                    dedent(
                        `
                        p0

                        p1

                        \`\`\`
                        code
                        \`\`\`

                            code

                        p2
                        `,
                    ).trim(),
                )
            })
        })
    })
})

describe("input rules", () => {})
