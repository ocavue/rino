import { range } from "lodash"
import { wait, goto, click, getOne, sleep, pressKey, focus } from "./utils"

export async function expectSignedIn() {
    return await wait("sidebar-btn-create-note")
}

export async function login() {
    await goto("/dev/login") // Auto login in test environment
    await expectSignedIn()
}

export async function createNote() {
    await click("sidebar-btn-create-note")
}

export async function createEmptyNote() {
    await click("sidebar-btn-create-note")
    await focus("wysiwyg-mode-textarea")
    range(5).map(async () => await pressKey("Backspace"))
}

export async function deleteNote() {
    await click("appbar-btn-dots")
    await sleep(50)
    await click("appbar-menu-item-delete")
}

export async function cleanNotes() {
    while (await getOne("sidebar-list-item")) {
        await click("sidebar-list-item")
        await sleep(50)
        await deleteNote()
        await sleep(50)
    }
}
