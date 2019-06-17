import { builders } from "prosemirror-test-builder"
import { schema } from "../index"
import { assert } from 'chai';
import 'mocha';


const types = {
    p: { nodeType: "paragraph" },
    a: { markType: "link", href: "foo" },
    h1: { nodeType: "rinoHeading", level: 1 },
    h2: { nodeType: "rinoHeading", level: 2 },
    h3: { nodeType: "rinoHeading", level: 3 },
    h4: { nodeType: "rinoHeading", level: 4 },
    h5: { nodeType: "rinoHeading", level: 5 },
    h6: { nodeType: "rinoHeading", level: 6 },
    hr: { nodeType: "rinoHorizontalRule" },
    li: { nodeType: "rinoListItem" },
    ol: { nodeType: "rinoOrderedList" },
    ul: { nodeType: "rinoBulletList" },
    br: { nodeType: "rinoHardBreak" },
    pre: { nodeType: "rinoCodeBlock" },
    img: { nodeType: "image", src: "img.png", alt: "x" }
}

const builded = builders(schema, types)

describe('schema', function () {
    describe('types', function () {
        for (let key of Object.keys(types)) {
            it(`key: ${key}`, function () {
                assert.equal(typeof builded[key], 'function')
            })
        }
    })
})