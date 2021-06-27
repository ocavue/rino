import { css } from "@emotion/css"
import { extensionListStyledCss } from "@remirror/styles/emotion"

export const EDITOR_THEME_BASE = css`
    ${extensionListStyledCss}

    /**
     * disable margin-collapsing https://stackoverflow.com/a/19719427
     */
    flex-direction: column;
    display: flex;

    /**
     * extend to full height
     */
    flex-grow: 1;
    & .ProseMirror {
        flex-grow: 1;
    }

    /**
     * add padding to the editor
     */
    & .ProseMirror {
        padding-top: 32px;
        padding-left: 32px;
        padding-right: 32px;
        padding-bottom: 64px;
    }

    /**
     * remove the default outline
     */
    & .ProseMirror-focused {
        outline: none;
    }
`
