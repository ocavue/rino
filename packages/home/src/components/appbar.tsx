import { Button, Hidden, Toolbar } from "@mui/material"
import { Box } from "@mui/system"
import React, { FC } from "react"

import { rootLevelBlock } from "../styles/layout"
import { AppbarLogo } from "./appbar-logo"

const Appbar: FC<{ handleOpenDownloadDialog: () => void }> = ({ handleOpenDownloadDialog }) => {
    return (
        <Toolbar
            disableGutters
            sx={{
                ...rootLevelBlock,
                padding: (theme) => theme.spacing(0, 2),
                height: { xs: 80, md: 96 },
            }}
        >
            <a href="/" title="rino">
                <AppbarLogo />
            </a>
            <Box flexGrow={1} />
            <Hidden smDown>
                <Button sx={{ fontSize: "1.1rem" }} size="large" onClick={handleOpenDownloadDialog}>
                    Download
                </Button>
            </Hidden>
        </Toolbar>
    )
}

export { Appbar }
