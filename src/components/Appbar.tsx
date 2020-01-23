import * as icons from "@material-ui/icons"
import { AppBar, Menu, MenuItem, Theme, createStyles, makeStyles } from "@material-ui/core"
import { AppbarIconButton } from "src/components/AppbarIconButton"
import { StoreContainer } from "src/store"
import { appbarIconButtonSize, appbarIconMargin, maxDrawerWidth } from "src/constants"
import { fade } from "@material-ui/core/styles/colorManipulator"
import React from "react"
import clsx from "clsx"

const useStyles = makeStyles((theme: Theme) => {
    return createStyles({
        appBar: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
            height: appbarIconMargin + appbarIconButtonSize,
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
                width: `calc(100% - ${maxDrawerWidth}px)`,
                marginLeft: maxDrawerWidth,
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
            left: appbarIconMargin,
        },
        menuButtonRight: {
            right: appbarIconMargin,
        },
    })
})

const AppbarMenu: React.FC<{
    anchorEl: HTMLElement | null
    handleMenuClose: () => void
}> = ({ anchorEl, handleMenuClose }) => {
    const {
        edit: { note, setNote, notes, setNotes },
        state: { setDrawerActivity },
    } = StoreContainer.useContainer()

    const deleteNote = () => {
        if (note) {
            setNote(null)
            if (notes) {
                setNotes(notes.filter(n => n !== note))
            }
            note.remove()
            handleMenuClose()
            setDrawerActivity(true) // TODO: test this logic
        }
    }

    return (
        <Menu keepMounted anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={deleteNote} data-testid="appbar-menu-item-delete">
                Delete
            </MenuItem>
        </Menu>
    )
}

export const Appbar: React.FC = () => {
    const {
        state: { drawerActivity, setDrawerActivity },
        edit: { note },
    } = StoreContainer.useContainer()

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
            {note && (
                <AppbarIconButton
                    aria-label="open drawer"
                    onClick={handleMenuBtnClick}
                    className={clsx(classes.menuButton, classes.menuButtonRight)}
                    data-testid="appbar-btn-dots"
                >
                    <icons.MoreVert />
                </AppbarIconButton>
            )}
            <AppbarMenu anchorEl={anchorEl} handleMenuClose={handleMenuClose} />
        </AppBar>
    )
}
