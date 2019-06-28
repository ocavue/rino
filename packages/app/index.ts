async function loadEditor() {
    const editor = await import('../editor/index')
    editor.init()
}

loadEditor()
