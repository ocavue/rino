import { registerAppHandlers } from "./app"
import { setupAutoUpdate } from "./auto-update"
import { setupContextMenu } from "./context-menu"
import { registerIpcInvokeHandlers } from "./ipc-handlers"

async function init() {
    registerAppHandlers()

    registerIpcInvokeHandlers()

    setupAutoUpdate()

    setupContextMenu()
}

init()
