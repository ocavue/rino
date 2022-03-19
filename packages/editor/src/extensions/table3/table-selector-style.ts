import { injectGlobal as css } from "@emotion/css"

export function injectGlobalStyles() {
    css`
        .remirror-editor.ProseMirror .tableWrapper {
            overflow: visible;
        }

        .remirror-editor.ProseMirror table {
            overflow: visible;

            .remirror-table-selector {
                cursor: pointer;

                background-color: #e5e5e5;
                transition: background-color 0.15s ease-in-out;

                &:hover {
                    transition: background-color 0.05s ease-in-out;
                    background-color: #bbbbbb;
                }
            }

            .remirror-table-body-selector {
                position: absolute;
                width: 16px;
                height: 16px;
                top: -22px;
                left: -22px;
            }

            /* First implementation  */
            /* .remirror-table-row-selector {
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                width: 0;

                &::after {
                    background-color: red;
                    cursor: pointer;
                    position: absolute;
                    width: 16px;
                    top: 0;
                    bottom: 0;
                    left: -24px;
                    display: block;
                    content: "";
                }
            } */

            .remirror-table-row-selector {
                position: absolute;
                width: 16px;
                top: 0;
                bottom: 0;
                left: -22px;
            }

            /* Second implementation */
            .remirror-table-column-selector {
                position: absolute;
                height: 16px;
                left: 0;
                right: 0;
                top: -22px;
            }
        }
    `
}
