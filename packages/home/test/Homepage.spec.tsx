import { render, screen, waitFor } from "@testing-library/react"
import React from "react"

import { Homepage } from "../src/components/homepage"

test("homepage", async () => {
    render(<Homepage hero={{ imageProps: {} }} />)

    await waitFor(() => screen.getByTestId("homepage_root"))
})
