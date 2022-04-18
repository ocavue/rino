import { autoUpdate, flip, offset, useFloating } from "@floating-ui/react-dom"
import React, { useEffect, useLayoutEffect } from "react"

import { useCodeBlock } from "../../hooks/use-code-block"

const CodeLanguageInput: React.FC = () => {
    const { dom: codeBlock, language, setLanguage } = useCodeBlock()
    const { x, y, reference, floating, strategy, update, refs } = useFloating({
        placement: "top-end",
        middleware: [flip({ padding: 8 }), offset(4)],
    })

    useEffect(() => {
        if (!codeBlock || !refs.floating.current) {
            return
        }
        // Only call this when the floating element is rendered
        return autoUpdate(codeBlock, refs.floating.current, update)
    }, [refs.floating, update, reference, codeBlock])

    useLayoutEffect(() => {
        reference(codeBlock)
    }, [reference, codeBlock])

    return (
        <>
            {codeBlock ? (
                <input
                    ref={floating}
                    style={{
                        position: strategy,
                        zIndex: 1000,
                        top: y ? Math.round(y) : "",
                        left: x ? Math.round(x) : "",
                        color: "#abb2bf",
                        backgroundColor: "#282c34",
                        padding: "4px 4px",
                        borderRadius: "4px",
                        fontSize: "14px",
                        width: "150px",
                        textAlign: "center",
                        fontFamily: "monospace",
                        border: "none",
                        outlineColor: "#abb2bf",
                        outlineWidth: "thin",
                    }}
                    placeholder="Language"
                    value={language}
                    onChange={(event) => setLanguage(event.target.value)}
                />
            ) : null}
        </>
    )
}

const CodeLanguageSelect: React.FC = () => {
    return <CodeLanguageInput />
}

export default CodeLanguageSelect
