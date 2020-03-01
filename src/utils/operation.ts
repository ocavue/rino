export function all(items: any[]) {
    for (const item of items) {
        if (!item) return false
    }
    return true
}

export function any(items: any[]) {
    for (const item of items) {
        if (item) return true
    }
    return false
}
