interface URLOptions {
    contentId?: string
    enableDevTools?: boolean
}
export default function updateURLParams(o: URLOptions): void {
    const params = new URLSearchParams(document.location.search)
    if (o.contentId === undefined) {
        o.contentId = params.get("contentid") || "default"
    }
    if (o.enableDevTools === undefined) {
        o.enableDevTools = params.get("devtools") === "true"
    }
    const newParams = `?contentid=${o.contentId}&devtools=${o.enableDevTools ? "true" : "false"}`
    history.pushState(o, "", newParams)
}
