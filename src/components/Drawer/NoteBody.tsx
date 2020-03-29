import * as m from "@material-ui/core"
import React from "react"

import { StoreContainer } from "src/store"

import { NoteList } from "./NoteList"

export const NoteBody: React.FC = () => {
    const {
        state: { loading },
    } = StoreContainer.useContainer()

    return loading ? (
        <m.Box display="flex" alignItems="center" justifyContent="center" height="100%">
            <m.CircularProgress />
        </m.Box>
    ) : (
        <NoteList />
    )
}
