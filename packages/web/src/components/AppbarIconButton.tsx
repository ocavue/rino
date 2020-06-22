import { createStyles, IconButton, withStyles } from "@material-ui/core"

import { appbarIconButtonSize, appbarIconSize } from "src/constants"

export const AppbarIconButton = withStyles(
    createStyles({
        root: {
            width: appbarIconButtonSize,
            height: appbarIconButtonSize,
            padding: (appbarIconButtonSize - appbarIconSize) / 2,
        },
    }),
)(IconButton)
