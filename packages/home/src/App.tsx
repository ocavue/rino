import "./index.css"

import React from "react"

import { Appbar } from "./components/appbar"
import { AppbarAuth } from "./components/appbar-auth"
import { AppbarLogo } from "./components/appbar-logo"
import { MobileMenu } from "./components/appbar-mobile-menu"
import { AppbarMore } from "./components/appbar-more"
import { Features } from "./components/features"
import { Footer } from "./components/footer"
import { Headline } from "./components/headline"
import { Hero } from "./components/hero"

export default function App() {
    const [mobileMenuActivity, setMobileMenuActivity] = React.useState(false)

    return (
        <div className="relative bg-white" data-testid="homepage_root">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <Appbar>
                    <AppbarLogo />
                    <AppbarAuth />
                    <AppbarMore onClick={() => setMobileMenuActivity((val) => !val)} />
                    <MobileMenu activity={mobileMenuActivity} setActivity={setMobileMenuActivity} />
                </Appbar>
                <Headline />
                <Hero />
                <Features />
            </div>
            <Footer />
        </div>
    )
}
