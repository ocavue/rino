import { goto } from "./utils"

describe("Network environment", () => {
    test("Bing", async () => await goto("https://bing.com", { timeout: 20_000 }))
    test("Google", async () => await goto("https://google.com", { timeout: 20_000 }))
})
