export function setURLParam(key: string, value: string): void {
    const params = new URLSearchParams(document.location.search)
    params.set(key, value)
    const search = "?" + params.toString()
    history.pushState("", "", search)
}

export function getURLParam(key: string, defaultValue: string): string {
    const params = new URLSearchParams(document.location.search)
    return params.get(key) || defaultValue
}
