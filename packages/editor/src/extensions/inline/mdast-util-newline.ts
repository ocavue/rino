import type { Extension as FromMarkdownExtension, Handle as FromMarkdownHandle } from "mdast-util-from-markdown"

const enterNewline: FromMarkdownHandle = function enterNewline(this, token) {
    console.log("token:", token)
    // @ts-expect-error: rinoNewline is not defined
    this.enter({ type: "delete", children: [] }, token)
}

const exitNewline: FromMarkdownHandle = function exitNewline(this, token) {
    this.exit(token)
}

export const newlineFromMarkdown: FromMarkdownExtension = {
    canContainEols: ["delete"],
    transforms: [
        (root) => {
            console.log("root:", JSON.stringify(root,null,2))
            return root
        },
    ],
    enter: { newline: enterNewline },
    exit: { newline: exitNewline },
}
