import { PlainExtension } from "@remirror/core"
import { EditorState, PluginSpec, Transaction } from "prosemirror-state"
import { EditorView } from "prosemirror-view"

import { applyRangeMarks, updateRangeMarks } from "./inline-mark-helpers"

function createInlineMarkPlugin(isUnitTest = false, isDestroyedRef: { val: boolean }): PluginSpec {
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    const debounceApplyMarks: (view: EditorView) => void = isUnitTest
        ? applyRangeMarks
        : (view: EditorView) => {
              if (timeoutId) {
                  clearTimeout(timeoutId)
              }
              timeoutId = setTimeout(() => {
                  if (!isDestroyedRef.val) {
                      applyRangeMarks(view)
                  }
                  timeoutId = null
              }, 100)
          }

    let globalView: EditorView | null = null

    const pluginSpec: PluginSpec = {
        appendTransaction: (transactions: Array<Transaction>, oldState: EditorState, newState: EditorState): Transaction | void => {
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
    private isDestroyedRef: { val: boolean }

    public constructor(isUnitTest = false) {
        super()
        this.isUnitTest = isUnitTest
        this.isDestroyedRef = { val: false }
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
        return createInlineMarkPlugin(this.isUnitTest, this.isDestroyedRef)
    }

    onDestroy() {
        this.isDestroyedRef.val = true
    }
}
