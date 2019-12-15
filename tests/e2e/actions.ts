import { range } from "lodash"
import { goto, click, getOne, sleep, pressKey, focus } from "./utils"

async function isSignedIn(): Promise<boolean> {
    const state = await page.evaluate(() => localStorage.getItem("__rino_dev_auth_state"))
    return state === "yes"
}

export async function expectSignedIn() {
    expect(await isSignedIn()).toEqual(true)
}

export async function expectSignedOut() {
    expect(await isSignedIn()).toEqual(false)
}

export async function login() {
    await goto("/dev/login") // Auto login in test environment
    await expectSignedIn()
}
export async function signOut() {
    await goto("/dev/signout")
    await expectSignedOut()
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
