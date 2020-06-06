/*
Inspired by https://github.com/lepture/mistune/
*/

import { RinoMarkName } from "./inline-mark-define"
import { InlineToken, isWidgetToken } from "./inline-types"

type Render = (match: string[], depth: number) => InlineToken[]
type Rule = [RegExp, Render]

function fixMarkNames(marks: RinoMarkName[]): RinoMarkName[] {
    if (marks.length <= 1) return marks
    if (marks.includes("mdKey")) return ["mdKey"]
    if (marks.includes("mdCodeText")) return ["mdCodeText"]
    if (marks.includes("mdText")) return marks.filter((x) => x !== "mdText")
    return marks
}

function pushMark(token: InlineToken, markName: RinoMarkName): InlineToken {
    if (isWidgetToken(token)) return token
    if (!token.marks.includes(markName)) token.marks = fixMarkNames([...token.marks, markName])
    return token
}

export class InlineLexer {
    private rules: Record<string, Rule>

    public constructor() {
        this.rules = {
            doubleEmphases: [
                /\*{2}(.+?)\*{2}(?!\*)/y,
                (match, depth) => [
                    { text: "**", marks: ["mdKey"], attrs: { depth, start: true } },
                    ...this.scan(match[1], depth + 1).map((token) => pushMark(token, "mdStrong")),
                    { text: "**", marks: ["mdKey"], attrs: { depth, end: true } },
                ],
            ],
            singleEmphasis: [
                /\*((?:\*\*|[^\*])+?)\*(?!\*)/y,
                (match, depth) => [
                    { attrs: { depth, start: true }, text: "*", marks: ["mdKey"] },
                    ...this.scan(match[1], depth + 1).map((token) => pushMark(token, "mdEm")),
                    { attrs: { depth, end: true }, text: "*", marks: ["mdKey"] },
                ],
            ],
            delete: [
                /~~(.+?)~~/y, // ~~Delete~~
                (match, depth) => [
                    { attrs: { depth, start: true }, text: "~~", marks: ["mdKey"] },
                    { attrs: { depth }, text: match[1], marks: ["mdDel"] },
                    { attrs: { depth, end: true }, text: "~~", marks: ["mdKey"] },
                ],
            ],
            code: [
                /(`+)(\s*)(.*?[^`])(\s*)\1(?!`)/y, // `Code`
                (match, depth) => [
                    { attrs: { depth, start: true }, text: match[1], marks: ["mdKey"] },
                    { attrs: { depth }, text: match[2], marks: ["mdCodeSpace"] },
                    { attrs: { depth }, text: match[3], marks: ["mdCodeText"] },
                    { attrs: { depth }, text: match[4], marks: ["mdCodeSpace"] },
                    { attrs: { depth, end: true }, text: match[1], marks: ["mdKey"] },
                ],
            ],
            image: [
                /\!\[([^\[\]]+)\]\((.+?)\)/y,
                (match, depth) => [
                    { attrs: { depth, start: true }, text: "[(", marks: ["mdKey"] },
                    { attrs: { depth }, text: match[1], marks: ["mdImgText"] },
                    { attrs: { depth }, text: ")]", marks: ["mdKey"] },
                    { attrs: { depth }, text: match[2], marks: ["mdImgUri"] },
                    // {
                    //     isWidget: true,
                    //     length: 0,
                    //     classes: [],
                    //     key: match[2],
                    //     dom: (() => {
                    //         const img = new Image()
                    //         img.src = match[2]
                    //         return img
                    //     })(),
                    // },
                    { attrs: { depth, end: true }, text: ")", marks: ["mdKey"] },
                ],
            ],
            link: [
                /\[([^\[\]]+)\]\((.+?)\)/y, // [link](https://url)
                (match, depth) => [
                    { attrs: { depth, start: true }, text: "[", marks: ["mdKey"] },
                    ...this.scan(match[1], depth + 1).map((token) => pushMark(token, "mdLinkText")),
                    { attrs: { depth }, text: "](", marks: ["mdKey"] },
                    {
                        text: match[2],
                        marks: ["mdLinkUri"],
                        attrs: { depth: depth, href: match[2] },
                    },
                    { attrs: { depth, end: true }, text: ")", marks: ["mdKey"] },
                ],
            ],
            autolink: [
                /<([^ >]+(@|:)[^ >]+)>/y, // <https://url>
                (match, depth) => [
                    { attrs: { depth, start: true }, text: "<", marks: ["mdKey"] },
                    {
                        text: match[1],
                        marks: ["mdLinkText"],
                        attrs: { depth: depth, href: match[1] },
                    },
                    { attrs: { depth, end: true }, text: ">", marks: ["mdKey"] },
                ],
            ],
            text: [
                /[\s\S]+?(?=[\\<!\[_*`~]|https?:\/\/| {2,}\n|$)/y,
                (match, depth) => [
                    { attrs: { depth, start: true, end: true }, text: match[0], marks: ["mdText"] },
                ],
            ],
        }
    }

    private manipulate(text: string, startIndex: number, depth: number): [InlineToken[], number] {
        for (const [name, [regex, render]] of Object.entries(this.rules)) {
            regex.lastIndex = startIndex
            const match = regex.exec(text)
            if (!match) {
                // If the match fails, regex.exec() returns null, and sets `regex.lastIndex` to 0.
                continue
            } else {
                // Otherwise we set `regex.lastIndex` to 0 manually to avoid some unexpected behavior.
                regex.lastIndex = 0
            }

            const tokens: InlineToken[] = []
            let textLength = 0
            for (const token of render(match, depth)) {
                if (isWidgetToken(token)) {
                    tokens.push(token)
                } else if (token.text.length) {
                    // Rmove all empty text tokens
                    textLength += token.text.length
                    tokens.push(token)
                }
            }

            if (textLength !== match[0].length) {
                console.error(tokens)
                throw new Error(
                    `Tokenization get wrong length when using inline render '${name}'. Before rendering: ${match[0].length}; After rendering: ${length}.`,
                )
            }

            return [tokens, length]
        }
        throw new Error(`Infinite loop at: ${text}`)
    }

    public scan(text: string, depth = 1): InlineToken[] {
        const output: InlineToken[] = []
        let start = 0
        while (start < text.length) {
            const [tokens, length] = this.manipulate(text, start, depth)
            start += length
            output.push(...tokens)
        }
        return output
    }
}
