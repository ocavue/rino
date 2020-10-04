import { dedent } from "@rino.app/common"

describe("uitls", function () {
    test("dedent", function () {
        expect(dedent(`  aaa\n  bbb`)).toEqual(`aaa\nbbb`)
        expect(
            dedent(`
                    123
                       45678
                    `),
        ).toEqual(`\n123\n   45678\n`)
        expect(
            dedent(`
            123
               45678
            `),
        ).toEqual(`\n123\n   45678\n`)
        expect(
            dedent(`
                      2
                     1
                    0
                    `),
        ).toEqual(`\n  2\n 1\n0\n`)
        expect(
            dedent(`
                      2
                     1
                    0`),
        ).toEqual(`\n  2\n 1\n0`)
    })
})
