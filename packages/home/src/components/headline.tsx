import { Box } from "@mui/system"
import React from "react"

import { colors } from "../styles/color"
import { rootLevelBlock } from "../styles/layout"

export const Headline: React.FC = () => {
    return (
        <Box
            sx={{
                ...rootLevelBlock,
                marginTop: "120px",
                marginBottom: "120px",
                textAlign: { sm: "center" },
            }}
        >
            <Box
                component="h1"
                sx={{
                    color: (theme) => theme.palette.primary.main,
                    fontSize: { xs: "4rem", md: "5rem" },
                }}
            >
                Rino
            </Box>
            <Box
                component="h2"
                sx={{
                    fontWeight: 700,
                    color: colors.gray900,
                    letterSpacing: "-0.025em",
                    fontSize: { xs: "2.4rem", md: "3rem" },
                }}
            >
                A better way to write Markdown
            </Box>
        </Box>
    )
}
