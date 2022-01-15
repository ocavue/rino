// Sended by renderer process and recieved by main process, synchronous

import { IpcMainEvent } from "electron"

import { VoidIfUndefined } from "./utils"

type RendererToMainSyncApi = {
    askMarkdownFileForSaveSync: () => { filePath?: string; canceled?: boolean }

    askBeforeDeleteSync: () => { result: "save" | "delete" | "cancel" }
}

type ApiType = keyof RendererToMainSyncApi

type ApiOption<T extends ApiType> = VoidIfUndefined<Parameters<RendererToMainSyncApi[T]>[0]>

type ApiResult<T extends ApiType> = ReturnType<RendererToMainSyncApi[T]>

export type IpcRendererSyncSender = RendererToMainSyncApi

export type IpcMainSyncListener = {
    [T in ApiType]: (event: IpcMainEvent, options: ApiOption<T>) => ApiResult<T>
}
