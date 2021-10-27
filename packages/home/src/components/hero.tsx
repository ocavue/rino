import { styled } from "@mui/material/styles"
import { Box } from "@mui/system"
import React, { ImgHTMLAttributes } from "react"

import { rootLevelBlock } from "../styles/layout"

const SnapshotImage = styled("img")({
    width: "100%",
    height: "auto",
    pl: { md: 2 },
    pr: { md: 2 },
})

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
            <SnapshotImage alt="Snapshot" {...imageProps} />
        </Box>
    )
}
