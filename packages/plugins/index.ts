import { Plugin } from "prosemirror-state"
import { history } from "prosemirror-history"
import { gapCursor } from "prosemirror-gapcursor"
import { dropCursor } from "prosemirror-dropcursor"

import { buildKeymaps } from "./src/keymap"
import { buildMdInputRules } from "./src/input-rule"
import { addGitHubMarkdownCssClass } from "./src/class"
import { decorationPlugin } from "./src/decoration"

export const proseMirrorPlugins: Plugin[] = [
    history(),
    dropCursor(),
    gapCursor(), // TODO You'll probably want to load style/gapcursor.css, which contains basic styling for the simulated cursor (as a short, blinking horizontal stripe).
    ...buildKeymaps(),
    buildMdInputRules(),
    addGitHubMarkdownCssClass(),
    decorationPlugin,
]
