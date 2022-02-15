import contextMenu from "electron-context-menu"

export function setupContextMenu() {
    contextMenu({
        showSaveImageAs: true,
    })
}
