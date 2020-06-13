import { goto, wait } from "./utils"

test("/web", async () => {
    await goto("/web")
    await wait("main")
    const url = new URL(page.url())
    expect(url.pathname).toEqual("/")
})
