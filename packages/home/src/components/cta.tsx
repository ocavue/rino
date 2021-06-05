import { Box, Button, createStyles, makeStyles } from "@material-ui/core"
import React from "react"

import { colors } from "../styles/color"
import { DOWNLOAD_LINK } from "./links"

const useStyles = makeStyles((theme) =>
    createStyles({
        cta: {
            marginTop: 120,
            marginBottom: 160,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        },
        header: {
            marginTop: 64,
            marginBottom: 32,
            fontWeight: 700,
            color: colors.gray900,

            fontSize: "2.2rem",
            [theme.breakpoints.up("sm")]: {
                fontSize: "3rem",
            },
        },
    }),
)

const CTAButton: React.FC<{ href: string }> = ({ href, children }) => {
    return (
        <Button disabled target="_blank" rel="noopener noreferrer" href={href} size="large" variant="contained" color="primary">
            {children}
        </Button>
    )
}

// call-to-action
export const CTA: React.FC = () => {
    const classes = useStyles()

    return (
        <div className={classes.cta}>
            <h2 className={classes.header}>Get started with Rino</h2>
            <Box display="flex">
                <CTAButton href={DOWNLOAD_LINK}>comming soon</CTAButton>
            </Box>
        </div>
    )
}
