import "./remedy.css"

import { createStyles, makeStyles } from "@material-ui/styles"
import React from "react"

import { Appbar } from "./components/appbar"
import { AppbarAuth } from "./components/appbar-auth"
import { AppbarLogo } from "./components/appbar-logo"
import { MobileMenu } from "./components/appbar-mobile-menu"
import { AppbarMore } from "./components/appbar-more"
import { CTA } from "./components/cta"
import { Features } from "./components/features"
import { Footer } from "./components/footer"
import { Headline } from "./components/headline"
import { Hero } from "./components/hero"
import { breakpoints } from "./styles/breakpoint"

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

export default function Homepage() {
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
                <Hero />
                <Features />
                <CTA />
            </div>
            <Footer />
        </div>
    )
}
