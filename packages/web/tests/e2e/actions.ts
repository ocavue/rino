import { range } from "lodash"

import { click, focus, goto, pressKey, retry, sleep, wait } from "./utils"

async function isSignedIn(): Promise<boolean> {
    const state = await page.evaluate(() => localStorage.getItem("__rino_dev_auth_state"))
    return state === "authed"
}

export async function expectSignedIn() {
    const isExpected = async () => !!(await isSignedIn())
    const isExpectedAfterRetry = await retry(isExpected, 15000)
    expect(isExpectedAfterRetry).toBe(true)
}

export async function expectSignedOut() {
    const isExpected = async () => !(await isSignedIn())
    const isExpectedAfterRetry = await retry(isExpected)
    expect(isExpectedAfterRetry).toBe(true)
}

export async function login() {
    await goto("/dev/sign-in") // Auto login in test environment
    await wait("main") // Return home page
    await expectSignedIn()
}
export async function signOut() {
    await goto("/dev/sign-out")
    await wait("homepage_root") // Return home page
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
    await click("note-menu-item-delete")
}

export async function clickSidebarNoteListItem() {
    await click("sidebar-notes-list-item")
}

export async function cleanNotes() {
    await goto("/dev/clean-notes")
    await wait("main") // Return to home page
}

export async function switchMode() {
    await pressKey("Meta", "Slash")
    await sleep(500)
}

export async function expectSidebarOpened() {
    return await page.waitForSelector(".drawer--open")
}

export async function expectSidebarClosed() {
    return await page.waitForSelector(".drawer--close")
}
