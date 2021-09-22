import { Alert } from "@mui/material"
import { Box } from "@mui/system"
import React from "react"

import { rootLevelBlock } from "../styles/layout"

export const Warning = () => {
    return (
        <Box
            sx={{
                ...rootLevelBlock,
                paddingTop: "16px",
            }}
        >
            <Alert
                variant="standard"
                severity="warning"
                sx={{
                    fontWeight: 600,
                    borderColor: (theme) => theme.palette.warning.dark,
                    borderWidth: "2px",
                    borderStyle: "solid",
                }}
            >
                PROJECT STATUS: WORK IN PROGRESS
            </Alert>
        </Box>
    )
}
