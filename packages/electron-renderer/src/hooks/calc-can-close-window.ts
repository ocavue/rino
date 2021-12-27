import type { WorkbenchState } from "./use-workbench/use-workbench"

export function calcCanCloseWindow(state: WorkbenchState): boolean {
    if (state.contentDiscarded) return true

    return !state.isSaving && !state.isSerializing && !state.hasUnsavedChanges && !!state.path
}
