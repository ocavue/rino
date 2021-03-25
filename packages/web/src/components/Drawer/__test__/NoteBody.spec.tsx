/* Copyright (c) 2020-present ocavue@gmail.com */

import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles"
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react"
import React from "react"

import { AuthContainer } from "src/controller/auth/hook"
import { EditContainer, Note, NoteType } from "src/controller/edit"
import { WorksapceStateContainer } from "src/controller/workspace-state/hook"
import { TestHook } from "tests/react-test-utils"

import NoteBody from "../NoteBody"

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
    screen.getByTestId("drawer_note_body_loading")

    act(() => {
        authHooks.setLoadingUser(false)
        workHooks.setLoadingData(false)
    })

    // Set loading to false
    expect(authHooks.loadingUser).toBeFalse()
    expect(workHooks.loadingData).toBeFalse()
    screen.getByTestId("sidebar_notes") // TODO: rename sidebar to drawer
    expect(editHooks.notes).toHaveLength(0)
    expect(screen.queryByTestId("sidebar_notes_list_item")).toBeNull()

    // Insert some notes
    act(() => {
        editHooks.resetNotes([Note.new({ type: NoteType.Local, content: "AAAA" }), Note.new({ type: NoteType.Local, content: "BBBB" })])
        workHooks.setLoadingData(false)
    })
    expect(editHooks.notes).toHaveLength(2)
    expect(screen.getAllByTestId("sidebar_notes_list_item_local")).toHaveLength(2)

    // Search not exist notes
    act(() => editHooks.setSearchQuery("CCCC"))
    expect(editHooks.searchQuery).toEqual("CCCC")
    expect(editHooks.searchedNotes).toHaveLength(0)
    expect(screen.queryAllByTestId("sidebar_notes_list_item_local")).toHaveLength(0)
    screen.getByTestId("drawer_note_body_note_not_fount")

    // Search exist notes
    act(() => editHooks.setSearchQuery("AAAA"))
    expect(editHooks.searchQuery).toEqual("AAAA")
    expect(editHooks.searchedNotes).toHaveLength(1)
    expect(screen.getAllByTestId("sidebar_notes_list_item_local")).toHaveLength(1)

    // Empty search query
    act(() => editHooks.setSearchQuery(""))
    expect(editHooks.searchQuery).toEqual("")
    // `searchedNotes` should be an empty array but `searchedNotes` shouldn't be empty
    expect(editHooks.searchedNotes).toHaveLength(0)
    expect(editHooks.visibleNotes).toHaveLength(2)
    expect(screen.getAllByTestId("sidebar_notes_list_item_local")).toHaveLength(2)

    // Show the list item context menu
    expect(screen.queryAllByTestId("note_menu")).toHaveLength(0)
    fireEvent.contextMenu(screen.getAllByTestId("sidebar_notes_list_item_local")[0])
    expect(screen.queryAllByTestId("note_menu")).toHaveLength(1)

    // Hide the list item context menu
    fireEvent.click(screen.getByTestId("note_menu_item_delete"))
    await waitFor(() => expect(screen.queryAllByTestId("note_menu")).toHaveLength(0))
})
