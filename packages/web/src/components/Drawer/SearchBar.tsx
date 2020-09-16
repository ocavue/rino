import { TextField } from "@material-ui/core"
import React from "react"

import { EditContainer } from "src/controller/edit"

export const SearchBar = () => {
    const { setSearchQuery } = EditContainer.useContainer()
    const onChange = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setSearchQuery(event.currentTarget.value)
        },
        [setSearchQuery],
    )

    return (
        <TextField
            id="drawer-search-notes"
            data-testid="drawer_search_notes"
            type="search"
            color="primary"
            fullWidth
            placeholder="Search Notes"
            variant="outlined"
            margin="dense"
            onChange={onChange}
            style={{ marginTop: 0, marginBottom: 0, marginRight: "8px", justifyContent: "center" }}
            inputProps={{ style: { paddingTop: "8px", paddingBottom: "8px" } }}
        />
    )
}
