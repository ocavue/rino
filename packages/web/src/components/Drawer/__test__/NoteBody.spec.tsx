import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles"
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react"
import React from "react"

import { AuthContainer } from "src/controller/auth/hook"
import { EditContainer, Note, NoteType } from "src/controller/edit"
import { WorksapceStateContainer } from "src/controller/workspace-state/hook"
import { TestHook } from "tests/react-test-utils"

import { NoteBody } from "../NoteBody"

function renderWithCallback(component: React.ReactNode, callback: () => unknown) {
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

test("<NoteBody />", async () => {
    let workHooks = {} as ReturnType<typeof WorksapceStateContainer.useContainer>
    let editHooks = {} as ReturnType<typeof EditContainer.useContainer>
    let authHooks = {} as ReturnType<typeof AuthContainer.useContainer>

    renderWithCallback(<NoteBody />, () => {
        workHooks = WorksapceStateContainer.useContainer()
        editHooks = EditContainer.useContainer()
        authHooks = AuthContainer.useContainer()
    })

    expect(authHooks.loadingUser).toBeTrue()
    expect(workHooks.loadingData).toBeTrue()
    screen.getByTestId("drawer-note-body-loading")

    act(() => {
        authHooks.setLoadingUser(false)
        workHooks.setLoadingData(false)
    })

    // Set loading to false
    expect(authHooks.loadingUser).toBeFalse()
    expect(workHooks.loadingData).toBeFalse()
    screen.getByTestId("sidebar-notes") // TODO: rename sidebar to drawer
    expect(editHooks.notes).toHaveLength(0)
    expect(screen.queryByTestId("sidebar-notes-list-item")).toBeNull()

    // Insert some notes
    act(() => {
        editHooks.resetNotes([
            Note.new({ type: NoteType.Local, content: "AAAA" }),
            Note.new({ type: NoteType.Local, content: "BBBB" }),
        ])
        workHooks.setLoadingData(false)
    })
    expect(editHooks.notes).toHaveLength(2)
    expect(screen.getAllByTestId("sidebar-notes-list-item-local")).toHaveLength(2)

    // Search not exist notes
    act(() => editHooks.setSearchQuery("CCCC"))
    expect(editHooks.searchQuery).toEqual("CCCC")
    expect(editHooks.searchedNotes).toHaveLength(0)
    expect(screen.queryAllByTestId("sidebar-notes-list-item-local")).toHaveLength(0)
    screen.getByTestId("drawer-note-body-note-not-fount")

    // Search exist notes
    act(() => editHooks.setSearchQuery("AAAA"))
    expect(editHooks.searchQuery).toEqual("AAAA")
    expect(editHooks.searchedNotes).toHaveLength(1)
    expect(screen.getAllByTestId("sidebar-notes-list-item-local")).toHaveLength(1)

    // Empty search query
    act(() => editHooks.setSearchQuery(""))
    expect(editHooks.searchQuery).toEqual("")
    // `searchedNotes` should be an empty array but `searchedNotes` shouldn't be empty
    expect(editHooks.searchedNotes).toHaveLength(0)
    expect(editHooks.visibleNotes).toHaveLength(2)
    expect(screen.getAllByTestId("sidebar-notes-list-item-local")).toHaveLength(2)

    // Show the list item context menu
    expect(screen.queryAllByTestId("note-menu")).toHaveLength(0)
    fireEvent.contextMenu(screen.getAllByTestId("sidebar-notes-list-item-local")[0])
    expect(screen.queryAllByTestId("note-menu")).toHaveLength(1)

    // Hide the list item context menu
    fireEvent.click(screen.getByTestId("note-menu-item-delete"))
    await waitFor(() => expect(screen.queryAllByTestId("note-menu")).toHaveLength(0))
})
