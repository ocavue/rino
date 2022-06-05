import { expect, test } from "vitest"

import { generateRandomId } from "./generate-random-id"

test("generateRandomId", async () => {
    const id = generateRandomId()
    expect(id).toBeTruthy()
})
