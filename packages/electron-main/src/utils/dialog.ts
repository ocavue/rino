import { BrowserWindow, dialog, MessageBoxOptions } from "electron"

export async function showMessageBoxOnFocusedWindow(options: MessageBoxOptions) {
    const currentWindow = BrowserWindow.getFocusedWindow()
    if (currentWindow) {
        return await dialog.showMessageBox(currentWindow, options)
    } else {
        return await dialog.showMessageBox(options)
    }
}
