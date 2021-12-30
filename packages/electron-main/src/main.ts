import { registerAppHandlers } from "./app"
import { setupContextMenu } from "./context-menu"
import { registerIpcInvokeHandlers } from "./ipc-handlers"
import { checkForUpdatesAutomatically } from "./updater"

async function init() {
    registerAppHandlers()

    registerIpcInvokeHandlers()

    checkForUpdatesAutomatically()

    setupContextMenu()
}

init()
