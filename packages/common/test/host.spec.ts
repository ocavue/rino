import { getHomeHostName, getWebAppHostName } from "../src/host"

test("getHomeHostName", async () => {
    for (const [currentHostName, expectedOutput] of [
        ["whatever", "https://whatever"],
        ["rino.app", "https://www.rino.app"],
        ["www.rino.app", "https://www.rino.app"],
        ["???.rino.app", "https://???.rino.app"],
        ["rino-web-my-branch.ocavue.vercel.app", "https://rino-home-my-branch.ocavue.vercel.app"],
        ["rino-home-my-branch.ocavue.vercel.app", "https://rino-home-my-branch.ocavue.vercel.app"],
        ["rino-web.ocavue.vercel.app", "https://rino-home.ocavue.vercel.app"],
        ["rino-home.ocavue.vercel.app", "https://rino-home.ocavue.vercel.app"],
    ] as const) {
        expect(getHomeHostName(currentHostName)).toEqual(expectedOutput)
    }
})

test("getWebAppHostName", async () => {
    for (const [currentHostName, expectedOutput] of [
        ["whatever", "https://whatever"],
        ["rino.app", "https://rino.app"],
        ["www.rino.app", "https://rino.app"],
        ["???.rino.app", "https://???.rino.app"],
        ["rino-web-my-branch.ocavue.vercel.app", "https://rino-web-my-branch.ocavue.vercel.app"],
        ["rino-home-my-branch.ocavue.vercel.app", "https://rino-web-my-branch.ocavue.vercel.app"],
        ["rino-web.ocavue.vercel.app", "https://rino-web.ocavue.vercel.app"],
        ["rino-home.ocavue.vercel.app", "https://rino-web.ocavue.vercel.app"],
    ] as const) {
        expect(getWebAppHostName(currentHostName)).toEqual(expectedOutput)
    }
})
