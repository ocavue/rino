export type EditorProps = {
    className: string
    autoFocus: boolean
    editable: boolean
    content: string
    setContent: (value: string) => void
}

export type UseDrawerActivity = () => { drawerActivity: boolean }
