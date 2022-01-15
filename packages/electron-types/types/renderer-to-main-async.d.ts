// Sended by renderer process and recieved by main process, asynchronous

import { IpcMainInvokeEvent } from "electron"

import { VoidIfUndefined } from "./utils"

type RendererToMainAsyncApi = {
    openFile: (options: { path?: string }) => Promise<{ canceled: boolean; path: string; content: string }>

    saveFile: (options: { path: string; content: string }) => Promise<{ filePath?: string; canceled?: boolean }>

    askMarkdownFileForSave: () => Promise<{ filePath?: string; canceled?: boolean }>

    askMarkdownFileForClose: () => Promise<{ filePath?: string; canceled?: boolean; discarded?: boolean }>

    newWindow: () => Promise<void>

    getCurrentWindow: () => Promise<{ id: number; title: string } | null>

    setTitle: (options: { title: string }) => Promise<void>

    closeWindow: () => Promise<void>

    stopQuitting: () => Promise<void>
}

type ApiType = keyof RendererToMainAsyncApi

type ApiOption<T extends ApiType> = VoidIfUndefined<Parameters<RendererToMainAsyncApi[T]>[0]>

type ApiResult<T extends ApiType> = ReturnType<RendererToMainAsyncApi[T]>

export type IpcRendererAsyncSender = RendererToMainAsyncApi

export type IpcMainAsyncReceiver = {
    [T in ApiType]: (event: IpcMainInvokeEvent, options: ApiOption<T>) => ApiResult<T>
}
