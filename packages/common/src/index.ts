export function getHomeHostName(options?: { protocol?: boolean }) {
    let host = "www.rino.app"
    try {
        // TODO: SSR environment has not `window`
        const current = window.location.hostname
        if (current === "rino.app") host = "www.rino.app"
    } catch (error) {
        console.warn(error)
    }

    if (options?.protocol) {
        return "https://" + host
    } else {
        return host
    }
}

export function getWebAppHostName(options?: { protocol?: boolean }) {
    let host = "rino.app"
    try {
        const current = window.location.hostname
        if (current === "www.rino.app") host = "rino.app"
    } catch (error) {
        console.warn(error)
    }

    if (options?.protocol) {
        return "https://" + host
    } else {
        return host
    }
}
