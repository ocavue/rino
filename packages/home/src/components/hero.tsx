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
                    width: "100%",
                    height: "100%",
                    pl: { md: 2 },
                    pr: { md: 2 },
                }}
                alt="Snapshot"
                {...imageProps}
            />
        </Box>
    )
}
