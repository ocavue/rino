import { cleanNotes, createNote, deleteNote, login, signOut } from "./actions"
import { click, getAll, sleep, wait, waitAnimation } from "./utils"

async function getNoteNumber() {
    await sleep(500)
    const notes = await getAll("sidebar-notes-list-item")
    return notes.length
}

async function expectNoteNumber(expected: number) {
    expect(await getNoteNumber()).toEqual(expected)
}

describe("Delete user notes", function() {
    test("Parapre enviorment", async () => {
        await login()
        await cleanNotes()
        await sleep(1000)
    })
    test("Parpare notes", async () => {
        await waitAnimation(createNote())
        await waitAnimation(createNote())
    })
    test("Delete note A", async () => {
        await wait("sidebar-notes-list-item")
        const notes = await getNoteNumber()
        expect(notes).toBeGreaterThanOrEqual(1)

        await click("sidebar-notes-list-item")
        await waitAnimation(deleteNote(), 1000)
        await expectNoteNumber(notes - 1)
    })
})

describe("Delete premade notes", function() {
    test("Parapre enviorment", async () => {
        await signOut()
    })
    test("Verify initial note number", async () => {
        await wait("sidebar-notes-list-item")
        await expectNoteNumber(2)
        await sleep(500)
    })
    test("Delete note A", async () => {
        await click("sidebar-notes-list-item")
        await waitAnimation(deleteNote(), 1000)
        await expectNoteNumber(1)
    })
})
