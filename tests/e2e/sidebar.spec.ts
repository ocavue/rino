import { goto, click, wait } from "./utils"
import { login } from "./actions"

describe("Sidebar", () => {
    const expectSidebarOpened = async () => wait("sidebar", { visible: true })
    const expectSidebarClosed = async () => wait("sidebar", { visible: false })

    test("Before login", async () => {
        await goto("/")

        await expectSidebarOpened()
        await click("appbar-btn-menu")
        await expectSidebarClosed()
        await click("appbar-btn-menu")
        await expectSidebarOpened()
    })

    test("After login", async () => {
        await goto("/")
        await login()

        await expectSidebarOpened()
        await click("appbar-btn-menu")
        await expectSidebarClosed()
        await click("appbar-btn-menu")
        await expectSidebarOpened()
    })
})
