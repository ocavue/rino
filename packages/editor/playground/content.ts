const singleRow = `hello **strong**! hello *italic*! hello \`code\`! hello [link](https://www.google.com)!`
const longContent = (singleRow.repeat(200) + "\n\n").repeat(5)

const justCodeContent = `
\`\`\`python
while True:
    print("hello world")
\`\`\`
`.trim()

const defaultContent = [
    `

# Title

hello world!

`.trim(),
    singleRow,
    justCodeContent,
    `

- list item
- list item
  - [x] checked
  - [ ] unchecked

1. first
1. second
1. third

`.trim(),
].join("\n")

const tableContent = `
| Header A | Header B | Header C |
| --- | :--- | ---: |
| Cell 1 | Cell 2 | Cell 3 |
| Cell 1 | Cell 2 | Cell 3 |
| Cell 1 | Cell 2 | Cell 3 |
`

export const contentMap: { [key: string]: string } = {
    default: defaultContent,
    "just-code": justCodeContent,
    long: longContent,
    table: tableContent,
    customize: "",
}
