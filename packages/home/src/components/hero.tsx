import { Box } from "@mui/system"
import React, { ImgHTMLAttributes } from "react"

import { rootLevelBlock } from "../styles/layout"

export type HeroProps = {
    imageProps: ImgHTMLAttributes<HTMLImageElement>
}

export const Hero: React.FC<HeroProps> = ({ imageProps }) => {
    return (
        <Box
            sx={{
                ...rootLevelBlock,
                marginTop: "32px",
            }}
        >
            <Box
                component="img"
                sx={{
                    width: { xs: "100%", md: 16 },
                    height: { xs: "100%", md: 16 },
                }}
                alt="Snapshot"
                {...imageProps}
            />
        </Box>
    )
}
