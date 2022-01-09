import { PlainExtension } from "@remirror/core"
import { FileHandlerProps, FilePasteRule } from "@remirror/pm/paste-rules"
import { Selection } from "prosemirror-state"

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
     * @example "/Users/user/Desktop/00FFFF with whitespace.png"
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
                        if (file.uri.includes(" ")) {
                            text += `![${file.name}](<${file.uri}>) `
                        } else {
                            text += `![${file.name}](${file.uri}) `
                        }
                    }

                    const view = this.store.view
                    const pos = props.type === "drop" ? props.pos : view.state.selection.anchor
                    const tr = view.state.tr
                    tr.insertText(text, pos)
                    tr.setSelection(Selection.near(tr.doc.resolve(pos)))
                    tr.scrollIntoView()
                    view.dispatch(tr)

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
