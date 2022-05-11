import { afterAll } from "vitest"

import { collectJSCoverage, startJSCoverage } from "./coverage"

beforeAll(async () => {
    await startJSCoverage()
})

afterAll(async () => {
    await collectJSCoverage()
})
