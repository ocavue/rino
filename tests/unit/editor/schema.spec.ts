import { def, nodes } from "./base"

describe("schema", function () {
    describe("types", function () {
        for (const key of Object.keys(def) as Array<keyof typeof def>) {
            it(`key: ${key}`, function () {
                expect(typeof nodes[key]).toBe("function")
            })
        }
    })
})
