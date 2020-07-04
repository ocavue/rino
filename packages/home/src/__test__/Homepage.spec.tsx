import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import React from "react"

import Homepage from "../Homepage"

test("homepage", async () => {
    render(<Homepage />)

    await waitFor(() => screen.getByTestId("homepage_root"))

    expect(screen.getByTestId("homepage_appbar_mobile_menu")).not.toBeVisible()

    fireEvent.click(screen.getByTestId("homepage_appbar_more"))
    expect(screen.getByTestId("homepage_appbar_mobile_menu")).toBeVisible()

    fireEvent.click(screen.getByTestId("homepage_appbar_mobile_menu_btn_close"))
    expect(screen.getByTestId("homepage_appbar_mobile_menu")).not.toBeVisible()
})
