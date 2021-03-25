/* Copyright (c) 2020-present ocavue@gmail.com */

import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import React from "react"

import { Homepage } from "../components/homepage"

test("homepage", async () => {
    render(<Homepage hero={{ imageProps: {} }} />)

    await waitFor(() => screen.getByTestId("homepage_root"))

    await waitFor(() => expect(screen.getByTestId("homepage_appbar_mobile_menu")).not.toBeVisible())

    fireEvent.click(screen.getByTestId("homepage_appbar_more"))
    await waitFor(() => expect(screen.getByTestId("homepage_appbar_mobile_menu")).toBeVisible())

    fireEvent.click(screen.getByTestId("homepage_appbar_mobile_menu_btn_close"))
    await waitFor(() => expect(screen.getByTestId("homepage_appbar_mobile_menu")).not.toBeVisible())
})
