import { act, fireEvent, render, screen } from "@testing-library/react"
import React from "react"

import { SIGN_IN_SNACKBAR_SHOW_DELAY } from "src/constants"
import { EditContainer, User } from "src/controller"
import { StoreContainer } from "src/store"
import { mockNextLink, TestHook } from "tests/unit/react-test-utils"

import { SignInSnackbar } from "../SignInSnackbar"

jest.useFakeTimers()
jest.mock("next/link", () => mockNextLink)

function renderWithCallback(component: React.ReactNode, callback: () => any) {
    return render(
        <div>
            <StoreContainer.Provider>
                <EditContainer.Provider>
                    {component}
                    <TestHook callback={callback} />
                </EditContainer.Provider>
            </StoreContainer.Provider>
            ,
        </div>,
    )
}

describe("<SignInSnackbar />", () => {
    test("without login user", () => {
        // Parpare the environment
        let storeHooks = {} as ReturnType<typeof StoreContainer.useContainer>
        renderWithCallback(<SignInSnackbar />, () => {
            storeHooks = StoreContainer.useContainer()
        })
        act(() => {
            storeHooks.state.setLoadingData(false)
            storeHooks.state.setLoadingUser(false)
            storeHooks.auth.setUser(null)

            jest.advanceTimersByTime(SIGN_IN_SNACKBAR_SHOW_DELAY + 1000)
        })

        // Show the "full" bar at the begin
        expect(screen.queryByTestId("full-sign-in-snack-bar")).not.toBeNull()
        expect(screen.queryByTestId("dense-sign-in-snack-bar")).toBeNull()

        // Show the "dense" bar after clicking the close button
        fireEvent.click(screen.getByTestId("full-sign-in-snack-bar-close-button"))
        act(() => {
            jest.runAllTimers()
        })
        expect(screen.queryByTestId("full-sign-in-snack-bar")).toBeNull()
        expect(screen.queryByTestId("dense-sign-in-snack-bar")).not.toBeNull()

        // Show the "full" bar after clicking the sign-in button
        fireEvent.click(screen.getByTestId("dense-sign-in-snack-bar-button"))
        act(() => {
            jest.runAllTimers()
        })
        expect(screen.queryByTestId("full-sign-in-snack-bar")).not.toBeNull()
        expect(screen.queryByTestId("dense-sign-in-snack-bar")).toBeNull()

        // Jump to the sign-in page
        fireEvent.click(screen.getByTestId("full-sign-in-snack-bar-sign-up-button"))
        act(() => {
            jest.runAllTimers()
        })
    })

    test("with login user", () => {
        // Parpare the environment
        let storeHooks = {} as ReturnType<typeof StoreContainer.useContainer>
        renderWithCallback(<SignInSnackbar />, () => {
            storeHooks = StoreContainer.useContainer()
        })
        act(() => {
            storeHooks.state.setLoadingData(false)
            storeHooks.state.setLoadingUser(false)
            storeHooks.auth.setUser({} as User)

            jest.advanceTimersByTime(SIGN_IN_SNACKBAR_SHOW_DELAY + 1000)
        })

        // Don't show the snackbar
        expect(screen.queryByTestId("full-sign-in-snack-bar")).toBeNull()
        expect(screen.queryByTestId("dense-sign-in-snack-bar")).toBeNull()
    })
})
