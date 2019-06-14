import { assert } from 'chai';
import 'mocha';

import {
    mergeTokens,
    pushClass,
} from '../src/markdown/token'


describe('Token', function () {
    it('cleanTokens', function () {
        assert.deepEqual(
            mergeTokens([
                { classes: ["A"], length: 0 },
            ]),
            []
        )
        assert.deepEqual(
            mergeTokens([
                { classes: ["A"], length: 0 },
                { classes: ["A"], length: 0 },
            ]),
            []
        )
        assert.deepEqual(
            mergeTokens([
                { classes: ["A"], length: 1 },
                { classes: ["A"], length: 0 },
            ]),
            [
                { classes: ["A"], length: 1 },
            ]
        )
        assert.deepEqual(
            mergeTokens([
                { classes: ["A"], length: 1 },
                { classes: ["A"], length: 1 },
            ]),
            [
                { classes: ["A"], length: 2 },
            ]
        )
        assert.deepEqual(
            mergeTokens([
                { classes: ["A"], length: 1 },
                { classes: ["A"], length: 1 },
                { classes: ["A"], length: 1 },
                { classes: ["A"], length: 1 },
                { classes: ["A"], length: 1 },
            ]),
            [
                { classes: ["A"], length: 5 }
            ]
        )
        assert.deepEqual(
            mergeTokens([
                { classes: ["A"], length: 1 },
                { classes: ["B"], length: 1 },
                { classes: ["C"], length: 1 },
            ]),
            [
                { classes: ["A"], length: 1 },
                { classes: ["B"], length: 1 },
                { classes: ["C"], length: 1 },
            ]
        )
    })
    it('pushClass', function () {
        assert.deepEqual(
            pushClass({ classes: ["B"], length: 0 }, "A"),
            { classes: ["A", "B"], length: 0 }
        )
        assert.deepEqual(
            pushClass({ classes: ["B"], length: 0 }, "B"),
            { classes: ["B"], length: 0 }
        )
        assert.deepEqual(
            pushClass({ classes: ["decoration_mark"], length: 0 }, "B"),
            { classes: ["decoration_mark"], length: 0 }
        )
    })
})


