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

                marginTop: "120px",
                marginBottom: "140px",
                paddingTop: "48px",
                paddingBottom: "48px",

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
                        marginBottom: "32px",
                        fontWeight: 500,
                        color: (theme) => theme.palette.common.white,
                        fontSize: { xs: "2.2rem", sm: "3rem" },
                    }}
                >
                    Download Rino today
                </Typography>
                <Button
                    variant="outlined"
                    sx={{
                        color: "#ffffff",
                        fontWeight: 700,
                        fontSize: "19px",
                        border: "2px solid #ffffff",
                        "&:hover": {
                            color: "#313131",
                            border: "2px solid #ffffff",
                            background: "#ffffff",
                        },
                    }}
                    onClick={handleOpenDownloadDialog}
                    size="large"
                >
                    Download Rino
                </Button>
            </Box>
        </Box>
    )
}
