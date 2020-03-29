import { createStyles, makeStyles, Theme } from "@material-ui/core"

import { appbarIconMargin } from "src/constants"

export const useHeaderStyles = makeStyles((theme: Theme) => {
    return createStyles({
        drawerHeader: {
            padding: appbarIconMargin,
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
