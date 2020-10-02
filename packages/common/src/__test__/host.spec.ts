import { getHomeHostName, getWebAppHostName } from "../host"

test("getHomeHostName", async () => {
    for (const [protocol, currentHostName, expectedOutput] of [
        [true, "whatever", "https://whatever"],
        [true, "rino.app", "https://www.rino.app"],
        [true, "www.rino.app", "https://www.rino.app"],
        [true, "???.rino.app", "https://???.rino.app"],
        [false, "rino-web-my-branch.ocavue.vercel.app", "rino-home-my-branch.ocavue.vercel.app"],
        [false, "rino-home-my-branch.ocavue.vercel.app", "rino-home-my-branch.ocavue.vercel.app"],
    ] as const) {
        expect(getHomeHostName({ currentHostName, protocol })).toEqual(expectedOutput)
    }
})

test("getWebAppHostName", async () => {
    for (const [protocol, currentHostName, expectedOutput] of [
        [true, "whatever", "https://whatever"],
        [true, "rino.app", "https://rino.app"],
        [true, "www.rino.app", "https://rino.app"],
        [true, "???.rino.app", "https://???.rino.app"],
        [false, "rino-web-my-branch.ocavue.vercel.app", "rino-web-my-branch.ocavue.vercel.app"],
        [false, "rino-home-my-branch.ocavue.vercel.app", "rino-web-my-branch.ocavue.vercel.app"],
    ] as const) {
        expect(getWebAppHostName({ currentHostName, protocol })).toEqual(expectedOutput)
    }
})
