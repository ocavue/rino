import { cleanNotes, createNote, deleteNote, login } from "./actions"
import { click, getAll, sleep, wait, waitAnimation } from "./utils"

async function getNoteNumber(local = false) {
    await sleep(500)
    const notes = await getAll(local ? "sidebar-notes-list-item-local" : "sidebar-notes-list-item")
    return notes.length
}

async function expectNoteNumber(expected: number, local = false) {
    expect(await getNoteNumber(local)).toEqual(expected)
}

describe("Delete user notes", function () {
    test("Parapre enviorment", async () => {
        await login()
        await cleanNotes()
        await sleep(1000)
    })
    test("Parpare notes", async () => {
        await waitAnimation(createNote())
        await waitAnimation(createNote())
        await wait("sidebar-notes-list-item")
        await wait("sidebar-notes-list-item-local", { visible: false, hidden: true })
    })
    test("Delete note A", async () => {
        const notes = await getNoteNumber()
        expect(notes).toBeGreaterThanOrEqual(1)

        await click("sidebar-notes-list-item")
        await waitAnimation(deleteNote(), 1000)
        await expectNoteNumber(notes - 1)
    })
})
