import { registerAppHandlers, requestSingleApp } from "./app"
import { setupContextMenu } from "./context-menu"
import { registerIpcListeners } from "./ipc-main"
import { checkForUpdatesAutomatically } from "./updater"

function init() {
    if (!requestSingleApp()) return

    registerAppHandlers()

    registerIpcListeners()

    checkForUpdatesAutomatically()

    setupContextMenu()
}

init()
