import { createStyles, makeStyles, Theme } from "@material-ui/core"

import { APPBAR_ICON_BUTTON_MARGIN,appbarHeight } from "src/constants""

export const useHeaderStyles = makeStyles((theme: Theme) => {
    return createStyles({
        drawerHeader: {
            padding: APPBAR_ICON_BUTTON_MARGIN,
            height: APPBAR_HEIGHT,
            minHeight: APPBAR_HEIGHT,
            display: "flex",
            justifyContent: "flex-end",
        },
        drawerHeaderButton: {},
    })
})

export const useBodyStyles = makeStyles((theme: Theme) => {
    return createStyles({
        drawerBody: {
            overflowX: "hidden",
            overflowY: "scroll",
        },
    })
})
