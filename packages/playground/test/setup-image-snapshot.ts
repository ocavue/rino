/* eslint-disable @typescript-eslint/no-namespace */

// @ts-expect-error: jest-image-snapshot doesn't have built-in types
import { toMatchImageSnapshot } from "jest-image-snapshot"

expect.extend({ toMatchImageSnapshot })

declare global {
    namespace jest {
        interface Matchers<R> {
            toMatchImageSnapshot(): R
        }
    }
}
