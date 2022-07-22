import { css } from "@emotion/css"
import { extensionListStyledCss } from "@remirror/styles/emotion"

export const EDITOR_THEME_BASE = css`
    ${extensionListStyledCss}

    /**
     * disable margin-collapsing https://stackoverflow.com/a/19719427
     */
    flex-direction: column;
    display: flex;

    & li {
        position: relative;
    }

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
        padding-bottom: 64px;

        /**
         * The maximum width of the content area (e.g. a paragraph) is 800px, but the padding
         * around the content area is also clickable and the mouse cursor over the whole
         * editor area is a "text" cursor.
         */
        padding-left: max(32px, calc(50% - 400px));
        padding-right: max(32px, calc(50% - 400px));
    }

    /**
     * remove the default outline
     */
    & .ProseMirror-focused {
        outline: none;
    }
`
