import { createStyles, Divider, makeStyles, ThemeProvider } from "@material-ui/core"
import CssBaseline from "@material-ui/core/CssBaseline"
import React, { FC } from "react"

import { theme } from "../styles/theme"
import { Appbar } from "./appbar"
import { CTA } from "./cta"
import { Footer } from "./footer"
import { Headline } from "./headline"
import { Hero, HeroProps } from "./hero"
import { Warning } from "./warning"

const useStyles = makeStyles(
    createStyles({
        root: {
            position: "relative",

            /**
             * Reset links to optimize for opt-in styling instead of
             * opt-out.
             */
            "& a": {
                textDecoration: "inherit",
            },
        },
    }),
)

type HomepageProps = {
    hero: HeroProps
}

export const Homepage: FC<HomepageProps> = (props) => {
    const classes = useStyles()

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className={classes.root} data-testid="homepage_root">
                <Appbar />
                <Divider />
                <Warning />
                <Headline />
                <Hero {...props.hero} />
                <CTA />
                <Divider />
                <Footer />
            </div>
        </ThemeProvider>
    )
}
