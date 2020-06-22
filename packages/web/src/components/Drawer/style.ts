import { createStyles, makeStyles, Theme } from "@material-ui/core"

import { appbarHeight, appbarIconMargin } from "src/constants"

export const useHeaderStyles = makeStyles((theme: Theme) => {
    return createStyles({
        drawerHeader: {
            padding: appbarIconMargin,
            height: appbarHeight,
            minHeight: appbarHeight,
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
