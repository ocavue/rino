const singleRow = `hello **strong**! hello *italic*! hello \`code\`! hello [link](https://www.google.com)!`

const justCodeContent = `
\`\`\`python
while True:
    print("hello world")
\`\`\`
`.trim()

const defaultContent = [
    `# hello

Line A
Line B

Line C
`.trim(),
].join("\n")

const longContent = defaultContent + "\n\n" + (singleRow.repeat(200) + "\n\n").repeat(5)

const tableContent = `
# Table

| First Header  | Second Header |
| ------------- | ------------- |
| Content Cell  | Content Cell  |
| Content Cell  | Content Cell  |

# A larger table

| First Header  | Second Header | Third Header |
| ------------- | ------------- | ------------ |
| Content Cell  | Content Cell  | Content Cell |
| Content Cell  | Content Cell  | Content Cell |
| Content Cell  | Content Cell  | Content Cell |
| Content Cell  | Content Cell  | Content Cell |

`

const headingContent = `
# Heading Level 1

## Heading Level 2

### Heading Level 3

#### Heading Level 4

##### Heading Level 5

###### Heading Level 6
`

export const contentMap: { [key: string]: string } = {
    default: defaultContent,
    "just-code": justCodeContent,
    long: longContent,
    table: tableContent,
    heading: headingContent,
    customize: "",
}
