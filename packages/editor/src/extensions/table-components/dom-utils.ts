type ElementEventHandlers = Partial<
    Omit<GlobalEventHandlers, "addEventListener" | "addEventListener" | "removeEventListener" | "removeEventListener">
>

type ElementAttributes = ElementEventHandlers | Record<string, string>

export function createElement<TagName extends keyof HTMLElementTagNameMap>(
    tagName: TagName,
    attributes?: ElementAttributes | null,
    ...children: Array<HTMLElement | string>
) {
    const element = document.createElement(tagName)
    if (attributes) {
        Object.entries(attributes).forEach(([key, value]) => {
            if (typeof value === "string") {
                element.setAttribute(key, value)
            } else {
                element[key as keyof ElementEventHandlers] = value
            }
        })
    }
    if (children.length) {
        element.append(...children)
    }
    return element
}

export function isTableCellElement(el: Element | null | undefined): el is HTMLTableCellElement {
    if (!el) {
        return false
    }
    return el.nodeName === "TD" || el.nodeName === "TH"
}
