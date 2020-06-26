import { goto, wait } from "./utils"

test("/web", async () => {
    await goto("/web")
    await wait("landing", { timeout: 20000 })
    const url = new URL(page.url())
    expect(url.pathname).toEqual("/")
})
