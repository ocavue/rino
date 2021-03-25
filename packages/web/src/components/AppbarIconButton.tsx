/* Copyright (c) 2020-present ocavue@gmail.com */

import { createStyles, IconButton, withStyles } from "@material-ui/core"

import { APPBAR_ICON_BUTTON_SIZE, APPBAR_ICON_SIZE } from "src/constants"

const AppbarIconButton = withStyles(
    createStyles({
        root: {
            width: APPBAR_ICON_BUTTON_SIZE,
            height: APPBAR_ICON_BUTTON_SIZE,
            padding: (APPBAR_ICON_BUTTON_SIZE - APPBAR_ICON_SIZE) / 2,
        },
    }),
)(IconButton)

export default AppbarIconButton
