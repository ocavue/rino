import { useEffect, useRef } from "react"

import { IpcRendererListener } from "@rino.app/electron-types"

import { ipcRenderer } from "../ipc-renderer"

export function useIpcRendererListener(listener: IpcRendererListener) {
    const ipcRendererReceiver = useRef<IpcRendererListener>(listener)
    ipcRendererReceiver.current = listener

    useEffect(() => {
        ipcRenderer.on("MAIN_TO_RENDEREER", (event, type: keyof IpcRendererListener, options: any) => {
            return ipcRendererReceiver.current[type](options)
        })
        return () => {
            ipcRenderer.removeAllListeners("MAIN_TO_RENDEREER")
        }
    }, [])
}
