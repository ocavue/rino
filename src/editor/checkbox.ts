import { EditorView, NodeView } from "prosemirror-view"
import { Plugin } from "prosemirror-state"
import { Node as ProsemirrorNode } from "prosemirror-model"
import { schema } from "./schema"

class ListItemView implements NodeView {
    public dom: HTMLElement
    public contentDOM: HTMLElement

    public constructor(node: ProsemirrorNode, view: EditorView, getPos: () => number) {
        this.dom = this.contentDOM = document.createElement("li")
        this.updateListItemClass(node)
    }

    public update(node: ProsemirrorNode) {
        if (node.type !== schema.nodes.rinoListItem) return false
        this.updateListItemClass(node)
        return true
    }

    private updateListItemClass(node: ProsemirrorNode) {
        const className = "selectable-list-item"
        const hasClass = this.contentDOM.classList.contains(className)
        //  TODO: typescript 3.7: node.firstChild?.type.name
        const shouldHasClass = node.firstChild && node.firstChild.type === schema.nodes.rinoCheckbox

        if (hasClass !== shouldHasClass) {
            shouldHasClass
                ? this.contentDOM.classList.add(className)
                : this.contentDOM.classList.remove(className)
        }
    }
}

export const checkboxPlugin = new Plugin({
    /*
    https://discuss.prosemirror.net/t/how-to-update-the-value-of-an-input/2147
    > I think the nicest way to do this would be to define a node view that, when it detects
    > change/input events on its field, uses the `getPos` callback it was given on creation
    > to figure out where the field is, and dispatches the appropriate transaction.
    >
    > You can also use [`posAtDOM`](http://prosemirror.net/docs/ref/#view.EditorView.posAtDOM)
    > to go from the event’s `target` property to a document position, but when the node is
    > re-rendered (over which you don’t have control, without a node view), that’ll annoyingly
    > mess with focus and cursor position inside the field.
    */
    props: {
        nodeViews: {
            rinoListItem: (
                node: ProsemirrorNode,
                view: EditorView,
                getPos: boolean | (() => number),
            ) => {
                return new ListItemView(node, view, getPos as () => number)
            },
            rinoCheckbox: (
                node: ProsemirrorNode,
                view: EditorView,
                getPos: boolean | (() => number),
            ) => {
                let checked = !!node.attrs.checked
                const dom = document.createElement("input")
                dom.setAttribute("type", "checkbox")
                dom.onclick = () => {
                    const pos = (getPos as () => number)()
                    checked = !checked
                    view.dispatch(view.state.tr.setNodeMarkup(pos, undefined, { checked }))
                }
                if (node.attrs.checked) dom.setAttribute("checked", "")
                const nodeView: NodeView = {
                    dom,
                    ignoreMutation: () => true,
                }
                return nodeView
            },
        },
    },
})
