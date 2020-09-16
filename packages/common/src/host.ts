export function getCurrentHostName() {
    // TODO: SSR environment has not `window`
    if (typeof window !== "undefined") {
        return window?.location?.hostname
    } else {
        return ""
    }
}

// function getHomeHostFromAppHost(appHost: string) {
//     const defaultHost = "www.rino.app"

//     if (appHost == "rino.app") return defaultHost

//     let matched = /^(rino-app)(.*\.com)$/.exec(appHost)
//     if (matched) return "rino-home" + matched[2]

//     matched = /^(rino-app)(.*\.app)$/.exec(appHost)
//     if (matched) return "rino-home" + matched[2]

//     return defaultHost
// }

export function getHomeHostName(options?: { protocol?: boolean }) {
    let host = "www.rino.app"
    try {
        const current = getCurrentHostName()
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
        const current = getCurrentHostName()
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
