import { expectSidebarClosed, expectSidebarOpened, login, signOut } from "../actions"
import { click, waitAnimation } from "../utils"

describe("Open/close Sidebar", () => {
    beforeAll(async () => await jestPlaywright.resetBrowser())

    describe("Before sign in", () => {
        test("Step 1", () => waitAnimation(signOut()))
    })

    describe("After sign in", () => {
        test("Step 1", () => waitAnimation(login()))
        test("Step 2", () => expectSidebarOpened())
        test("Step 3", () => waitAnimation(click("appbar_btn_menu")))
        test("Step 4", () => expectSidebarClosed())
        test("Step 5", () => waitAnimation(click("appbar_btn_menu")))
        test("Step 6", () => expectSidebarOpened())
    })
})
