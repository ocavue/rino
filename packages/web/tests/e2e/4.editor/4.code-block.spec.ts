import { dedent } from "@rino.app/common"

import { createNote, login, switchMode } from "../actions"
import { getSourceCodeModeText, pressKey, type as typeByTestid } from "../utils"

beforeAll(async () => {
    await login()
})

async function type(text: string, pressEnter = true) {
    await typeByTestid("wysiwyg_mode_textarea", text, pressEnter)
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
