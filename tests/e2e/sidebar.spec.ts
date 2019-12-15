import { goto, click, wait, sleep, getInnerText, waitAnimation, retry } from "./utils"
import {
    login,
    signOut,
    createNote,
    cleanNotes,
    clickSidebarNoteListItem,
    expectSignedIn,
    expectSignedOut,
} from "./actions"

import { mobileBreakPoint, sidebarWidth } from "@/constants"

const settingsBtn = "sidebar-btn-settings"
const settingsMenu = "sidebar-settings-menu"
const signOutBtn = "sidebar-settings-menu-item-sign-out"
const signInBtn = "sidebar-settings-menu-item-sign-in"
const aboutBtn = "sidebar-settings-menu-item-about"

const expectSidebarOpened = async () => await page.waitForSelector(".v-navigation-drawer--open")
const expectSidebarClosed = async () => await page.waitForSelector(".v-navigation-drawer--close")

describe("Open/close Sidebar", () => {
    beforeAll(async () => await jestPuppeteer.resetBrowser())

    test("Before sign in", async () => {
        await waitAnimation(signOut())
        await expectSidebarOpened()
        await waitAnimation(click("appbar-btn-menu"))
        await expectSidebarClosed()
        await waitAnimation(click("appbar-btn-menu"))
        await expectSidebarOpened()
    })

    test("After sign in", async () => {
        await waitAnimation(login())
        await expectSidebarOpened()
        await waitAnimation(click("appbar-btn-menu"))
        await expectSidebarClosed()
        await waitAnimation(click("appbar-btn-menu"))
        await expectSidebarOpened()
    })
})

describe("Settings", () => {
    const openSettingsMenu = async () => {
        await waitAnimation(click(settingsBtn))
        await wait(settingsMenu)
    }
    const closeSettingsMenu = async () => {
        await waitAnimation(page.mouse.click(2, 2))
        await wait(settingsMenu, { hidden: true })
    }
    const clickSettingsMenuButton = async (btnTestId: string) => {
        await waitAnimation(click(settingsBtn))
        await waitAnimation(click(btnTestId))
        await wait(settingsMenu, { hidden: true })
    }

    describe("Open/close settings menu", () => {
        beforeAll(async () => await jestPuppeteer.resetBrowser())

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
            await jestPuppeteer.resetBrowser()

            // Parpare for the "clean" test case below
            await login()
            await createNote()
            await wait("sidebar-notes-list-item")
        })

        test("Signed in", async () => {
            await openSettingsMenu()
            await expectSignedIn()
            await wait(signOutBtn)
        })
        test("Click sign out button", async () => {
            await click(signOutBtn)
            await expectSignedOut()
        })
        test("Clean notes in the sidebar after signing out", async () => {
            await wait("sidebar-notes-list-item", { hidden: true, visible: false })
        })
        test("Signed out", async () => {
            await waitAnimation(signOut(), 1000)
            await openSettingsMenu()
            await expectSignedOut()
            await wait(signInBtn)
        })
        test("Click sign in button", async () => {
            const url = new URL(await page.url())
            const signInUrl = url.origin + "/login"
            await click(signInBtn)
            const checkCallback = async () => signInUrl === (await page.url())
            expect(await retry(checkCallback)).toBe(true)
        })
    })

    describe("About", function() {
        beforeAll(async () => await jestPuppeteer.resetBrowser())

        test("Open the dialog", async () => {
            await goto("/")
            await clickSettingsMenuButton(aboutBtn)
            await wait("about-dialog")
        })

        test("Check version format", async () => {
            // Should be something like 'Version 0.23.4 (2fd4e1c)'
            const received = await getInnerText("about-dialog-version")
            const expected = expect.stringMatching(/^Version \d+\.\d+.\d+ \([0-9a-z]{7}\)$/)
            expect(received).toEqual(expected)
        })

        test("Check copyright format", async () => {
            const year = new Date().getFullYear()
            const received = await getInnerText("about-dialog-copyright")
            const expected = `Copyright © ${year} Ocavue. All rights reserved.`
            expect(received).toEqual(expected)
        })

        test("Close the dialog", async () => {
            await sleep(500)
            await page.mouse.click(2, 2)
            await wait("about-dialog", { hidden: true })
        })
    })
})

describe("Click sidebar note item in different screen sizes", function() {
    beforeAll(async () => {
        await jestPuppeteer.resetBrowser()
        await login()
        await createNote()
    })
    afterAll(async () => await cleanNotes())

    const height = 800
    const testSmallScreen = async (width: number) => {
        await waitAnimation(page.setViewport({ width, height }))
        await expectSidebarClosed()
        await waitAnimation(click("appbar-btn-menu"))
        await expectSidebarOpened()
        await waitAnimation(clickSidebarNoteListItem())
        await expectSidebarClosed()
    }
    const testLargeScreen = async (width: number) => {
        await waitAnimation(page.setViewport({ width, height }))
        await expectSidebarOpened()
        await waitAnimation(clickSidebarNoteListItem())
        await expectSidebarOpened()
    }

    for (let width of [
        sidebarWidth - 10,
        sidebarWidth,
        sidebarWidth + 10,
        mobileBreakPoint - 200,
        mobileBreakPoint - 3,
        mobileBreakPoint - 2,
        mobileBreakPoint - 1,
    ]) {
        test(`Small screen ${width}px`, async () => {
            expect(width).toBeLessThan(mobileBreakPoint)
            await testSmallScreen(width)
        })
    }

    for (let width of [
        mobileBreakPoint + 0,
        mobileBreakPoint + 1,
        mobileBreakPoint + 2,
        mobileBreakPoint + 200,
        mobileBreakPoint * 2,
    ]) {
        test(`Large screen ${width}px`, async () => {
            expect(width).toBeGreaterThanOrEqual(mobileBreakPoint)
            await testLargeScreen(width)
        })
    }
})
