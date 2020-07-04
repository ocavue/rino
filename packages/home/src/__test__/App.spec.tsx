import { render, screen, waitFor } from "@testing-library/react"
import React from "react"

import App from "../Homepage"

test("loads and displays greeting", async () => {
    render(<App />)

    // fireEvent.click(screen.getByText("Load Greeting"))

    await waitFor(() => screen.getByTestId("homepage_root"))

    // expect(screen.getByRole("heading")).toHaveTextContent("hello there")
    // expect(screen.getByRole("button")).toHaveAttribute("disabled")
})
