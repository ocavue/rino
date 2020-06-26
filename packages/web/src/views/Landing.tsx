import { Box, Button } from "@material-ui/core"
import NextLink from "next/link"
import React from "react"

import Center from "./Center"

export default function Landing() {
    return (
        <Center>
            <h1 data-testid="landing">Rino</h1>

            <Box>
                <NextLink href="/sign-in">
                    <Button component="a" size="large" style={{ marginRight: 16 }}>
                        Sign In
                    </Button>
                </NextLink>
                <NextLink href="/sign-up">
                    <Button component="a" size="large" color="primary" variant="contained">
                        Sign Up
                    </Button>
                </NextLink>
            </Box>
        </Center>
    )
}
