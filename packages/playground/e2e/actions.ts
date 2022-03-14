import { pressKey, sleep } from "./utils"

export async function switchMode() {
    await pressKey("Meta", "Slash")
    await sleep(500)
}
