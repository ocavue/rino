import { expectSourceCodeMode, expectWysiwygMode, pressKey } from "./utils"

export async function switchMode() {
    await pressKey("Meta", "Slash")
}

export async function switchToSourceCodeMode() {
    await switchMode()
    await expectSourceCodeMode()
}

export async function switchToWysiwygMode() {
    await switchMode()
    await expectWysiwygMode()
}
