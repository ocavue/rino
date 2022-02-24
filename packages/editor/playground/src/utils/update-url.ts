import { isString } from "lodash-es"

import { contentMap } from "../content"

interface URLOptions {
    contentId?: string
    enableDevTools?: boolean
}

export function getInitOptions() {
    const params = new URLSearchParams(document.location.search)
    let initContent = params.get("content")
    let initContentId = params.get("contentid")
    const initEnableDevTools = params.get("devtools") === "true"
    if (isString(initContent)) {
        // initialContent having priority over contentId
        contentMap["customize"] = initContent
        initContentId = "customize"
    }
    if (!(initContentId !== null && initContentId in contentMap)) {
        initContentId = "default"
    }
    initContent = contentMap[initContentId]
    return {
        initContentId,
        initContent,
        initEnableDevTools,
    }
}

export default function updateURLParams(options: URLOptions): void {
    const params = new URLSearchParams(document.location.search)
    if (options.contentId === undefined) {
        options.contentId = params.get("contentid") || "default"
    }
    if (options.enableDevTools === undefined) {
        options.enableDevTools = params.get("devtools") === "true"
    }
    const newParams = `?contentid=${options.contentId}&devtools=${options.enableDevTools ? "true" : "false"}`
    history.pushState(options, "", newParams)
}
