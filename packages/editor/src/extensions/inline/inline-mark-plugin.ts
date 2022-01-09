import { PlainExtension } from "@remirror/core"
import { EditorState, PluginSpec, Transaction } from "prosemirror-state"
import { EditorView } from "prosemirror-view"

import { applyRangeMarks } from "./inline-mark-helpers"

function createInlineMarkPlugin(testing = false): PluginSpec {
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    const debounceApplyMarks: (view: EditorView) => void = testing
        ? applyRangeMarks
        : (view: EditorView) => {
              if (timeoutId) {
                  clearTimeout(timeoutId)
              }
              timeoutId = setTimeout(() => {
                  applyRangeMarks(view)
                  timeoutId = null
              }, 100)
          }

    let globalView: EditorView | null = null

    const pluginSpec: PluginSpec = {
        appendTransaction: (transactions: Array<Transaction>, oldState: EditorState, newState: EditorState): void => {
            let shouldUpdate = false

            for (const tr of transactions) {
                if (tr.docChanged && !tr.getMeta("RINO_APPLY_MARKS")) {
                    shouldUpdate = true
                    break
                }
            }

            if (shouldUpdate && globalView) {
                debounceApplyMarks(globalView)
            }
        },
        view: (view) => {
            globalView = view
            return {}
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
