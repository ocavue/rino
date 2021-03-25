/* Copyright (c) 2019-present ocavue@gmail.com */

import { goto, wait } from "./utils"

test("404 page", async () => {
    await goto("/this-page-does-not-exist")
    await wait("alert_404")
})
