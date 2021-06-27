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
    min-height: 100%;
    & .ProseMirror {
        min-height: 100%;
    }

    /**
     * add padding to the editor
     *
     * you may want to add something like this in the theme css：
     *
     *   & :first-child {
     *       margin-top: 0;
     *   }
     *
     *   & :last-child {
     *       margin-bottom: 0;
     *   }
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
