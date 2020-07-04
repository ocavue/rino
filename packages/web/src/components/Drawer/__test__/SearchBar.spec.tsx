import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles"
import { act, fireEvent, render, screen, within } from "@testing-library/react"
import React from "react"

import { EditContainer, Note, NoteType } from "src/controller"
import { AuthContainer } from "src/controller/auth/hook"
import { WorksapceStateContainer } from "src/controller/workspace-state/hook"
import { TestHook } from "tests/react-test-utils"

import { SearchBar } from "../SearchBar"

function renderWithCallback(component: React.ReactNode, callback: () => any) {
    return render(
        <ThemeProvider theme={createMuiTheme()}>
            <WorksapceStateContainer.Provider>
                <EditContainer.Provider>
                    <AuthContainer.Provider>
                        {component}
                        <TestHook callback={callback} />
                    </AuthContainer.Provider>
                </EditContainer.Provider>
            </WorksapceStateContainer.Provider>
        </ThemeProvider>,
    )
}

test("<SearchBar />", () => {
    let workHooks = {} as ReturnType<typeof WorksapceStateContainer.useContainer>
    let editHooks = {} as ReturnType<typeof EditContainer.useContainer>
    let authHooks = {} as ReturnType<typeof AuthContainer.useContainer>

    renderWithCallback(<SearchBar />, () => {
        workHooks = WorksapceStateContainer.useContainer()
        editHooks = EditContainer.useContainer()
        authHooks = AuthContainer.useContainer()
    })

    // Set loading to false
    act(() => {
        authHooks.setLoadingUser(false)
        workHooks.setLoadingData(false)
    })
    expect(authHooks.loadingUser).toBeFalse()
    expect(workHooks.loadingData).toBeFalse()

    // Insert some notes
    act(() => {
        editHooks.resetNotes([
            Note.new({ type: NoteType.Local, content: "AAAA" }),
            Note.new({ type: NoteType.Local, content: "BBBB" }),
        ])
        workHooks.setLoadingData(false)
    })

    // Check states before searching
    expect(editHooks.notes).toHaveLength(2)
    expect(editHooks.searchQuery).toEqual("")
    expect(editHooks.searchedNotes).toHaveLength(0)

    // Parpare
    const searchBar = screen.getByTestId("drawer-search-notes")
    const searchBarInput = within(searchBar).getByPlaceholderText("Search Notes")

    // Search exist notes
    act(() => {
        fireEvent.change(searchBarInput, { target: { value: "AAAA" } })
    })
    expect(editHooks.searchedNotes).toHaveLength(1)

    // Search not exist notes
    act(() => {
        fireEvent.change(searchBarInput, { target: { value: "CCCC" } })
    })
    expect(editHooks.searchedNotes).toHaveLength(0)
})
