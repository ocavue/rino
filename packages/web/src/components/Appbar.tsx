import { AppBar, createStyles, makeStyles, Theme } from "@material-ui/core"
import { fade } from "@material-ui/core/styles/colorManipulator"
import * as icons from "@material-ui/icons"
import clsx from "clsx"
import React from "react"

import { AppbarIconButton } from "src/components/AppbarIconButton"
import { NoteMenu } from "src/components/NoteMenu"
import { APPBAR_HEIGHT, APPBAR_ICON_BUTTON_MARGIN, MAX_DRAWER_WIDTH } from "src/constants"
import { EditContainer } from "src/controller"
import { StoreContainer } from "src/store"
const useStyles = makeStyles((theme: Theme) => {
    return createStyles({
        appBar: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
            height: APPBAR_HEIGHT,
            transition: theme.transitions.create(["margin", "width"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            pointerEvents: "none",
            // backgroundColor: "rgba(100,200,100,0.4)", // for debug
            backgroundColor: "rgba(200,200,200,0.0)",
        },
        appBarShift: {
            [theme.breakpoints.up("md")]: {
                width: `calc(100% - ${MAX_DRAWER_WIDTH}px)`,
                marginLeft: MAX_DRAWER_WIDTH,
                transition: theme.transitions.create(["margin", "width"], {
                    easing: theme.transitions.easing.easeOut,
                    duration: theme.transitions.duration.enteringScreen,
                }),
            },
        },
        menuButton: {
            position: "absolute",
            margin: 0,
            backdropFilter: "blur(4px)",
            pointerEvents: "auto",
            backgroundColor: fade(theme.palette.background.default, 0.6),
        },
        menuButtonLeft: {
            left: APPBAR_ICON_BUTTON_MARGIN,
        },
        menuButtonRight: {
            right: APPBAR_ICON_BUTTON_MARGIN,
        },
    })
})

export const Appbar: React.FC = () => {
    const {
        state: { drawerActivity, setDrawerActivity },
    } = StoreContainer.useContainer()
    const { noteKey } = EditContainer.useContainer()

    const classes = useStyles()
    const toggleDrawerActivity = () => setDrawerActivity(!drawerActivity)
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const handleMenuBtnClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }
    const handleMenuClose = () => {
        setAnchorEl(null)
    }

    return (
        <AppBar
            position="fixed"
            className={clsx(classes.appBar, {
                [classes.appBarShift]: drawerActivity,
            })}
            elevation={0}
            data-testid="appbar"
        >
            <AppbarIconButton
                aria-label="open drawer"
                onClick={toggleDrawerActivity}
                className={clsx(classes.menuButton, classes.menuButtonLeft)}
                data-testid="appbar-btn-menu"
            >
                <icons.Menu />
            </AppbarIconButton>
            {noteKey && (
                <AppbarIconButton
                    aria-label="open drawer"
                    onClick={handleMenuBtnClick}
                    className={clsx(classes.menuButton, classes.menuButtonRight)}
                    data-testid="appbar-btn-dots"
                >
                    <icons.MoreVert />
                </AppbarIconButton>
            )}
            <NoteMenu noteKey={noteKey} anchorEl={anchorEl} handleMenuClose={handleMenuClose} />
        </AppBar>
    )
}
