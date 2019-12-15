import { goto, click, wait, sleep, getInnerText, waitAnimation } from "./utils"
import { login, signOut, createNote, cleanNotes, clickSidebarNoteListItem } from "./actions"

import { mobileBreakPoint, sidebarWidth } from "@/constants"

const settingsBtn = "sidebar-btn-settings"
const settingsMenu = "sidebar-settings-menu"
const signOutBtn = "sidebar-settings-menu-item-sign-out"
const signInBtn = "sidebar-settings-menu-item-sign-in"

const expectSidebarOpened = async () => await page.waitForSelector(".v-navigation-drawer--open")
const expectSidebarClosed = async () => await page.waitForSelector(".v-navigation-drawer--close")

describe("Open/close Sidebar", () => {
    beforeAll(async () => await jestPuppeteer.resetBrowser())

    test("Before sign in", async () => {
        await goto("/")
        await signOut()

        await expectSidebarOpened()
        await click("appbar-btn-menu")
        await expectSidebarClosed()
        await click("appbar-btn-menu")
        await expectSidebarOpened()
    })

    test("After sign in", async () => {
        await goto("/")
        await login()
        await expectSidebarOpened()
        await click("appbar-btn-menu")
        await expectSidebarClosed()
        await click("appbar-btn-menu")
        await expectSidebarOpened()
    })
})

const openSettingsMenu = async () => {
    await click(settingsBtn)
    await sleep(500)
    await wait(settingsMenu)
}
const closeSettingsMenu = async () => {
    await page.mouse.click(2, 2)
    await sleep(200)
    await wait(settingsMenu, { hidden: true })
}

describe("Sidebar settings menu", () => {
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

describe("Sidebar settings sign in / sign out buttons", () => {
    beforeAll(async () => await jestPuppeteer.resetBrowser())

    const expectSignedIn = async () => {
        await goto("/")
        await openSettingsMenu()
        await wait(signOutBtn)
        await wait(signInBtn, { hidden: true })
        await closeSettingsMenu()
    }
    const expectSignedOut = async () => {
        await goto("/")
        await openSettingsMenu()
        await wait(signInBtn)
        await wait(signOutBtn, { hidden: true })
        await closeSettingsMenu()
    }
    const clickSettingsMenuButton = async (btnTestId: string) => {
        await click(settingsBtn)
        await sleep(500)
        await click(btnTestId)
        await wait(settingsMenu, { hidden: true })
    }

    test("Before sign in", async () => {
        await signOut()
        await sleep(1000)
        await expectSignedOut()
        await sleep(1000)
        await expectSignedOut()
    })

    test("Sign in", async () => {
        await expectSignedOut()
        await sleep(1000)
        await clickSettingsMenuButton(signInBtn)
        await wait("login-form-card")
    })

    test("Before sign out", async () => {
        await login()
        await sleep(1000)
        await expectSignedIn()
    })

    test("Sign out", async () => {
        await expectSignedIn()
        await clickSettingsMenuButton(signOutBtn)
        await expectSignedOut()
    })

    test("Clean notes after sign out", async () => {
        // Create a note
        await login()
        await expectSignedIn()
        await createNote()
        await wait("sidebar-notes-list-item")

        // Sign out
        await clickSettingsMenuButton(signOutBtn)
        await expectSignedOut()

        // Expect that there is not note
        await wait("sidebar-notes-list-item", { hidden: true, visible: false })
    })
})

describe("About", function() {
    beforeAll(async () => await jestPuppeteer.resetBrowser())

    test("Open the dialog", async () => {
        await goto("/")
        await click("sidebar-btn-settings")
        await sleep(200)
        await click("sidebar-settings-menu-item-about")
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

describe("Click sidebar in small screen", function() {
    beforeAll(async () => {
        await jestPuppeteer.resetBrowser()
        await login()
        await createNote()
    })
    afterAll(async () => await cleanNotes())

    const height = 800
    const testSmallScreen = async (width: number) => {
        // await jestPuppeteer.resetPage()
        await waitAnimation(page.setViewport({ width, height }))
        await expectSidebarClosed()
        await waitAnimation(click("appbar-btn-menu"))
        await expectSidebarOpened()
        await waitAnimation(clickSidebarNoteListItem())
        await expectSidebarClosed()
    }
    const testLargeScreen = async (width: number) => {
        // await jestPuppeteer.resetPage()
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
