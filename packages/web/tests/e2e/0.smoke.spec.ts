/* Copyright (c) 2019-present ocavue@gmail.com */

import { login } from "./actions"
import { goto, wait } from "./utils"

beforeAll(async () => {
    await goto("/")
})

describe("before sign-in", function () {
    test("landing page", async () => {
        await wait("workspace")
    })
})

describe("after sign-in", function () {
    test("sign-in", async () => {
        await login()
    })

    test("core components", async function () {
        await wait("sidebar")
        await wait("appbar")
        await wait("main")
    })

    describe("HTML header", function () {
        test("title", async () => {
            await wait("main") // Wait the page
            expect(await page.title()).toEqual("Rino")
        })
    })
})
