import { test } from "vitest"

import { editorReducer } from "./editor-state"

test("editorReducer", () => {
    expect(() => {
        // @ts-expect-error test wrong params
        editorReducer(null as any, { type: "WRONG_TYPE" })
    }).toThrowError("Unknown action type")
})
