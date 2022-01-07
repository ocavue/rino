import { PlainExtension } from "@remirror/core"
import { PluginSpec } from "prosemirror-state"
import { EditorView } from "prosemirror-view"

import { applyMarksToCurrentNode } from "./inline-mark-helpers"

// https://spec.commonmark.org/0.29/#ascii-punctuation-character
const markdownPunctuationCharacter = /[\!\"\#\$\%\&\'\(\)\*\+\,\-\.\/\:\;\<\=\>\?\@\[\\\]\^\_\`\{\|\}\~\s]/

function createInlineMarkPlugin(testing = false): PluginSpec {
    let marksTimeoutId: ReturnType<typeof setTimeout> | null = null

    const debounceApplyMarks: (view: EditorView) => void = testing
        ? applyMarksToCurrentNode
        : (view: EditorView) => {
              if (marksTimeoutId) {
                  clearTimeout(marksTimeoutId)
              }
              marksTimeoutId = setTimeout(() => {
                  applyMarksToCurrentNode(view)
                  marksTimeoutId = null
              }, 50)
          }

    const pluginSpec: PluginSpec = {
        state: {
            init: () => {},
            apply: () => {},
        },
        props: {
            handleTextInput(view: EditorView, from: number, to: number, text: string) {
                if (text && markdownPunctuationCharacter.test(text)) {
                    debounceApplyMarks(view)
                }
                return false
            },
            handlePaste(view: EditorView) {
                debounceApplyMarks(view)
                return false
            },
            handleDrop(view: EditorView) {
                debounceApplyMarks(view)
                return false
            },
        },
    }

    return pluginSpec
}

export class RinoInlineMarkExtension extends PlainExtension {
    // The editor will not "debounce" when `#testing` is true. Used in unit tests.
    #testing: boolean

    public constructor(testing = false) {
        super()
        this.#testing = testing
    }

    get name() {
        return "inlineMark" as const
    }

    createKeymap() {
        return {
            // "Mod-b": toggleMark(type),
        }
    }

    createPlugin() {
        return createInlineMarkPlugin(this.#testing)
    }
}
