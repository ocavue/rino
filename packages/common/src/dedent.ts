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
