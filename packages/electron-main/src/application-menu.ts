import { app, Menu, MenuItemConstructorOptions } from "electron"

import { COMMIT_SHA, plateform } from "./env"
import { askMarkdownFileForOpen } from "./file"
import { ipcSender } from "./ipc-main"
import { createWindow, createWindowByOpeningFile } from "./window"

export function buildApplicationMenu() {
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

    return Menu.buildFromTemplate([
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
            ],
        },
        {
            label: "Edit",
            submenu: [
                {
                    label: "Copy",
                    role: "copy",
                    accelerator: "CommandOrControl+C",
                },
                {
                    label: "Paste",
                    role: "paste",
                    accelerator: "CommandOrControl+V",
                },
            ],
        },
        {
            label: "View",
            submenu: [reloadMenu, toggleDevToolsMenu],
        },
    ])
}
