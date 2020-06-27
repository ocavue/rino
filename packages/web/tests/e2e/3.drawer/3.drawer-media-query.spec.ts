import { MAX_DRAWER_WIDTH, MOBILE_BREAK_POINT } from "src/constants"

import {
    cleanNotes,
    clickSidebarNoteListItem,
    createNote,
    expectSidebarClosed,
    expectSidebarOpened,
    login,
} from "../actions"
import { click, getDimensions, waitAnimation } from "../utils"

const height = 800

describe("Drawer type (persistent / temporary)", function () {
    beforeAll(async () => {
        await jestPuppeteer.resetBrowser()
        await login()
        await createNote()
    })
    afterAll(async () => await cleanNotes())

    for (const width of [
        MAX_DRAWER_WIDTH - 10,
        MAX_DRAWER_WIDTH,
        MAX_DRAWER_WIDTH + 10,
        MOBILE_BREAK_POINT - 200,
        MOBILE_BREAK_POINT - 3,
        MOBILE_BREAK_POINT - 2,
        MOBILE_BREAK_POINT - 1,
    ]) {
        test(`Small screen ${width}px`, async () => {
            expect(width).toBeLessThan(MOBILE_BREAK_POINT)

            // Exepect the drawer is persistent
            await waitAnimation(page.setViewport({ width, height }))
            await expectSidebarClosed()
            await waitAnimation(click("appbar-btn-menu"))
            await expectSidebarOpened()
            await waitAnimation(clickSidebarNoteListItem())
            await expectSidebarClosed()
        })
    }

    test("Don't open the drawer when window size increase", async () => {
        await expectSidebarClosed()
        await waitAnimation(page.setViewport({ width: MOBILE_BREAK_POINT + 10, height }))
        await expectSidebarClosed()
    })

    test("Toggle the drawer", async () => {
        await expectSidebarClosed()
        await waitAnimation(click("appbar-btn-menu"))
        await expectSidebarOpened()
    })

    for (const width of [
        MOBILE_BREAK_POINT + 0,
        MOBILE_BREAK_POINT + 1,
        MOBILE_BREAK_POINT + 2,
        MOBILE_BREAK_POINT + 200,
        MOBILE_BREAK_POINT * 2,
    ]) {
        test(`Large screen ${width}px`, async () => {
            expect(width).toBeGreaterThanOrEqual(MOBILE_BREAK_POINT)

            // Exepect the drawer is temporary
            await waitAnimation(page.setViewport({ width, height }))
            await expectSidebarOpened()
            await waitAnimation(clickSidebarNoteListItem())
            await expectSidebarOpened()
        })
    }
})

describe("Drawer width", function () {
    beforeAll(async () => {
        await login()
    })

    test("Small screen", async () => {
        const clientWidth = MAX_DRAWER_WIDTH - 100
        await waitAnimation(page.setViewport({ width: clientWidth, height }))
        await waitAnimation(page.reload())
        await expectSidebarClosed()
        await waitAnimation(click("appbar-btn-menu"))
        await expectSidebarOpened()
        const dimensions = await getDimensions("sidebar")
        expect(dimensions.width).toBeWithin(clientWidth - 49, clientWidth - 47)
    })
    test("Middle screen", async () => {
        await waitAnimation(page.setViewport({ width: MOBILE_BREAK_POINT - 10, height }))
        await waitAnimation(page.reload())
        await expectSidebarClosed()
        await waitAnimation(click("appbar-btn-menu"))
        await expectSidebarOpened()
        const dimensions = await getDimensions("sidebar")
        expect(dimensions.width).toBeWithin(MAX_DRAWER_WIDTH - 1, MAX_DRAWER_WIDTH + 1)
    })
    test("Large screen", async () => {
        await waitAnimation(page.setViewport({ width: MOBILE_BREAK_POINT + 10, height }))
        await waitAnimation(page.reload())
        await expectSidebarOpened()
        const dimensions = await getDimensions("sidebar")
        expect(dimensions.width).toBeWithin(MAX_DRAWER_WIDTH - 1, MAX_DRAWER_WIDTH + 1)
    })
})
