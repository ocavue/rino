import React, { FC } from "react"

import { Editor, EditorProps } from "@rino.app/editor"

type WorkbenchProps = Pick<EditorProps, "note" | "setNoteContent" | "drawerActivityContainer">

const Workbench: FC<WorkbenchProps> = (props) => {
    return <Editor {...props} />
}

export default Workbench
