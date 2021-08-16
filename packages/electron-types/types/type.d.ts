import type { BrowserWindow, IpcMainInvokeEvent, IpcRendererEvent } from "electron"

export type AnyInvokeApi = {
    [channel: string]: (...params: any) => Promise<any>
}

export type AnySendApi = {
    [channel: string]: (...params: any) => void
}

type InvokeChannel<I extends AnyInvokeApi> = keyof I

type InvokeListener<I extends AnyInvokeApi, C extends InvokeChannel<I>> = (
    event: IpcMainInvokeEvent,
    ...args: Parameters<I[C]>
) => ReturnType<I[C]>

type SendChannel<S extends AnySendApi> = keyof S

type SendListener<S extends AnySendApi, C extends SendChannel<S>> = (event: IpcRendererEvent, ...args: Parameters<S[C]>) => void

export interface IpcRenderer<S extends AnySendApi, I extends AnyInvokeApi> {
    invoke<C extends keyof I>(channel: C, ...args: Parameters<I[C]>): Promise<ReturnType<I[C]>>

    on<C extends SendChannel<S>>(channel: C, listener: SendListener<S, C>): void

    removeListener<C extends SendChannel<S>>(channel: C, listener: SendListener<S, C>): void

    removeAllListeners<C extends SendChannel<S>>(channel: C): void
}

export interface IpcMain<S extends AnySendApi, I extends AnyInvokeApi> {
    send<C extends SendChannel<S>>(window: BrowserWindow, channel: C, ...args: Parameters<S[C]>): void

    handle<C extends InvokeChannel<I>>(channel: C, listener: InvokeListener<I, C>): void

    removeHandler<C extends InvokeChannel<I>>(channel: C): void
}

type SenderFunction<S extends AnySendApi, C extends SendChannel<S>> = (window: BrowserWindow, ...args: Parameters<S[C]>) => void

export type IpcInvoker<I extends AnyInvokeApi> = I

export type IpcSender<S extends AnySendApi> = {
    [C in SendChannel<S>]: SenderFunction<S, C>
}