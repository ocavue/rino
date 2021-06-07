import { Menu, MenuItemConstructorOptions } from "electron"

import { askMarkdownFileForOpen, askMarkdownFileForSave } from "./file"
import { isMac } from "./platform"
import { createWindow, createWindowByOpeningFile } from "./window"

export function buildApplicationMenu() {
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

    return Menu.buildFromTemplate([
        ...(isMac ? [macMenu] : []),
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
                { type: "separator" },
                {
                    label: "Open",
                    accelerator: "CommandOrControl+O",
                    click: async () => {
                        const path = await askMarkdownFileForOpen()
                        if (!path) return
                        await createWindowByOpeningFile(path)
                    },
                },
                { type: "separator" },
                {
                    label: "Save",
                    accelerator: "CommandOrControl+S",
                    click: async (_, win) => {
                        const path = await askMarkdownFileForSave()
                        if (!path) return
                        win?.webContents.send("send:setNotePath", { path })
                    },
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
    ])
}
