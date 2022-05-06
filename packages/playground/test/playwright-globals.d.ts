/* eslint-disable @typescript-eslint/no-namespace */

import type Playwright from "playwright-chromium"

type Browser = Playwright.Browser
type Page = Playwright.Page

declare global {
    // I need to use var instead of let or const to make globalThis works
    // https://stackoverflow.com/a/69429093/9426588

    // eslint-disable-next-line no-var
    var browser: Browser
    // eslint-disable-next-line no-var
    var page: Page
}
