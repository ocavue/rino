/* Copyright (c) 2020-present ocavue@gmail.com */

const PREVIEW_URL_RE = /^(rino-)(web|home|server)(-?(?:[^.]*).ocavue.vercel.app)$/

export function getCurrentHostName() {
    if (typeof window !== "undefined") {
        // for SSR environment
        return window?.location?.hostname
    } else {
        return ""
    }
}

export function getHomeHostName(currentHostName?: string) {
    const prefix = "https://"
    const defaultHost = "www.rino.app"

    try {
        const current = currentHostName || getCurrentHostName()
        if (current === "rino.app") {
            return prefix + defaultHost
        } else {
            return prefix + current.replace(PREVIEW_URL_RE, "$1home$3")
        }
    } catch (error) {
        console.error(error)
    }

    return prefix + defaultHost
}

export function getWebAppHostName(currentHostName?: string) {
    const prefix = "https://"
    const defaultHost = "rino.app"

    try {
        const current = currentHostName || getCurrentHostName()
        if (current === "www.rino.app") {
            return prefix + defaultHost
        } else {
            return prefix + current.replace(PREVIEW_URL_RE, "$1web$3")
        }
    } catch (error) {
        console.error(error)
    }

    return prefix + defaultHost
}
