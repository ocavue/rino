import { createStyles, IconButton, withStyles } from "@material-ui/core"

import { appbarIconButtonSize } from "src/constants"

export const AppbarIconButton = withStyles(
    createStyles({
        root: {
            width: appbarIconButtonSize,
            height: appbarIconButtonSize,
        },
    }),
)(IconButton)
