const singleRow = `hello **strong**! hello *italic*! hello \`code\`! hello [link](https://www.google.com)!`

const justCodeContent = `
\`\`\`python
while True:
    print("hello world")
\`\`\`
`.trim()

const defaultContent = [
    `
- A
- B
  - B1
  - B2
  - B3
  - B4
  - B5
- C
- D
- E

  P
1. A

   A
2. B
   - C
   - D

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

const nestedList = `
1. A1
    1. B1

---

1. 1. 1. 1. nested items

---

1. ## H1
1. ## H2

`

const simpleList = `
1. A1
1. A2
1. A3
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
    nestedList,
    simpleList,
    heading: headingContent,
    customize: "",
}
