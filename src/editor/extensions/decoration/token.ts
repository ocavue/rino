interface InlineToken {
    isWidget?: false

    // Length of token.
    length: number

    // An array of class names to added to the target node.
    classes: string[]

    // The target node is wrapped in a DOM element of this type.
    nodeName?: string

    // Specify additional attrs that will be mapped directly to the
    // target node's DOM attributes.
    nodeAttrs?: { [key: string]: string }
}

interface WidgetToken {
    isWidget: true

    // Length of token.
    length: 0

    // An array of class names to added to the target node.
    classes: string[]

    key: string

    dom: HTMLElement
}

export type Token = InlineToken | WidgetToken

function isStringsEqual(a: string[], b: string[]): boolean {
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false
    }
    return true
}

// Merge adjacent tokens with same class and remove token with 0 length
export function mergeTokens(tokens: Token[]): Token[] {
    for (let i = 0; i <= tokens.length - 2; i++) {
        const [self, next] = tokens.slice(i, i + 2)

        // WidgetTokens are unmergeable
        if (self.isWidget || next.isWidget) continue

        if (isStringsEqual(self.classes, next.classes)) {
            next.length += self.length
            self.length = 0
        }
    }
    return tokens.filter((token) => token.isWidget || token.length > 0)
}

export function pushClass(token: Token, className: string): Token {
    if (
        !token.classes.includes(className) &&
        !token.classes.includes("decoration_mark") // Token with "decoration_mark" will not accept other classes.
    ) {
        token.classes.push(className)
    }
    token.classes.sort()
    return token
}
