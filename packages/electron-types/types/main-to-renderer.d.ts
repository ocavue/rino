// Sended by main process and received by renderer process

import type { BrowserWindow } from "electron"

import type { ToggleableInlineMarkName } from "@rino.app/editor"

import { VoidIfUndefined } from "./utils"

type MainToRendererApi = {
    openFile: (options: { path: string; content: string }) => void

    ensureFilePath: () => void

    setNotePath: (options: { path: string }) => void

    beforeCloseWindow: () => void

    beforeExportToPdf: () => void

    toggleInlineMark: (options: { mark: ToggleableInlineMarkName }) => void
}

type ApiType = keyof MainToRendererApi

type ApiOption<T extends ApiType> = VoidIfUndefined<Parameters<MainToRendererApi[T]>[0]>

export type IpcMainSender = {
    [T in ApiType]: (window: BrowserWindow, options: ApiOption<T>) => void
}

export type IpcRendererListener = MainToRendererApi
