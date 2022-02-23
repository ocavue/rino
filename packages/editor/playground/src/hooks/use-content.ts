import { useState } from "react"

import updateURLParams from "../utils/update-url"

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
export const contentMap: { [key: string]: string } = {
    default: defaultContent,
    "just-code": justCodeContent,
    long: longContent,
    customize: "",
}

export default function useContent(initContentId: string, initContent: string) {
    const [contentId, setContentId] = useState(initContentId)
    const [content, setContent] = useState(initContent)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    return {
        contentId,
        content,
        hasUnsavedChanges,
        setContentId: function (newId: string): void {
            setContentId(newId)
            setContent(contentMap[newId])
            updateURLParams({ contentId: newId })
        },
        setContent,
        setHasUnsavedChanges,
    }
}
