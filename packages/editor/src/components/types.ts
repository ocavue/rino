import { Container } from "unstated-next"

export type EditorProps = {
    className: string
    autoFocus: boolean
    editable: boolean
    initialContent: string
    onContentChange: (content: string) => void
    beforeUnmount: () => void
}

export type DrawerActivityContainer = Pick<Container<{ drawerActivity: boolean }>, "useContainer">
