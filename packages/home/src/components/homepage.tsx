/* Copyright (c) 2020-present ocavue@gmail.com */

import { createStyles, makeStyles } from "@material-ui/styles"
import React from "react"

import { breakpoints } from "../styles/breakpoint"
import { Appbar } from "./appbar"
import { AppbarAuth } from "./appbar-auth"
import { AppbarLogo } from "./appbar-logo"
import { MobileMenu } from "./appbar-mobile-menu"
import { AppbarMore } from "./appbar-more"
import { CTA } from "./cta"
import { Features } from "./features"
import { Footer } from "./footer"
import { Headline } from "./headline"
import { Hero, HeroProps } from "./hero"

const useStyles = makeStyles(
    createStyles({
        root: {
            position: "relative",
            backgroundColor: "#ffffff",
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',

            "& ol,ul": {
                listStyle: "none",
                margin: 0,
                padding: 0,
            },

            /**
             * Reset links to optimize for opt-in styling instead of
             * opt-out.
             */
            "& a": {
                textDecoration: "inherit",
            },

            "& button": {
                border: "none",
                backgroundColor: "transparent",
            },
        },
        container: {
            maxWidth: "80rem",
            marginLeft: "auto",
            marginRight: "auto",
            paddingLeft: "1rem",
            paddingRight: "1rem",

            [breakpoints.up.sm]: {
                paddingLeft: "1.5rem",
                paddingRight: "1.5rem",
            },
        },
        appbar: {
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            flex: "0",
        },
    }),
)

type HomepageProps = {
    hero: HeroProps
}

export function Homepage(props: HomepageProps) {
    const classes = useStyles()

    const [mobileMenuActivity, setMobileMenuActivity] = React.useState(false)

    return (
        <div className={classes.root} data-testid="homepage_root">
            <div className={classes.container}>
                <Appbar>
                    <a className={classes.appbar} href="#">
                        <AppbarLogo />
                    </a>
                    <AppbarAuth />
                    <AppbarMore onClick={() => setMobileMenuActivity((val) => !val)} />
                    <MobileMenu activity={mobileMenuActivity} setActivity={setMobileMenuActivity} />
                </Appbar>
                <Headline />
                <Hero {...props.hero} />
                <Features />
                <CTA />
            </div>
            <Footer />
        </div>
    )
}
