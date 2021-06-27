import { toMatchImageSnapshot } from "jest-image-snapshot"

import { switchMode } from "./actions"

expect.extend({ toMatchImageSnapshot })

import { setupEditor } from "./utils"

const content = `# first heading in the document (zero margin-top)

- list
  ## heading in a list item (normal margin-top and margin-bottom)

> ### first heading in a quotablock (zero margin-top)
>
> ### second heading in a quotablock (normal margin-top and margin-bottom)
>
> ### last heading in a quotablock (zero margin-bottom)

`

test("default", async () => {
    await setupEditor(content)
    await page.focus(".blur-helper") // hide the cursor

    expect(await page.screenshot()).toMatchImageSnapshot()

    await switchMode()
    await page.focus(".blur-helper")
    expect(await page.screenshot()).toMatchImageSnapshot()
})
