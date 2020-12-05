import * as icons from "@material-ui/icons"
import React from "react"

import { AppbarIconButton } from "src/components/AppbarIconButton"
import { WorksapceStateContainer } from "src/controller/workspace-state/hook"

import { AboutDialog } from "../AboutDialog"
import { SettingsMenu } from "./SettingsMenu"
import { useHeaderStyles } from "./style"

export const ActivityHeader: React.FC = () => {
    const classes = useHeaderStyles()
    const { connected } = WorksapceStateContainer.useContainer()

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
            <AppbarIconButton className={classes.drawerHeaderButton} onClick={handleSettingsBtnClick} data-testid="sidebar_btn_settings">
                <icons.SettingsOutlined />
            </AppbarIconButton>
            <SettingsMenu anchor={anchor} setAnchor={setAnchor} setOpenAboutDialog={setOpenAboutDialog} />
            <AboutDialog open={openAboutDialog} setOpen={setOpenAboutDialog}></AboutDialog>
        </div>
    )
}
