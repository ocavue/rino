import { Box } from "@mui/system"
import React from "react"

import { colors } from "../styles/color"
import { Logo } from "./logo"

export const AppbarLogo: React.FC = () => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
            }}
        >
            <Logo
                sx={{
                    height: { xs: "48px", md: "64px" },
                    width: { xs: "48px", md: "64px" },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            />
            <Box
                sx={{
                    lineHeight: "1.5rem",
                    fontWeight: 500,
                    color: colors.gray700,
                    transitionProperty: "color",
                    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                    transitionDuration: "150ms",

                    "&:hover": {
                        color: colors.gray900,
                    },
                    "&:focus": {
                        outline: "0",
                        color: colors.gray900,
                    },
                    paddingLeft: {
                        xs: "1rem",
                        md: "1.5rem",
                    },
                    fontSize: {
                        xs: "1.25rem",
                        md: "1.5rem",
                    },
                }}
            >
                Rino
            </Box>
        </Box>
    )
}
