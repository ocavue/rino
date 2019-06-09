import { assert } from 'chai';
import 'mocha';

import { InlineLexer } from '../src/markdown/lexer'

describe('InlineLexer', function () {
    let lexer = new InlineLexer()

    describe('code', function () {
        it('without space', function () {
            assert.deepEqual(
                lexer.scan("`code`"),
                [
                    { length: 1, class: "decoration_code_open" },
                    { length: 4, class: "decoration_code_text" },
                    { length: 1, class: "decoration_code_close" },
                ],
            )
        })
        it('with two side spaces', function () {
            assert.deepEqual(
                lexer.scan("` code `"),
                [
                    { length: 1, class: "decoration_code_open" },
                    { length: 1, class: "decoration_code_space" },
                    { length: 4, class: "decoration_code_text" },
                    { length: 1, class: "decoration_code_space" },
                    { length: 1, class: "decoration_code_close" },
                ],
            )
        })
        it('with one side space', function () {
            assert.deepEqual(
                lexer.scan("` code`"),
                [
                    { length: 1, class: "decoration_code_open" },
                    { length: 1, class: "decoration_code_space" },
                    { length: 4, class: "decoration_code_text" },
                    { length: 1, class: "decoration_code_close" },
                ],
            )
            assert.deepEqual(
                lexer.scan("`code `"),
                [
                    { length: 1, class: "decoration_code_open" },
                    { length: 4, class: "decoration_code_text" },
                    { length: 1, class: "decoration_code_space" },
                    { length: 1, class: "decoration_code_close" },
                ],
            )
        })
    })

    describe('em', function () {
        it('without space', function () {
            assert.deepEqual(
                lexer.scan("*word*"),
                [
                    { length: 1, class: "decoration_em_open" },
                    { length: 4, class: "decoration_em_text" },
                    { length: 1, class: "decoration_em_close" },
                ],
            )
        })
        it('with space', function () {
            assert.deepEqual(
                lexer.scan("* word *"),
                [
                    { length: 1, class: "decoration_em_open" },
                    { length: 6, class: "decoration_em_text" },
                    { length: 1, class: "decoration_em_close" },
                ],
            )
        })
    })
})
