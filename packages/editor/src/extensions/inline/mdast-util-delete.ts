/**
 * @typedef {import('mdast').Delete} Delete
 * @typedef {import('mdast-util-from-markdown').Extension} FromMarkdownExtension
 * @typedef {import('mdast-util-from-markdown').Handle} FromMarkdownHandle
 * @typedef {import('mdast-util-to-markdown').Options} ToMarkdownExtension
 * @typedef {import('mdast-util-to-markdown').Handle} ToMarkdownHandle

/** @type {FromMarkdownExtension} */
export const gfmStrikethroughFromMarkdown = {
    canContainEols: ["delete"],
    enter: { strikethrough: enterStrikethrough },
    exit: { strikethrough: exitStrikethrough },
}

/** @type {FromMarkdownHandle} */
function enterStrikethrough(token) {
    this.enter({ type: "delete", children: [] }, token)
}

/** @type {FromMarkdownHandle} */
function exitStrikethrough(token) {
    this.exit(token)
}
