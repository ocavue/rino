import { NodeSerializerSpec, ParserRule } from "../../transform"

export abstract class MarkdownNodeExtension {
    abstract fromMarkdown: () => readonly ParserRule[]
    abstract toMarkdown: NodeSerializerSpec
}
