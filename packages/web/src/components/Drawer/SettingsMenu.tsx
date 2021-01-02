import { Divider, ListItemText, Menu, MenuItem } from "@material-ui/core"
import React from "react"

import { signOut } from "src/controller/auth/actions"
import { AuthContainer } from "src/controller/auth/hook"
import { ThemeContainer } from "src/controller/theme/hook"

const SettingsMenu: React.FC<{
    anchor: HTMLElement | null
    setAnchor: (val: HTMLElement | null) => void
    setOpenAboutDialog: (val: boolean) => void
}> = ({ anchor, setAnchor, setOpenAboutDialog }) => {
    const { toggleTheme } = ThemeContainer.useContainer()
    const { email } = AuthContainer.useContainer()

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
        <Menu keepMounted anchorEl={anchor} open={Boolean(anchor)} onClose={handleMenuClose} data-testid="sidebar_settings_menu">
            <MenuItem onClick={onClickToggleThem} data-testid="sidebar_settings_menu_item_theme">
                Toggle Theme
            </MenuItem>
            <MenuItem onClick={onClickAbout} data-testid="sidebar_settings_menu_item_about">
                About Rino
            </MenuItem>
            <Divider />
            <MenuItem onClick={onClickSignOut} data-testid="sidebar_settings_menu_item_sign_out">
                <ListItemText primary="Sign out" secondary={email} />
            </MenuItem>
        </Menu>
    )
}

export default SettingsMenu
