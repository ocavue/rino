function createElement<K extends keyof HTMLElementTagNameMap>(
    tagName: K,
    attributes: Record<string, string>,
    ...children: HTMLElement[]
): HTMLElementTagNameMap[K]
function createElement(tagName: string, attributes: Record<string, string>, ...children: HTMLElement[]): HTMLElement {
    const element = document.createElement(tagName)
    for (const [key, value] of Object.entries(attributes)) {
        element.setAttribute(key, value)
    }
    for (const child of children) {
        element.appendChild(child)
    }
    return element
}

export { createElement }
