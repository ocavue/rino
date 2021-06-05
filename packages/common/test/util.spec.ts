import { generateRandomId } from "../src"

test("generateRandomId", async () => {
    const id = generateRandomId()
    expect(id).toBeTruthy()
})
