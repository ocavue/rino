// Use "required" instead of "import" here because of https://github.com/sindresorhus/electron-context-menu/issues/148
// eslint-disable-next-line @typescript-eslint/no-var-requires
const contextMenu = require("electron-context-menu")

export function setupContextMenu() {
    contextMenu({
        showSaveImageAs: true,
    })
}
