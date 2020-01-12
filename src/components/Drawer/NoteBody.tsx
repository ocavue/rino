import * as m from "@material-ui/core"
import { NoteList } from "./NoteList"
import { StoreContainer } from "src/store"

import React from "react"

export const NoteBody: React.FC = () => {
    const {
        state: { loading },
        edit: { notes },
    } = StoreContainer.useContainer()

    return loading ? (
        <m.Box display="flex" alignItems="center" justifyContent="center" height="100%">
            <m.CircularProgress />
        </m.Box>
    ) : (
        <NoteList notes={notes || []} />
    )
}
