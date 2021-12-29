import { EditorView, findParentNodeOfType } from "@remirror/core"

import { fakeIndentedLanguage } from "."
import { allLanguages } from "./codemirror-languages"

const languageNames = allLanguages.map((language) => language.name)
const lowerCaseLanguageNames: Record<string, string> = {}
languageNames.forEach((name) => {
    lowerCaseLanguageNames[name.toLowerCase()] = name
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
        const language = lowerCaseLanguageNames[input.value.toLowerCase()]
        if (language) {
            setLanguage(language)
        }
    })
    return input
}

function createLanguageMenuPositioner(currentLanguage: string, setLanguage: SetLanguage) {
    const div = document.createElement("div")
    div.className = "language-menu-positioner"
    div.appendChild(createInput(currentLanguage, setLanguage))
    div.appendChild(createDatalist())
    return div
}

export function createLanguageMenu(view: EditorView): HTMLElement {
    const found = findParentNodeOfType({ types: "codeMirror", selection: view.state.selection })

    let currentLanguage = found?.node.attrs.language || ""
    if (currentLanguage === fakeIndentedLanguage) {
        currentLanguage = ""
    }

    const setLanguage = (language: string) => {
        found && view.dispatch(view.state.tr.setNodeMarkup(found.pos, undefined, { language }))
    }

    return createLanguageMenuPositioner(currentLanguage, setLanguage)
}
