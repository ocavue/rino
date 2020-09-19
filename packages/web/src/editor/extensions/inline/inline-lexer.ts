/*
Inspired by https://github.com/lepture/mistune/
*/

import { parseInline, Token as MdToken } from "@rino.app/markdown"

import { RinoMarkName } from "./inline-mark-define"
import { InlineToken } from "./inline-types"

type Render = (match: string[], depth: number) => InlineToken[]
type Rule = [RegExp, Render]

function fixMarkNames(marks: RinoMarkName[]): RinoMarkName[] {
    if (marks.length <= 1) return marks
    if (marks.includes("mdMark")) return ["mdMark"]
    if (marks.includes("mdCodeText")) return ["mdCodeText"]
    if (marks.includes("mdText")) return marks.filter((x) => x !== "mdText")
    return marks
}

function pushMark(token: InlineToken, markName: RinoMarkName): InlineToken {
    if (!token.marks.includes(markName)) token.marks = fixMarkNames([...token.marks, markName])
    return token
}

export class InlineLexerV1 {
    private rules: Record<string, Rule>

    public constructor() {
        this.rules = {
            doubleEmphases: [
                /\*{2}(.+?)\*{2}(?!\*)/y,
                (match, depth) => [
                    { text: "**", marks: ["mdMark"], attrs: { depth, start: true } },
                    ...this.scan(match[1], depth + 1).map((token) => pushMark(token, "mdStrong")),
                    { text: "**", marks: ["mdMark"], attrs: { depth, end: true } },
                ],
            ],
            singleEmphasis: [
                /\*((?:\*\*|[^\*])+?)\*(?!\*)/y,
                (match, depth) => [
                    { attrs: { depth, start: true }, text: "*", marks: ["mdMark"] },
                    ...this.scan(match[1], depth + 1).map((token) => pushMark(token, "mdEm")),
                    { attrs: { depth, end: true }, text: "*", marks: ["mdMark"] },
                ],
            ],
            delete: [
                /~~(.+?)~~/y, // ~~Delete~~
                (match, depth) => [
                    { attrs: { depth, start: true }, text: "~~", marks: ["mdMark"] },
                    ...this.scan(match[1], depth + 1).map((token) => pushMark(token, "mdDel")),
                    { attrs: { depth, end: true }, text: "~~", marks: ["mdMark"] },
                ],
            ],
            code: [
                /(`+)(\s*)(.*?[^`])(\s*)\1(?!`)/y, // `Code`
                (match, depth) => [
                    { attrs: { depth, start: true }, text: match[1], marks: ["mdMark"] },
                    { attrs: { depth }, text: match[2], marks: ["mdCodeSpace"] },
                    { attrs: { depth }, text: match[3], marks: ["mdCodeText"] },
                    { attrs: { depth }, text: match[4], marks: ["mdCodeSpace"] },
                    { attrs: { depth, end: true }, text: match[1], marks: ["mdMark"] },
                ],
            ],
            image: [
                /\!\[([^\[\]]+)\]\((.+?)\)/y,
                (match, depth) => [
                    { attrs: { depth, start: true }, text: "![", marks: ["mdMark"] },
                    { attrs: { depth }, text: match[1], marks: ["mdImgText"] },
                    { attrs: { depth }, text: "](", marks: ["mdMark"] },
                    { attrs: { depth, href: match[2] }, text: match[2], marks: ["mdImgUri"] },
                    { attrs: { depth, end: true }, text: ")", marks: ["mdMark"] },
                ],
            ],
            link: [
                /\[([^\[\]]+)\]\((.+?)\)/y, // [link](https://url)
                (match, depth) => [
                    { attrs: { depth, start: true }, text: "[", marks: ["mdMark"] },
                    { attrs: { depth }, text: match[1], marks: ["mdLinkText"] },
                    { attrs: { depth }, text: "](", marks: ["mdMark"] },
                    {
                        text: match[2],
                        marks: ["mdLinkUri"],
                        attrs: { depth: depth, href: match[2] },
                    },
                    { attrs: { depth, end: true }, text: ")", marks: ["mdMark"] },
                ],
            ],
            autolink: [
                /<([^ >]+(@|:)[^ >]+)>/y, // <https://url>
                (match, depth) => [
                    { attrs: { depth, start: true }, text: "<", marks: ["mdMark"] },
                    {
                        text: match[1],
                        marks: ["mdLinkText"],
                        attrs: { depth: depth, href: match[1] },
                    },
                    { attrs: { depth, end: true }, text: ">", marks: ["mdMark"] },
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
            const tokens: InlineToken[] = render(match, depth).filter((token) => token.text.length) // Rmove all empty tokens
            const length = tokens.map((token) => token.text.length).reduce((a, b) => a + b, 0)
            if (length !== match[0].length) {
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

const mdTokenToMarkMap: Record<
    string,
    { markName: RinoMarkName; addMarkName?: RinoMarkName; delMarkName?: RinoMarkName }
> = {
    text: { markName: "mdText" },
    em_open: { markName: "mdMark", addMarkName: "mdEm" },
    em_close: { markName: "mdMark", delMarkName: "mdEm" },
    strong_open: { markName: "mdMark", addMarkName: "mdStrong" },
    strong_close: { markName: "mdMark", delMarkName: "mdStrong" },

    link_label_open: { markName: "mdMark", addMarkName: "mdLinkText" },
    link_label_close: { markName: "mdMark", delMarkName: "mdLinkText" },
    link_parenthesis_open: { markName: "mdMark", addMarkName: "mdLinkUri" },
    link_parenthesis_close: { markName: "mdMark", delMarkName: "mdLinkUri" },
    link_title: { markName: "mdMark" },
    link_space: { markName: "mdMark" },
}

function mdTokenToInlineToken(mdToken: MdToken, currMarkNames: Set<RinoMarkName>): InlineToken {
    let { markName, addMarkName, delMarkName } = mdTokenToMarkMap[mdToken.type] || {}

    if (!markName) {
        console.warn(`unknow markdown token type: ${mdToken.type}`)
        markName = "mdText"
    }
    if (addMarkName) {
        currMarkNames.add(addMarkName)
    }
    if (delMarkName) {
        currMarkNames.delete(delMarkName)
    }

    return {
        marks: fixMarkNames([markName, ...currMarkNames]),
        text: mdToken.content,
        attrs: {
            depth: mdToken.level + Math.abs(mdToken.nesting),
            start: mdToken.nesting === 1,
            end: mdToken.nesting === -1,
        },
    }
}

class InlineLexerV2 {
    constructor() {}

    public scan(text: string, depth = 1): InlineToken[] {
        const mdTokens: MdToken[] = parseInline(text)
        const currMarkNames: Set<RinoMarkName> = new Set<RinoMarkName>()
        const _mdTokenToInlineToken = (t: MdToken) => mdTokenToInlineToken(t, currMarkNames)
        const tokens: InlineToken[] = mdTokens.filter((t) => t.content).map(_mdTokenToInlineToken)

        const length = tokens.map((token) => token.text.length).reduce((a, b) => a + b, 0)
        if (length !== text.length) {
            console.error(
                `Tokenization get wrong length when using inline render. Before rendering: ${text.length}; After rendering: ${length}.`,
                { text, tokens },
            )
            return [] // Ignore the result
        }

        return tokens
    }
}

export class InlineLexer extends InlineLexerV2 {}
