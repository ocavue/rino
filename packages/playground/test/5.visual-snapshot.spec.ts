import { toMatchImageSnapshot } from "jest-image-snapshot"

import { switchToSourceCodeMode } from "./actions"
import { setupEditor } from "./utils"

expect.extend({ toMatchImageSnapshot })

const content = `# first heading in the document (zero margin-top)

A short paragraph.

A long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long paragraph.

- list
  ## heading in a list item (normal margin-top and margin-bottom)

> ### first heading in a blockquote (zero margin-top)
>
> ### second heading in a blockquote (normal margin-top and margin-bottom)
>
> ### last heading in a blockquote (zero margin-bottom)

## nested list

- [ ] task item
- [x] task item
  1. ordered item
  2. ordered item
     1. ordered item
     2. ordered item
     3. ordered item
        - bullet item
        - bullet item
        - bullet item
     4. ordered item
        - [x] task item
        - [x] task item
  3. ordered item
     - bullet item
     - bullet item
     - bullet item

`

describe(`OS - ${process.platform}`, () => {
    test("wysiwyg mode", async () => {
        await setupEditor(content)
        await page.focus(".blur-helper") // hide the cursor
        const screenshot = await page.screenshot({ type: "png", fullPage: true })
        expect(screenshot).toMatchImageSnapshot()
    })

    test("source code mode", async () => {
        await switchToSourceCodeMode()
        const screenshot = await page.screenshot({ type: "png", fullPage: true })
        expect(screenshot).toMatchImageSnapshot()
    })
})
