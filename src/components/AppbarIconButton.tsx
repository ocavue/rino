import { IconButton, createStyles, withStyles } from "@material-ui/core"
import { appbarIconSize } from "src/constants"

const iconSize = 24
export const AppbarIconButton = withStyles(
    createStyles({
        root: {
            paddingTop: (appbarIconSize - iconSize) / 2,
            width: appbarIconSize,
            height: appbarIconSize,
        },
    }),
)(IconButton)
