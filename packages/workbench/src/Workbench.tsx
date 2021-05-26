import React, { FC } from "react"

import { Editor, EditorProps } from "@rino.app/editor"

type WorkbenchProps = Pick<EditorProps, "note" | "setNoteContent" | "drawerActivityContainer">

const Workbench: FC<WorkbenchProps> = (props) => {
    return <Editor autoFocus isDarkMode={false} extraClassName="" maxDrawerWidth={200} isTestEnv {...props} />
}

export default Workbench
