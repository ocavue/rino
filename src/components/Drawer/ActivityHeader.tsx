import * as icons from "@material-ui/icons"
import { AboutDialog } from "../AboutDialog"
import { AppbarIconButton } from "src/components/AppbarIconButton"
import { SettingsMenu } from "./SettingsMenu"
import { StoreContainer } from "src/store"
import { useHeaderStyles } from "./style"
import React from "react"

export const ActivityHeader: React.FC = () => {
    const classes = useHeaderStyles()
    const {
        state: { connected },
    } = StoreContainer.useContainer()

    const [anchor, setAnchor] = React.useState<null | HTMLElement>(null)
    const [openAboutDialog, setOpenAboutDialog] = React.useState(false)

    const handleSettingsBtnClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchor(event.currentTarget)
    }

    return (
        <div className={classes.drawerHeader}>
            <AppbarIconButton className={classes.drawerHeaderButton}>
                {connected ? <icons.CloudOutlined /> : <icons.CloudOffOutlined />}
            </AppbarIconButton>
            <AppbarIconButton
                className={classes.drawerHeaderButton}
                onClick={handleSettingsBtnClick}
                data-testid="sidebar-btn-settings"
            >
                <icons.SettingsOutlined />
            </AppbarIconButton>
            <SettingsMenu
                anchor={anchor}
                setAnchor={setAnchor}
                setOpenAboutDialog={setOpenAboutDialog}
            />
            <AboutDialog open={openAboutDialog} setOpen={setOpenAboutDialog}></AboutDialog>
        </div>
    )
}
