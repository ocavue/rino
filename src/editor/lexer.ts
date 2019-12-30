/*
Inspired by https://github.com/lepture/mistune/
*/

import { Token, mergeTokens, pushClass } from "./token"

type Render = (match: string[]) => Token[]
type Rule = [RegExp, Render]

class InlineLexer {
    private rules: Record<string, Rule>

    public constructor() {
        this.rules = {
            doubleEmphases: [
                /^\*{2}(.+?)\*{2}(?!\*)/,
                match => [
                    { length: 2, classes: ["decoration_mark"] },
                    ...this.scan(match[1]).map(token =>
                        pushClass(token, "decoration_emphasis_double_text"),
                    ),
                    { length: 2, classes: ["decoration_mark"] },
                ],
            ],
            singleEmphasis: [
                /^\*((?:\*\*|[^\*])+?)\*(?!\*)/,
                match => [
                    { length: 1, classes: ["decoration_mark"] },
                    ...this.scan(match[1]).map(token =>
                        pushClass(token, "decoration_emphasis_single_text"),
                    ),
                    { length: 1, classes: ["decoration_mark"] },
                ],
            ],
            delete: [
                /^~~(.+?)~~/, // ~~Delete~~
                match => [
                    { length: 2, classes: ["decoration_mark"] },
                    { length: match[1].length, classes: ["decoration_delete"] },
                    { length: 2, classes: ["decoration_mark"] },
                ],
            ],
            code: [
                /^(`+)(\s*)(.*?[^`])(\s*)\1(?!`)/, // `Code`
                match => [
                    { length: match[1].length, classes: ["decoration_mark"] },
                    { length: match[2].length, classes: ["decoration_code_space"] },
                    { length: match[3].length, classes: ["decoration_code_text"] },
                    { length: match[4].length, classes: ["decoration_code_space"] },
                    { length: match[1].length, classes: ["decoration_mark"] },
                ],
            ],
            image: [
                /^\!\[([^\[\]]+)\]\((.+?)\)/,
                match => [
                    { length: 2, classes: ["decoration_mark"] },
                    { length: match[1].length, classes: ["decoration_image_text"] },
                    { length: 2, classes: ["decoration_mark"] },
                    { length: match[2].length, classes: ["decoration_image_url"] },
                    {
                        isWidget: true,
                        length: 0,
                        classes: [],
                        key: match[2],
                        dom: (() => {
                            const img = new Image()
                            img.src = match[2]
                            return img
                        })(),
                    },
                    { length: 1, classes: ["decoration_mark"] },
                ],
            ],
            link: [
                /^\[([^\[\]]+)\]\((.+?)\)/, // [link](https://url)
                match => [
                    { length: 1, classes: ["decoration_mark"] },
                    ...this.scan(match[1]).map(token => pushClass(token, "decoration_link_text")),
                    { length: 2, classes: ["decoration_mark"] },
                    this.processLink(match[2]),
                    { length: 1, classes: ["decoration_mark"] },
                ],
            ],
            autolink: [
                /^<([^ >]+(@|:)[^ >]+)>/, // <https://url>
                match => [
                    { length: 1, classes: ["decoration_mark"] },
                    this.processLink(match[1]),
                    { length: 1, classes: ["decoration_mark"] },
                ],
            ],
            text: [
                /^[\s\S]+?(?=[\\<!\[_*`~]|https?:\/\/| {2,}\n|$)/,
                match => [{ length: match[0].length, classes: [] }],
            ],
        }
    }

    private manipulate(text: string): [Token[], number] {
        for (const [name, [pattern, render]] of Object.entries(this.rules)) {
            const match = pattern.exec(text)
            if (!match) {
                continue
            }
            const tokens: Token[] = mergeTokens(render(match))
            const length = tokens.map(token => token.length).reduce((a, b) => a + b)
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

    public scan(text: string): Token[] {
        const output: Token[] = []
        while (text) {
            const [tokens, length] = this.manipulate(text)
            text = text.slice(length)
            output.push(...tokens)
        }
        return output
    }

    private processLink(url: string): Token {
        return {
            length: url.length,
            classes: ["decoration_link_url"],
            nodeName: "a",
            nodeAttrs: {
                href: url,
                onClick: `window.open("${url}")`,
                // This <a> element is `contenteditable`, so it's not clickable by default.
            },
        }
    }
}

export { InlineLexer }
