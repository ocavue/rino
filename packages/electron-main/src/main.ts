import { registerAppHandlers } from "./app"
import { setupContextMenu } from "./context-menu"
import { registerIpcListeners } from "./ipc-main"
import { checkForUpdatesAutomatically } from "./updater"

function init() {
    registerAppHandlers()

    registerIpcListeners()

    checkForUpdatesAutomatically()

    setupContextMenu()
}

init()
