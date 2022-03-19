import { injectGlobal as css } from "@emotion/css"

export function injectGlobalStyles() {
    css`
        .remirror-editor.ProseMirror .tableWrapper {
            overflow: visible;
        }

        .remirror-editor.ProseMirror table {
            overflow: visible;

            .remirror-table-selector {
                background-color: #e5e5e5;
            }

            .remirror-table-body-selector {
                background: lightblue;
                position: absolute;
                width: 16px;
                height: 16px;
                top: -24px;
                left: -24px;
            }

            /* First implementation  */
            .remirror-table-row-selector {
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
            }

            /* Second implementation */
            .remirror-table-column-selector {
                cursor: pointer;
                position: absolute;
                height: 16px;
                left: 0;
                right: 0;
                top: -24px;
            }
        }
    `
}
