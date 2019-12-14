import { goto, click, wait, sleep } from "./utils"
import { login, createNote } from "./actions"

const settingsBtn = "sidebar-btn-settings"
const settingsMenu = "sidebar-settings-menu"
const signOutBtn = "sidebar-settings-menu-item-sign-out"
const signInBtn = "sidebar-settings-menu-item-sign-in"

const openSettingsMenu = async () => {
    await click(settingsBtn)
    await sleep(500)
    await wait(settingsMenu)
}
const closeSettingsMenu = async () => {
    await page.mouse.click(1, 1)
    await wait(settingsMenu, { hidden: true })
}

describe("Sidebar settings menu", () => {
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
    const expectSignIn = async () => {
        await goto("/")
        await openSettingsMenu()
        await wait(signOutBtn)
        await wait(signInBtn, { hidden: true })
        await click(settingsBtn)
        await closeSettingsMenu()
    }
    const expectSignOut = async () => {
        await goto("/")
        await openSettingsMenu()
        await wait(signInBtn)
        await wait(signOutBtn, { hidden: true })
        await click(settingsBtn)
        await closeSettingsMenu()
    }
    const clickSettingsMenuButton = async (btnTestId: string) => {
        await click(settingsBtn)
        await sleep(500)
        await click(btnTestId)
        await wait(settingsMenu, { hidden: true })
    }

    test("Sign in", async () => {
        await expectSignOut()
        await Promise.all([
            page.waitForNavigation({ waitUntil: "networkidle2" }),
            clickSettingsMenuButton(signInBtn),
        ])
        const url = await page.url()
        expect(url).toMatch(/^http(s)?\:\/\/.*\/login$/)
        await login()
        await goto("/")
        await expectSignIn()
    })

    test("Sign out", async () => {
        await login()
        await goto("/")
        await expectSignIn()
        await clickSettingsMenuButton(signOutBtn)
        await expectSignOut()
    })

    test("Clean notes after sign out", async () => {
        // Create a note
        await login()
        await expectSignIn()
        await createNote()
        await wait("sidebar-notes-list-item")

        // Sign out
        await clickSettingsMenuButton(signOutBtn)
        await expectSignOut()

        // Expect that there is not note
        await wait("sidebar-notes-list-item", { hidden: true, visible: false })
    })
})

describe("Open/close Sidebar", () => {
    const expectSidebarOpened = async () => wait("sidebar", { visible: true })
    const expectSidebarClosed = async () => wait("sidebar", { visible: false })

    test("Before sign in", async () => {
        await goto("/")

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
