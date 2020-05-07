import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles"
import { act, render, screen, waitFor } from "@testing-library/react"
import React from "react"

import { EditContainer, Note, NoteType } from "src/controller"
import { StoreContainer } from "src/store"
import { TestHook } from "tests/unit/react-test-utils"

import { NoteBody } from "../NoteBody"
import { NoteList } from "../NoteList"
import { NoteListItem } from "../NoteListItem"

function renderWithCallback(component: React.ReactNode, callback: () => any) {
    return render(
        <ThemeProvider theme={createMuiTheme()}>
            <StoreContainer.Provider>
                <EditContainer.Provider>
                    {component}
                    <TestHook callback={callback} />
                </EditContainer.Provider>
            </StoreContainer.Provider>
        </ThemeProvider>,
    )
}

test("<NoteBody />", async () => {
    let storeHooks = {} as ReturnType<typeof StoreContainer.useContainer>
    let editHooks = {} as ReturnType<typeof EditContainer.useContainer>

    renderWithCallback(<NoteBody />, () => {
        storeHooks = StoreContainer.useContainer()
        editHooks = EditContainer.useContainer()
    })

    expect(storeHooks.state.loading).toBeTrue()
    await waitFor(() => screen.getByTestId("drawer-note-body-loading"))

    act(() => {
        storeHooks.state.setLoadingUser(false)
        storeHooks.state.setLoadingData(false)
    })

    // Set loading to false
    expect(storeHooks.state.loading).toBeFalse()
    await waitFor(() => screen.getByTestId("sidebar-notes")) // TODO: rename sidebar to drawer
    expect(editHooks.notes).toHaveLength(0)
    expect(screen.queryByTestId("sidebar-notes-list-item")).toBeNull()

    // Insert some notes
    act(() => {
        editHooks.resetNotes([
            Note.new({ type: NoteType.Local, content: "AAAA" }),
            Note.new({ type: NoteType.Local, content: "BBBB" }),
        ])
        storeHooks.state.setLoadingData(false)
    })
    expect(editHooks.notes).toHaveLength(2)
    await waitFor(() =>
        expect(screen.getAllByTestId("sidebar-notes-list-item-local")).toHaveLength(2),
    )

    // Search not exist notes
    act(() => editHooks.setSearchQuery("CCCC"))
    expect(editHooks.searchQuery).toEqual("CCCC")
    expect(editHooks.searchedNotes).toHaveLength(0)
    await waitFor(() =>
        expect(screen.queryAllByTestId("sidebar-notes-list-item-local")).toHaveLength(0),
    )
    await waitFor(() => expect(screen.getByTestId("drawer-note-body-note-not-fount")))

    // Search exist notes
    act(() => editHooks.setSearchQuery("AAAA"))
    expect(editHooks.searchQuery).toEqual("AAAA")
    expect(editHooks.searchedNotes).toHaveLength(1)
    await waitFor(() =>
        expect(screen.getAllByTestId("sidebar-notes-list-item-local")).toHaveLength(1),
    )

    // Empty search query
    act(() => editHooks.setSearchQuery(""))
    expect(editHooks.searchQuery).toEqual("")
    // `searchedNotes` should be an empty array but `searchedNotes` shouldn't be empty
    expect(editHooks.searchedNotes).toHaveLength(0)
    expect(editHooks.visibleNotes).toHaveLength(2)
    await waitFor(() =>
        expect(screen.getAllByTestId("sidebar-notes-list-item-local")).toHaveLength(2),
    )
})
