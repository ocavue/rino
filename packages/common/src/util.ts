export function all(items: unknown[]) {
    for (const item of items) {
        if (!item) return false
    }
    return true
}

export function any(items: unknown[]) {
    for (const item of items) {
        if (item) return true
    }
    return false
}

export function generateRandomId(): string {
    // https://stackoverflow.com/a/13403498
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

/**
 * Remove any common leading whitespace from every line in `text`.
 * Inspired by Python's `textwrap.dedent`.
 */
export function dedent(text: string) {
    let minWhitespace = -1
    const lines = text.split("\n")
    for (const line of lines) {
        if (line.length > 0) {
            const match = /^(\s*).*$/.exec(line)
            if (match) {
                minWhitespace = minWhitespace === -1 ? match[1].length : Math.min(minWhitespace, match[1].length)
            } else {
                return text
            }
        }
    }
    return lines.map((line) => (line.length > 0 ? line.slice(minWhitespace) : line)).join("\n")
}

export function isMac(): boolean {
    // https://stackoverflow.com/a/27862868
    return typeof navigator !== "undefined" ? navigator.platform.includes("Mac") : false
}

export const metaKey: "metaKey" | "ctrlKey" = isMac() ? "metaKey" : "ctrlKey"

export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

export function basename(filePath: string) {
    return filePath.split("\\").pop()?.split("/").pop() ?? ""
}
