import { login, createNote, cleanNotes, deleteNote } from "./actions"
import { getAll, waitAnimation, click, wait, sleep } from "./utils"

describe("Delete notes", function() {
    async function expectNoteNumber(expected: number) {
        await sleep(500)
        const notes = await getAll("sidebar-notes-list-item")
        expect(notes).toHaveLength(expected)
    }

    test("Parapre enviorment", async () => {
        await login()
        await cleanNotes()
    })
    test("Parpare notes", async () => {
        await waitAnimation(createNote())
        await waitAnimation(createNote())
    })
    test("Verify initial note number", async () => {
        await wait("sidebar-notes-list-item")
        await expectNoteNumber(2)
    })
    test("Delete note A", async () => {
        await click("sidebar-notes-list-item")
        await waitAnimation(deleteNote(), 1000)
        await expectNoteNumber(1)
    })
    test("Delete note B", async () => {
        await click("sidebar-notes-list-item")
        await waitAnimation(deleteNote(), 1000)
        await expectNoteNumber(0)
    })
})
