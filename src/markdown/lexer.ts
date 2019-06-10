/*
Inspired by https://github.com/lepture/mistune/
*/

interface Token { length: number; class: string }

type Evaluator = (match: string[]) => Token[]

const inlineRules: [string, RegExp, Evaluator][] = [
    [
        'em',
        /^\*((?:\*\*|[^\*])+?)\*(?!\*)/, // *Word*
        (match: string[]) => [
            { class: "decoration_em_open", length: 1 },
            { class: "decoration_em_text", length: match[1].length },
            { class: "decoration_em_close", length: 1 },
        ]
    ], [
        'strong',
        /^\*{2}([\s\S]+?)\*{2}(?!\*)/, // **Strong**
        (match: string[]) => [
            { class: "decoration_strong_open", length: 2 },
            { class: "decoration_strong_text", length: match[1].length },
            { class: "decoration_strong_close", length: 2 },
        ]
    ], [
        'code',
        /^(`+)(\s*)([\s\S]*?[^`])(\s*)\1(?!`)/, // `Code`
        (match: string[]) => [
            { length: match[1].length, class: "decoration_code_open" },
            { length: match[2].length, class: "decoration_code_space" },
            { length: match[3].length, class: "decoration_code_text" },
            { length: match[4].length, class: "decoration_code_space" },
            { length: match[1].length, class: "decoration_code_close" },
        ]
    ], [
        'text',
        /^[\s\S]+?(?=[\\<!\[_*`~]|https?:\/\/| {2,}\n|$)/,
        (match: string[]) => [
            { length: match[0].length, class: "decoration_text" }
        ]
    ],
]

class InlineLexer {
    private rules: [string, RegExp, Evaluator][]

    public constructor() {
        this.rules = inlineRules
    }

    private manipulate(text: string): [Token[], number] {
        for (const [name, pattern, render] of this.rules) {
            let match = text.match(pattern)
            if (!match) {
                continue
            }
            let tokens: Token[] = render(match).filter(token => token.length > 0)
            let length = tokens.map(token => token.length).reduce((a, b) => a + b)
            if (length !== match[0].length) {
                throw new Error(
                    `Tokenization get wrong length when using inline render '${name}'. Before render: ${length}; After remder: ${match[0].length}`
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
