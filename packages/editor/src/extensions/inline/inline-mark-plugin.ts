import { PlainExtension } from "@remirror/core"
import { EditorState, PluginSpec, Transaction } from "prosemirror-state"
import { EditorView } from "prosemirror-view"

import { applySelectionMarks, updateRangeMarks } from "./inline-mark-helpers"

function createInlineMarkPlugin(isUnitTest = false): PluginSpec<void> {
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    const debounceApplyMarks: (view: EditorView) => void = isUnitTest
        ? applySelectionMarks
        : (view: EditorView) => {
              if (timeoutId) {
                  clearTimeout(timeoutId)
              }
              timeoutId = setTimeout(() => {
                  applySelectionMarks(view)
                  timeoutId = null
              }, 100)
          }

    let globalView: EditorView | null = null

    const pluginSpec: PluginSpec<void> = {
        appendTransaction: (
            transactions: readonly Transaction[],
            oldState: EditorState,
            newState: EditorState,
        ): Transaction | undefined => {
            let shouldUpdate = false

            for (const tr of transactions) {
                if (tr.docChanged && !tr.getMeta("RINO_APPLY_MARKS")) {
                    shouldUpdate = true
                    break
                }
            }

            if (isUnitTest) {
                const tr = newState.tr
                updateRangeMarks(tr)
                return tr
            } else {
                if (shouldUpdate && globalView) {
                    debounceApplyMarks(globalView)
                }
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
    private isUnitTest: boolean

    public constructor(isUnitTest = false) {
        super()
        this.isUnitTest = isUnitTest
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
        return createInlineMarkPlugin(this.isUnitTest)
    }
}
