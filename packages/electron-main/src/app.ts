import { app, Menu } from "electron"

import { buildApplicationMenu } from "./application-menu"
import { plateform } from "./env"
import { logger } from "./logger"
import { state } from "./state"
import { createWindow, createWindowByOpeningFile, createWindowIfNotExist } from "./window"

/**
 * Register all app handlers
 *
 * Closing window workflow
 *************************************************************************************
 * User closes all windows
 *           │
 *           ▼
 * "window-all-closed" is triggered
 *           │
 *           │
 * check if current OS is macOS ─────► yes
 *           │                          │
 *           ▼                          ▼
 *          no                      end the workflow and keep the app running
 *           │
 *           ▼
 * call "app.quit()" depend on OS
 *           │
 *           ▼
 * "before-quit" is triggered
 *           │
 *           ▼
 * "will-quit" is triggered
 *           │
 *           ▼
 * "quit" is triggered
 *************************************************************************************
 *
 *
 * Quitting workflow
 *************************************************************************************
 *  User quit the app
 *           │
 *           ▼
 *  "before-quit" is triggered. "state.isQuitting" is set as "true"
 *           │
 *           ▼
 *  All windows are closed one by one. The user might cancel the quitting
 *  process if there are unsaved changes.
 *           │
 *           ▼
 *  Does the user cancel the quitting? ─────────┐
 *           │                                  │
 *           ▼                                  ▼
 *          no                                 yes
 *           │                                  │
 *           │                                  ▼
 *           │       Call "stopQutting" IPC handler and reset "state.isQuitting" to "false"
 *           │
 *           ▼
 *  "window-all-closed" is triggered
 *           │
 *           ▼
 *  call "app.quit()" because "state.isQuitting" is "true"
 *           │
 *           ▼
 *  "before-quit" is triggered
 *           │
 *           ▼
 *  "will-quit" is triggered
 *           │
 *           ▼
 *  "quit" is triggered
 *************************************************************************************
 *
 * Notice that if "window-all-closed" handler is registered, then the app
 * will not continue the quitting process if you don't call "app.quit()"
 * inside the "window-all-closed" handler. That's clear from the Electron
 * docs.
 *
 */
export async function registerAppHandlers() {
    let openingFile = false

    app.on("will-finish-launching", () => {
        logger.info("app event triggered: will-finish-launching")
        app.on("open-file", (event, path) => {
            logger.info("event triggered: open-file", { path })
            openingFile = true
            event.preventDefault()
            createWindowByOpeningFile(path)
        })
    })

    app.on("activate", (event, hasVisibleWindows) => {
        logger.info("app event triggered: activate")
        if (!hasVisibleWindows) {
            createWindow()
        }
    })

    app.on("ready", () => {
        logger.info("app event triggered: ready", { openingFile })
        Menu.setApplicationMenu(buildApplicationMenu())
        if (!openingFile) {
            createWindowIfNotExist()
        }
    })

    app.on("window-all-closed", () => {
        logger.info("app event triggered: window-all-closed")
        if (!plateform.IS_MAC || state.isQuitting) {
            app.quit()
        }
    })

    app.on("before-quit", () => {
        logger.info("app event triggered: before-quit")
        state.isQuitting = true
    })

    app.on("will-quit", () => {
        logger.info("app event triggered: will-quit")
    })

    app.on("quit", () => {
        logger.info("app event triggered: quit")
    })
}
