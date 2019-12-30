import { range } from "lodash"
import { wait, goto, click, sleep, pressKey, focus, retry } from "./utils"

async function isSignedIn(): Promise<boolean> {
    const state = await page.evaluate(() => localStorage.getItem("__rino_dev_auth_state"))
    return state === "yes"
}

export async function expectSignedIn() {
    const isExpected = async () => (await isSignedIn()) === true
    const isExpectedAfterRetry = await retry(isExpected, 15000)
    expect(isExpectedAfterRetry).toBe(true)
}

export async function expectSignedOut() {
    const isExpected = async () => (await isSignedIn()) === false
    const isExpectedAfterRetry = await retry(isExpected)
    expect(isExpectedAfterRetry).toBe(true)
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
    await goto("/dev/clean-notes")
    await wait("main") // Return home page
}
