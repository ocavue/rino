<template>
    <div ref="container" class="editor-container"></div>
</template>

<script lang="ts">
import Vue from "vue"
import { BaseView, ProseMirrorView, MarkdownView } from "./views"

const defaultContent = `
# h1
## h2
### h3
#### h4
##### h5
###### h6

\`inline code\` *em* **strong** ~~delete~~ text

text *1 1 **3 3** 1 1*, **2 2 *3 3* 2 2**

[link](https://github.com) text <https://github.com> text

![Image](https://via.placeholder.com/150)

> quota *em* \`code\`
>
> > quota *em* \`code\`
> >
> > > quota *em* \`code\`
> >
> > quota *em* \`code\`
>
> quota *em* \`code\`

----

1. ordered list
2. ordered list
3. ordered list

- bullet list
- bullet list
- bullet list

\`\`\`
"Hello World!"
\`\`\`

\`\`\`JavaScript
console.log("Hello World!")
\`\`\`
`

export default Vue.extend({
    props: {
        sourceCodeMode: Boolean,
    },
    data(): {
        view?: BaseView
    } {
        return {
            view: undefined,
        }
    },
    watch: {
        sourceCodeMode: function(newVal, oldVal) {
            console.log("sourceCodeMode:", this.sourceCodeMode)
            if (!this.view) return
            if (newVal === oldVal) return
            let View = this.sourceCodeMode ? MarkdownView : ProseMirrorView
            let content = this.view.content
            this.view.destroy()
            this.view = new View(this.$refs.container as HTMLElement, content)
            this.view.focus()
        },
    },
    mounted: function() {
        this.init()
    },
    beforeDestroy: function() {
        if (this.view) this.view.destroy()
    },
    methods: {
        init: function() {
            let place = this.$refs.container as HTMLElement
            this.view = new ProseMirrorView(place, defaultContent)
        },
    },
})
</script>

<style lang="sass" scoped>
@import url("../../../node_modules/github-markdown-css/github-markdown.css")
@import url("../style/editor.sass")
</style>
