import { TaggedProsemirrorNode } from "prosemirror-test-builder"
import { nodes } from "./schema.test"

const { doc, p, h1, ol, li, pre, preJS, blockquote } = nodes

export const testcases: Record<string, [string, TaggedProsemirrorNode]> = {
    paragraph: [
        'hello',
        doc(p('hello'))
    ],
    heading: [
        '# hello',
        doc(h1('hello'))
    ],
    orderedList: [
        '1. aaa\n\n\n2. bbb\n\n\n3. ccc',
        doc(
            ol(
                li(p('aaa')),
                li(p('bbb')),
                li(p('ccc')),
            )
        ),
    ],
    codeBlock: [
        '```\n1+1\n```',
        doc(
            pre('1+1'),
        ),
    ],
    codeBlockWithLanguage: [
        '```javascript\n1+1\n```',
        doc(
            preJS('1+1'),
        ),
    ],
    quote: [
        '> text\n> text',
        doc(
            blockquote(
                p('text\ntext'),
            ),
        ),
    ],
}
