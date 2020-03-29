import { createStyles, IconButton, withStyles } from "@material-ui/core"

import { appbarIconButtonSize, iconSize } from "src/constants"

export const AppbarIconButton = withStyles(
    createStyles({
        root: {
            paddingTop: (appbarIconButtonSize - iconSize) / 2,
            width: appbarIconButtonSize,
            height: appbarIconButtonSize,
        },
    }),
)(IconButton)
