import {
    cleanNotes,
    clickSidebarNoteListItem,
    createNote,
    expectSidebarClosed,
    expectSidebarOpened,
} from "../actions"
import { click, getDimensions, goto, waitAnimation } from "../utils"

import { maxDrawerWidth, mobileBreakPoint } from "src/constants"

const height = 800

describe("Drawer type (persistent / temporary)", function() {
    beforeAll(async () => {
        await jestPuppeteer.resetBrowser()
        await goto("/")
        await createNote()
    })
    afterAll(async () => await cleanNotes())

    const testSmallScreen = async (width: number) => {
        // Exepect the drawer is persistent
        await waitAnimation(page.setViewport({ width, height }))
        await expectSidebarClosed()
        await waitAnimation(click("appbar-btn-menu"))
        await expectSidebarOpened()
        await waitAnimation(clickSidebarNoteListItem())
        await expectSidebarClosed()
    }
    const testLargeScreen = async (width: number) => {
        // Exepect the drawer is temporary
        await waitAnimation(page.setViewport({ width, height }))
        await expectSidebarOpened()
        await waitAnimation(clickSidebarNoteListItem())
        await expectSidebarOpened()
    }

    for (const width of [
        maxDrawerWidth - 10,
        maxDrawerWidth,
        maxDrawerWidth + 10,
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

describe("Drawer width", function() {
    beforeAll(async () => {
        await goto("/")
    })

    test("Small screen", async () => {
        const clientWidth = maxDrawerWidth - 100
        await waitAnimation(page.setViewport({ width: clientWidth, height }))
        await waitAnimation(page.reload())
        await expectSidebarClosed()
        await waitAnimation(click("appbar-btn-menu"))
        await expectSidebarOpened()
        const dimensions = await getDimensions("sidebar")
        expect(dimensions.width).toBeWithin(clientWidth - 49, clientWidth - 47)
    })
    test("Middle screen", async () => {
        await waitAnimation(page.setViewport({ width: mobileBreakPoint - 10, height }))
        await waitAnimation(page.reload())
        await expectSidebarClosed()
        await waitAnimation(click("appbar-btn-menu"))
        await expectSidebarOpened()
        const dimensions = await getDimensions("sidebar")
        expect(dimensions.width).toBeWithin(maxDrawerWidth - 1, maxDrawerWidth + 1)
    })
    test("Large screen", async () => {
        await waitAnimation(page.setViewport({ width: mobileBreakPoint + 10, height }))
        await waitAnimation(page.reload())
        await expectSidebarOpened()
        const dimensions = await getDimensions("sidebar")
        expect(dimensions.width).toBeWithin(maxDrawerWidth - 1, maxDrawerWidth + 1)
    })
})
