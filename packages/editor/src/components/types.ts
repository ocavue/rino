import { Container } from "unstated-next"

export type EditorProps = {
    className: string
    autoFocus: boolean
    editable: boolean
    initialContent: string
    onContentSaveDelay: number
    onContentSave: (content: string) => void
    onContentEdit: () => void
    beforeUnmount: (content?: string) => void
    enableDevTools: boolean
}

export type DrawerActivityContainer = Pick<Container<{ drawerActivity: boolean }>, "useContainer">
