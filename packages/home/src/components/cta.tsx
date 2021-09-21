import { Button, Typography } from "@mui/material"
import { Box } from "@mui/system"
import React from "react"

import { rootLevelBlock } from "../styles/layout"

// call-to-action
export const CTA: React.FC<{ handleOpenDownloadDialog: () => void }> = ({ handleOpenDownloadDialog }) => {
    return (
        <Box
            sx={{
                width: "100%",

                marginTop: 120,
                marginBottom: 140,
                paddingTop: 48,
                paddingBottom: 48,

                background: (theme) => theme.palette.primary.main,
            }}
        >
            <Box
                sx={{
                    ...rootLevelBlock,

                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography
                    component="h3"
                    sx={{
                        marginTop: 0,
                        marginBottom: 32,
                        fontWeight: 500,
                        color: (theme) => theme.palette.common.white,
                        fontSize: { xs: "2.2rem", sm: "3rem" },
                    }}
                >
                    Download Rino today
                </Typography>
                <Button
                    variant="outlined"
                    sx={{ border: "2px solid #fff", color: "#ffffff", fontWeight: 700, fontSize: "19px" }}
                    onClick={handleOpenDownloadDialog}
                    size="large"
                >
                    Download Rino
                </Button>
            </Box>
        </Box>
    )
}
