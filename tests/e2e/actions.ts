import { range } from "lodash"
import { wait, goto, click, getOne, sleep, pressKey, focus } from "./utils"

export async function expectSignedIn() {
    return await wait("sidebar-notes-btn-create-note")
}

export async function login() {
    await goto("/dev/login") // Auto login in test environment
    await expectSignedIn()
}

export async function createNote() {
    await click("sidebar-notes-btn-create-note")
}

export async function createEmptyNote() {
    await createNote()
    await focus("wysiwyg-mode-textarea")
    range(5).map(async () => await pressKey("Backspace"))
}

export async function deleteNote() {
    await click("appbar-btn-dots")
    await sleep(50)
    await click("appbar-menu-item-delete")
}

export async function clickSidebarNoteListItem() {
    await click("sidebar-notes-list-item")
}

export async function cleanNotes() {
    while (await getOne("sidebar-notes-list-item")) {
        await clickSidebarNoteListItem()
        await sleep(50)
        await deleteNote()
        await sleep(50)
    }
}
