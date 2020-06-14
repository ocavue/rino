import MarkdownIt from "markdown-it"

declare module "markdown-it" {
    export interface Options extends MarkdownIt.Options {
        maxNesting: number
    }
}
