/* Copyright (c) 2020-present ocavue@gmail.com */

import { Container } from "unstated-next"

export type EditorProps = {
    className: string
    autoFocus: boolean
    editable: boolean
    content: string
    setContent: (value: string) => void
}

export type DrawerActivityContainer = Container<{ drawerActivity: boolean }>
