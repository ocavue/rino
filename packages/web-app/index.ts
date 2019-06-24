async function loadEditor() {
    const editor = await import('../editor/index')
    editor.main()
}

loadEditor()
