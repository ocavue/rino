import { ThemeProvider } from "@mui/system"
import { render, screen, waitFor } from "@testing-library/react"
import React from "react"

import { Homepage } from "../src/components/homepage"
import { theme } from "../src/styles/theme"

test("homepage", async () => {
    render(
        <ThemeProvider theme={theme}>
            <Homepage hero={{ imageProps: {} }} />
        </ThemeProvider>,
    )

    await waitFor(() => screen.getByTestId("homepage_root"))
})
