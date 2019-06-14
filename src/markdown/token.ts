export interface Token { length: number; classes: string[] }

function isEqual(a: string[], b: string[]): boolean {
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false
    }
    return true
}

// Merge adjacent tokens with same class and remove token with 0 length
export function mergeTokens(tokens: Token[]): Token[] {
    for (let i = 0; i <= tokens.length - 2; i++) {
        let [self, next] = tokens.slice(i, i + 2)
        if (isEqual(self.classes, next.classes)) {
            next.length += self.length
            self.length = 0
        }
    }
    return tokens.filter(token => token.length > 0)
}

export function pushClass(token: Token, className: string): Token {
    if (
        token.classes.indexOf(className) === -1 &&
        token.classes.indexOf("decoration_mark") === -1  // Token with "decoration_mark" will not accept other classes.
    ) {
        token.classes.push(className)
    }
    token.classes.sort()
    return token
}
