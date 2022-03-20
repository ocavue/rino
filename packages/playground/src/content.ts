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
| First Header  | Second Header |
| ------------- | ------------- |
| Content Cell  | Content Cell  |
| Content Cell  | Content Cell  |

Click me to exit the table (TODO: I should not need this)

| First Header  | Second Header | Third Header |
| ------------- | ------------- | ------------ |
| Content Cell  | Content Cell  | Content Cell |
| Content Cell  | Content Cell  | Content Cell |
| Content Cell  | Content Cell  | Content Cell |
| Content Cell  | Content Cell  | Content Cell |

Click me to exit the table (TODO: I should not need this)

A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
A lot of content.
`

export const contentMap: { [key: string]: string } = {
    default: defaultContent,
    "just-code": justCodeContent,
    long: longContent,
    table: tableContent,
    customize: "",
}
