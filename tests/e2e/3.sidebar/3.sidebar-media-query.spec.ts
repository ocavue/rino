import {
    cleanNotes,
    clickSidebarNoteListItem,
    createNote,
    expectSidebarClosed,
    expectSidebarOpened,
    login,
} from "../actions"
import { click, waitAnimation } from "../utils"

import { mobileBreakPoint, drawerWidth as sidebarWidth } from "src/constants"

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

    for (const width of [
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

    for (const width of [
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
