const PREVIEW_URL_RE = /^(rino-)(web|home|server)(-(?:[^.]*).ocavue.vercel.app)$/

export function getCurrentHostName() {
    if (typeof window !== "undefined") {
        // for SSR environment
        return window?.location?.hostname
    } else {
        return ""
    }
}

export function getHomeHostName(options?: { protocol?: boolean }) {
    const prefix = options?.protocol ? "https://" : ""
    const productionHost = "www.rino.app"

    try {
        const current = getCurrentHostName()
        if (current === "rino.app") {
            return prefix + productionHost
        } else {
            return prefix + current.replace(PREVIEW_URL_RE, "$1home$3")
        }
    } catch (error) {
        console.error(error)
    }

    return "www.rino.app"
}

export function getWebAppHostName(options?: { protocol?: boolean }) {
    const prefix = options?.protocol ? "https://" : ""
    const productionHost = "rino.app"

    try {
        const current = getCurrentHostName()
        if (current === "www.rino.app") {
            return prefix + productionHost
        } else {
            return prefix + current.replace(PREVIEW_URL_RE, "$1web$3")
        }
    } catch (error) {
        console.error(error)
    }

    return "rino.app"
}
