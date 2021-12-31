import { app, BrowserWindow, Menu, MenuItemConstructorOptions } from "electron"

import { COMMIT_SHA, plateform } from "./env"
import { exportToPDF } from "./export-to-pdf"
import { askMarkdownFileForOpen } from "./file"
import { ipcSender } from "./ipc-main"
import { checkForUpdatesManually } from "./updater"
import { createWindow, createWindowByOpeningFile } from "./window"

const enum MemuId {
    ExportToPdf = "EXPORT_TO_PDF",
}

let menu: Menu | null = null

export function buildApplicationMenu(): Menu {
    // set the options for the "about" menu
    app.setAboutPanelOptions({
        applicationName: "Rino",
        applicationVersion: plateform.IS_MAC ? `Version ${app.getVersion()}` : `Version ${app.getVersion()} - ${COMMIT_SHA}`,
        version: COMMIT_SHA,
        copyright: `Copyright © ${new Date().getFullYear()} ocavue`,
        website: "https://rino.app",
    })

    const macMenu: MenuItemConstructorOptions = {
        label: "Rino",
        submenu: [
            { role: "about" },
            {
                label: "Check for Updates",
                click: async () => {
                    await checkForUpdatesManually()
                },
            },
            { type: "separator" },
            { role: "services" },
            { type: "separator" },
            { role: "hide" },
            { role: "unhide" },
            { type: "separator" },
            { role: "quit" },
        ],
    }

    const reloadMenu: MenuItemConstructorOptions = {
        role: "reload",
    }

    const toggleDevToolsMenu: MenuItemConstructorOptions = {
        role: "toggleDevTools",
    }

    menu = Menu.buildFromTemplate([
        ...(plateform.IS_MAC ? [macMenu] : []),
        {
            label: "File",
            submenu: [
                {
                    label: "New",
                    accelerator: "CommandOrControl+N",
                    click: async () => {
                        await createWindow()
                    },
                },
                {
                    type: "separator",
                },
                {
                    label: "Open",
                    accelerator: "CommandOrControl+O",
                    click: async () => {
                        const path = await askMarkdownFileForOpen()
                        if (!path) return
                        await createWindowByOpeningFile(path)
                    },
                },
                {
                    type: "separator",
                },
                {
                    label: "Save",
                    accelerator: "CommandOrControl+S",
                    click: async (_, win) => {
                        if (win) {
                            ipcSender.ensureFilePath(win)
                        }
                    },
                },
                {
                    type: "separator",
                },
                {
                    role: "close",
                },
                { type: "separator" },
                {
                    label: "Export as PDF",
                    id: MemuId.ExportToPdf,
                    click: async (_, win) => {
                        if (win) {
                            await exportToPDF(win)
                        }
                    },
                },
            ],
        },
        {
            label: "Edit",
            submenu: [
                {
                    role: "copy",
                    accelerator: "CommandOrControl+C",
                },
                {
                    role: "paste",
                    accelerator: "CommandOrControl+V",
                },
                {
                    role: "selectAll",
                    accelerator: "CommandOrControl+A",
                },
            ],
        },
        {
            label: "View",
            submenu: [reloadMenu, toggleDevToolsMenu],
        },
    ])

    return menu
}

export function updateApplicationMenu() {
    if (!menu) return

    const exportToPdfMenuItem = menu.getMenuItemById(MemuId.ExportToPdf)
    if (exportToPdfMenuItem) {
        const hasFocusedWindow = !!BrowserWindow.getFocusedWindow()
        exportToPdfMenuItem.enabled = hasFocusedWindow
    }
}
