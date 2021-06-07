import { Menu, MenuItemConstructorOptions } from "electron"

import { env, plateform } from "./env"
import { askMarkdownFileForOpen, askMarkdownFileForSave } from "./file"
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

    const reloadMenu: MenuItemConstructorOptions = {
        role: "reload",
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
                ...(env.IS_PROD ? [] : [reloadMenu]),
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
