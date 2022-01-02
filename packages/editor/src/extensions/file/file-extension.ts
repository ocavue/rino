import { findParentNode, PlainExtension } from "@remirror/core"
import { FileHandlerProps, FilePasteRule } from "@remirror/pm/paste-rules"

import { applyMarksToNode } from "../inline"

type PastedFile = {
    /**
     * The name of the file.
     *
     * @example "file.pdf"
     * @example "00FFFF.png"
     */
    name: string

    /**
     * The local or remote path of the file.
     *
     * @example "/Users/user/Desktop/00FFFF.png"
     * @example "https://example.com/file.pdf"
     * @example "blob:http://localhost:3001/a1b84bff-6e93-4159-8e24-1e132b9c3d7a"
     */
    uri: string
}

export type FileHandler = (props: FileHandlerProps) => Array<PastedFile>

export type RinoFileExtensionOptions = {
    imageFileHandler?: FileHandler
}

export class RinoFileExtension extends PlainExtension<RinoFileExtensionOptions> {
    readonly name = "flie"

    createPasteRules(): FilePasteRule[] {
        const imageFileHandler = this.options.imageFileHandler ?? defaultFileHandler

        return [
            {
                type: "file",
                regexp: /image/i,
                fileHandler: (props): boolean => {
                    const files = imageFileHandler(props)
                    if (files.length === 0) return false

                    let text = ""
                    for (const file of files) {
                        text += `![${file.name}](${file.uri}) `
                    }

                    const view = this.store.view
                    const pos: number = props.type === "drop" ? props.pos : view.state.selection.anchor
                    view.dispatch(view.state.tr.insertText(text, pos))

                    const found = findParentNode({
                        selection: view.state.doc.resolve(pos),
                        predicate: (node) => {
                            return node.isTextblock && !node.type.spec.code
                        },
                    })
                    if (found) {
                        applyMarksToNode(view, found.node, found.start)
                    }

                    return true
                },
            },
        ]
    }
}

const defaultFileHandler: FileHandler = (props) => {
    const { files } = props

    return files.map((file) => ({
        name: file.name,
        uri: URL.createObjectURL(file),
    }))
}
