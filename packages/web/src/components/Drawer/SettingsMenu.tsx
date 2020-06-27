import { Divider, ListItemText, Menu, MenuItem } from "@material-ui/core"
import React from "react"

import { signOut } from "src/controller"
import { StoreContainer } from "src/store"

const SettingsMenu: React.FC<{
    anchor: HTMLElement | null
    setAnchor: (val: HTMLElement | null) => void
    setOpenAboutDialog: (val: boolean) => void
}> = ({ anchor, setAnchor, setOpenAboutDialog }) => {
    const {
        state: { toggleTheme },
        auth: { email },
    } = StoreContainer.useContainer()

    const handleMenuClose = () => {
        setAnchor(null)
    }

    const onClickAbout = () => {
        handleMenuClose()
        setTimeout(() => {
            setOpenAboutDialog(true)
        }, 200)
    }

    const onClickToggleThem = () => {
        handleMenuClose()
        setTimeout(() => {
            toggleTheme()
        }, 500)
    }

    const onClickSignOut = () => {
        handleMenuClose()
        setTimeout(() => {
            void signOut()
        }, 200)
    }

    return (
        <Menu
            keepMounted
            anchorEl={anchor}
            open={Boolean(anchor)}
            onClose={handleMenuClose}
            data-testid="sidebar-settings-menu"
        >
            <MenuItem onClick={onClickToggleThem} data-testid="sidebar-settings-menu-item-theme">
                Toggle Theme
            </MenuItem>
            <MenuItem onClick={onClickAbout} data-testid="sidebar-settings-menu-item-about">
                About Rino
            </MenuItem>
            <Divider />
            <MenuItem onClick={onClickSignOut} data-testid="sidebar-settings-menu-item-sign-out">
                <ListItemText primary="Sign out" secondary={email} />
            </MenuItem>
        </Menu>
    )
}

export { SettingsMenu }
