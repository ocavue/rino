import { createNote, expectSignedIn, expectSignedOut, login, signOut } from "../actions"
import { click, getInnerText, goto, sleep, wait, waitAnimation } from "../utils"

const settingsBtn = "sidebar_btn_settings"
const settingsMenu = "sidebar_settings_menu"
const signOutBtn = "sidebar_settings_menu_item_sign_out"
const aboutBtn = "sidebar_settings_menu_item_about"

describe("Settings", () => {
    const openSettingsMenu = async () => {
        await waitAnimation(click(settingsBtn))
        await wait(settingsMenu)
    }
    const closeSettingsMenu = async () => {
        await waitAnimation(page.mouse.click(2, 2))
        await wait(settingsMenu, { state: "hidden" })
    }
    const clickSettingsMenuButton = async (btnTestId: string) => {
        await waitAnimation(click(settingsBtn))
        await waitAnimation(click(btnTestId))
        await wait(settingsMenu, { state: "hidden" })
    }

    describe("Open/close settings menu", () => {
        beforeAll(async () => {
            await jestPlaywright.resetBrowser()
            await login()
        })

        test("Except button exist", async () => {
            await goto("/")
            await wait(settingsBtn)
        })
        test("Click settings button", async () => {
            await goto("/")
            await openSettingsMenu()
            await closeSettingsMenu()
        })
    })

    describe("Sidebar settings sign in/out buttons", () => {
        beforeAll(async () => {
            await jestPlaywright.resetBrowser()

            // Parpare for the "clean" test case below
            await login()
            await createNote()
            await wait("sidebar_notes_list_item")
        })

        test("Signed in", async () => {
            await openSettingsMenu()
            await expectSignedIn()
            await wait(signOutBtn)
        })
        test("Click sign out button", async () => {
            await click(signOutBtn)
            await wait(settingsMenu, { state: "hidden" })
            await expectSignedOut()
        })
        test("Clean notes in the sidebar after signing out", async () => {
            await wait("sidebar_notes_list_item", { state: "hidden" })
        })
        test("Signed out", async () => {
            await waitAnimation(signOut(), 1000)
        })
    })

    describe("About", function () {
        beforeAll(async () => await jestPlaywright.resetBrowser())

        test("Open the dialog", async () => {
            await login()
            await clickSettingsMenuButton(aboutBtn)
            await wait("about_dialog")
        })

        test("Check version format", async () => {
            // Should be something like 'Version 0.23.4 (2fd4e1c)'
            expect(await getInnerText("about_dialog_version")).toEqual(expect.stringMatching(/^Version \d+\.\d+.\d+ \([0-9a-z]{7}\)$/))
        })

        test("Check copyright format", async () => {
            const year = new Date().getFullYear()
            const received = await getInnerText("about_dialog_copyright")
            const expected = `Copyright © ${year} Ocavue. All rights reserved.`
            expect(received).toEqual(expected)
        })

        test("Close the dialog", async () => {
            await sleep(500)
            await page.mouse.click(2, 2)
            await wait("about_dialog", { state: "hidden" })
        })
    })

    describe("Email", function () {
        beforeAll(async () => {
            await jestPlaywright.resetBrowser()
            await login()
        })

        test("Email", async () => {
            await waitAnimation(click(settingsBtn))
            const received = await getInnerText(signOutBtn)
            expect(received).toContain(process.env.REACT_APP_TEST_USERNAME)
        })
    })
})
