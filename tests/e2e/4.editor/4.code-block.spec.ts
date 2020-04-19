import { dedent } from "src/utils"

import { createNote, switchMode } from "../actions"
import { getSourceCodeModeText, goto, pressKey, type as typeByTestid } from "../utils"

beforeAll(async () => {
    await goto("/")
})

async function type(text: string, pressEnter = true) {
    await typeByTestid("wysiwyg-mode-textarea", text, pressEnter)
}

describe("Empty languange", () => {
    test("Code block", async () => {
        await createNote()
        await type("```")
        await type("code")
        await type("code", false)
        await pressKey("Shift", "Enter")
        await type("")
    })

    test("Check result", async () => {
        await switchMode() // Switch to the source code mode
        const received = await getSourceCodeModeText()
        expect(received).toBe(
            dedent(`
                \`\`\`
                code
                code
                \`\`\`

                `).trimStart(),
        )
    })
})

describe("Not-exist languange", () => {
    test("Code block", async () => {
        await createNote()
        await type("```thislanguagedoesnotexist")
        await type("code")
        await type("code", false)
        await pressKey("Shift", "Enter")
        await type("")
    })

    test("Check result", async () => {
        await switchMode() // Switch to the source code mode
        const received = await getSourceCodeModeText()
        expect(received).toBe(
            dedent(`
                \`\`\`thislanguagedoesnotexist
                code
                code
                \`\`\`

                `).trimStart(),
        )
    })
})

describe("Normal language", () => {
    test("Code block", async () => {
        await createNote()
        await type("```python")
        await type("code")
        await type("code", false)
        await pressKey("Shift", "Enter")
        await type("")
    })

    test("Check result", async () => {
        await switchMode() // Switch to the source code mode
        const received = await getSourceCodeModeText()
        expect(received).toBe(
            dedent(`
                \`\`\`python
                code
                code
                \`\`\`

                `).trimStart(),
        )
    })
})
