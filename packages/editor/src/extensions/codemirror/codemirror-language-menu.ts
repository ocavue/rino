import { computePosition, flip, offset } from "@floating-ui/dom"
import { EditorView, ProsemirrorNode } from "@remirror/core"

import { fakeIndentedLanguage } from "./code-mirror-const"
import { allLanguages } from "./codemirror-languages"

const languageNames = allLanguages.map((language) => language.name)
const lowerCaseLanguageNameMap: Record<string, string> = {}

languageNames.forEach((name) => {
    lowerCaseLanguageNameMap[name.toLowerCase()] = name
})

type SetLanguage = (language: string) => void

function createDatalist() {
    const datalist = document.createElement("datalist")
    datalist.id = "language-list"

    languageNames.forEach((name) => {
        const optionEl = document.createElement("option")
        optionEl.value = name
        datalist.appendChild(optionEl)
    })
    return datalist
}

function createInput(currentLanguage: string, setLanguage: SetLanguage) {
    const input = document.createElement("input")
    input.type = "text"
    input.setAttribute("list", "language-list")
    input.setAttribute("class", "language-menu")
    input.placeholder = "Language"
    input.value = currentLanguage
    input.addEventListener("blur", () => {
        setLanguage(input.value)
    })
    input.addEventListener("input", () => {
        const language = lowerCaseLanguageNameMap[input.value.toLowerCase()]
        if (language) {
            setLanguage(language)
        }
    })
    input.style.position = "absolute"
    input.style.visibility = "hidden" // stay hidden until the position is calculated
    return input
}

function createReference() {
    const div = document.createElement("div")
    div.className = "language-menu-positioner"
    return div
}

export function setupLanguageMenu(node: ProsemirrorNode) {
    let updatePosition: null | (() => void) = null

    const create = (view: EditorView, getPos: () => number): HTMLElement => {
        let currentLanguage = node.attrs.language || ""
        if (currentLanguage === fakeIndentedLanguage) {
            currentLanguage = ""
        }

        const setLanguage = (language: string) => {
            view.dispatch(view.state.tr.setNodeMarkup(getPos(), undefined, { language }))
        }

        const reference = createReference()
        const input = createInput(currentLanguage, setLanguage)
        const datalist = createDatalist()

        reference.appendChild(input)
        reference.appendChild(datalist)

        updatePosition = () => {
            // If the language menu is not yet mounted, the position will be wrong.
            if (!reference.parentElement) {
                return
            }

            computePosition(reference, input, {
                placement: "top-end",
                middleware: [offset(8), flip()],
            }).then(({ x, y }) => {
                Object.assign(input.style, {
                    left: `${x}px`,
                    top: `${y}px`,
                    visibility: "visible",
                })
            })
        }

        if (reference.parentElement) {
            updatePosition()
        } else {
            setTimeout(updatePosition, 100)
        }

        window.addEventListener("resize", updatePosition)

        return reference
    }

    const destroy = (): void => {
        if (updatePosition) {
            window.removeEventListener("resize", updatePosition)
        }
    }

    return [create, destroy] as const
}
