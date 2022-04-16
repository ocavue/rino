import React from "react"

import { useCodeBlock } from "../../hooks/use-code-block"

const CodeLanguageInput: React.FC = () => {
    const { dom: reference, language, setLanguage } = useCodeBlock()

    if (reference) {
        const { top, left, right, bottom } = reference.getBoundingClientRect()
        console.log("[CodeLanguageSelect] referance:", { top, left, right, bottom })
        console.log("[CodeLanguageSelect] language:", language)
    }

    return (
        <div>
            <input placeholder="Language" value={language} onChange={(event) => setLanguage(event.target.value)} />
        </div>
    )
}

const CodeLanguageSelect: React.FC = () => {
    return <CodeLanguageInput />
}

export default CodeLanguageSelect
