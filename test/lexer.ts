import { assert } from 'chai';
import 'mocha';


import { InlineLexer } from '../src/markdown/lexer'
import { Token } from '../src/markdown/token'

describe('InlineLexer', function () {
    let lexer = new InlineLexer()

    function assertTokenEqual(a: Token[], b: Token[]) {
        a.forEach(token => token.classes.sort())
        b.forEach(token => token.classes.sort())
        return assert.deepEqual(a, b)
    }
})
