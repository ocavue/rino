import { expectSidebarClosed, expectSidebarOpened, login, signOut } from "../actions"
import { click, wait, waitAnimation } from "../utils"

describe("Open/close Sidebar", () => {
    beforeAll(async () => await jestPuppeteer.resetBrowser())

    describe("Before sign in", () => {
        test("Step 1", () => waitAnimation(signOut()))
        test("Step 2", () => waitAnimation(wait("appbar-btn-menu", { visible: false })))
    })

    describe("After sign in", () => {
        test("Step 1", () => waitAnimation(login()))
        test("Step 2", () => expectSidebarOpened())
        test("Step 3", () => waitAnimation(click("appbar-btn-menu")))
        test("Step 4", () => expectSidebarClosed())
        test("Step 5", () => waitAnimation(click("appbar-btn-menu")))
        test("Step 6", () => expectSidebarOpened())
    })
})
