import { act, fireEvent, render, screen } from "@testing-library/react"
import React from "react"

import { SIGN_IN_SNACKBAR_SHOW_DELAY } from "src/constants"
import { AuthContainer } from "src/controller/auth/hook"
import { EditContainer, User } from "src/controller/edit"
import { WorksapceStateContainer } from "src/controller/workspace-state/hook"
import { mockNextLink, TestHook } from "tests/react-test-utils"

import { SignInSnackbar } from "../SignInSnackbar"

jest.useFakeTimers()
jest.mock("next/link", () => mockNextLink)

function renderWithCallback(component: React.ReactNode, callback: () => any) {
    return render(
        <div>
            <WorksapceStateContainer.Provider>
                <EditContainer.Provider>
                    <AuthContainer.Provider>
                        {component}
                        <TestHook callback={callback} />
                    </AuthContainer.Provider>
                </EditContainer.Provider>
            </WorksapceStateContainer.Provider>
        </div>,
    )
}

describe("<SignInSnackbar />", () => {
    test("without login user", () => {
        // Parpare the environment
        let workHooks = {} as ReturnType<typeof WorksapceStateContainer.useContainer>
        let authHooks = {} as ReturnType<typeof AuthContainer.useContainer>
        renderWithCallback(<SignInSnackbar />, () => {
            workHooks = WorksapceStateContainer.useContainer()
            authHooks = AuthContainer.useContainer()
        })
        act(() => {
            workHooks.setLoadingData(false)
            authHooks.setLoadingUser(false)
            authHooks.setUser(null)

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
        let workHooks = {} as ReturnType<typeof WorksapceStateContainer.useContainer>
        let authHooks = {} as ReturnType<typeof AuthContainer.useContainer>
        renderWithCallback(<SignInSnackbar />, () => {
            workHooks = WorksapceStateContainer.useContainer()
            authHooks = AuthContainer.useContainer()
        })
        act(() => {
            workHooks.setLoadingData(false)
            authHooks.setLoadingUser(false)
            authHooks.setUser({} as User)

            jest.advanceTimersByTime(SIGN_IN_SNACKBAR_SHOW_DELAY + 1000)
        })

        // Don't show the snackbar
        expect(screen.queryByTestId("full-sign-in-snack-bar")).toBeNull()
        expect(screen.queryByTestId("dense-sign-in-snack-bar")).toBeNull()
    })
})
