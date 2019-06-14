/*
Inspired by https://github.com/lepture/mistune/
*/

import { Token, mergeTokens, pushClass } from './token'

type Render = (match: string[]) => Token[]
type Rule = [RegExp, Render]

class InlineLexer {
    private rules: Record<string, Rule>

    public constructor() {
        this.rules = {
            doubleEmphases: [
                /^\*{2}(.+?)\*{2}(?!\*)/,
                (match) => [
                    { length: 2, classes: ["decoration_mark"] },
                    ...this.scan(match[1]).map(token => pushClass(token, 'decoration_emphasis_double_text')),
                    { length: 2, classes: ["decoration_mark"] },
                ]
            ],
            singleEmphasis: [
                /^\*((?:\*\*|[^\*])+?)\*(?!\*)/,
                (match) => [
                    { length: 1, classes: ["decoration_mark"] },
                    ...this.scan(match[1]).map(token => pushClass(token, 'decoration_emphasis_single_text')),
                    { length: 1, classes: ["decoration_mark"] },
                ]
            ],
            delete: [
                /^~~(.+?)~~/, // ~~Delete~~
                (match) => [
                    {length: 2, classes: ['decoration_mark']},
                    {length: match[1].length, classes: ['decoration_delete']},
                    {length: 2, classes: ['decoration_mark']},
                ],
            ],
            code: [
                /^(`+)(\s*)(.*?[^`])(\s*)\1(?!`)/, // `Code`
                (match) => [
                    { length: match[1].length, classes: ["decoration_mark"] },
                    { length: match[2].length, classes: ["decoration_code_space"] },
                    { length: match[3].length, classes: ["decoration_code_text"] },
                    { length: match[4].length, classes: ["decoration_code_space"] },
                    { length: match[1].length, classes: ["decoration_mark"] },
                ]
            ],
            link: [
                /^\[([^\[\]]+)\]\((.+?)\)/,  // [link](https://url)
                (match) => [
                    { length: 1, classes: ["decoration_mark"] },
                    ...this.scan(match[1]).map(token => pushClass(token, 'decoration_link_text')),
                    { length: 2, classes: ["decoration_mark"] },
                    {
                        length: match[2].length,
                        classes: ['decoration_link_url'],
                        nodeName: 'a',
                        nodeAttrs: {
                            href: match[2],
                            onClick: `window.open("${match[2]}")`
                            // This <a> element is `contenteditable`, so it's not clickable by default.
                        }
                    },
                    { length: 1, classes: ["decoration_mark"] },
                ]
            ],
            text: [
                /^[\s\S]+?(?=[\\<!\[_*`~]|https?:\/\/| {2,}\n|$)/,
                (match) => [
                    { length: match[0].length, classes: [] },
                ]
            ]
        }
    }

    private manipulate(text: string): [Token[], number] {
        for (const [name, [pattern, render]] of Object.entries(this.rules)) {
            let match = text.match(pattern)
            if (!match) {
                continue
            }
            let tokens: Token[] = mergeTokens(render(match))
            let length = tokens.map(token => token.length).reduce((a, b) => a + b)
            if (length !== match[0].length) {
                console.error(tokens)
                throw new Error(
                    `Tokenization get wrong length when using inline render '${name}'. Before rendering: ${match[0].length}; After rendering: ${length}.`
                )
            }
            return [tokens, length]
        }
        throw new Error(`Infinite loop at: ${text}`)
    }

    public scan(text: string): Token[] {
        let output: Token[] = []
        while (text) {
            let [tokens, length] = this.manipulate(text)
            text = text.slice(length)
            output.push(...tokens)
        }
        return output
    }
}

export { InlineLexer }
