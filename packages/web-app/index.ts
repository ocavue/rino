// import "babel-polyfill"
// import { main } from '../editor/index'

async function init() {
    const editor = await import('../editor/index')
    editor.main()
    console.log()
}

console.log('before init')
init()
console.log('after init')

// main()
