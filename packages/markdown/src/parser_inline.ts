/** internal
 * class ParserInline
 *
 * Tokenizes paragraph content.
 **/

////////////////////////////////////////////////////////////////////////////////
// Parser rules

import MarkdownIt from "markdown-it"
import Ruler from "markdown-it/lib/ruler"
import Token from "markdown-it/lib/token"

import { autolink } from "./rules_inline/autolink"
import { backticks } from "./rules_inline/backticks"
import { balancePairs } from "./rules_inline/balance_pairs"
import { emphasis, postEmphasis } from "./rules_inline/emphasis"
import { entity } from "./rules_inline/entity"
import { escape } from "./rules_inline/escape"
import { htmlInline } from "./rules_inline/html_inline"
import { image } from "./rules_inline/image"
import { link } from "./rules_inline/link"
import { newline } from "./rules_inline/newline"
import { postStrikethrough, strikethrough } from "./rules_inline/strikethrough"
import { text } from "./rules_inline/text"
import { textCollapse } from "./rules_inline/text_collapse"
import { StateInline } from "./state_inline"

// prettier-ignore
const _rules = [
    [ 'text',            text          ],
    [ 'newline',         newline       ],
    [ 'escape',          escape        ],
    [ 'backticks',       backticks     ],
    [ 'strikethrough',   strikethrough ],
    [ 'emphasis',        emphasis      ],
    [ 'link',            link          ],
    [ 'image',           image         ],
    [ 'autolink',        autolink      ],
    [ 'html_inline',     htmlInline    ],
    [ 'entity',          entity        ],
] as const

// prettier-ignore
const _rules2 = [
    [ 'balance_pairs',   balancePairs      ],
    [ 'strikethrough',   postStrikethrough ],
    [ 'emphasis',        postEmphasis      ],
    [ 'text_collapse',   textCollapse      ],
] as const

export class ParserInline {
    /**
     * ParserInline#ruler -> Ruler
     *
     * [[Ruler]] instance. Keep configuration of inline rules.
     **/
    ruler: Ruler<typeof _rules[number][1]>

    /**
     * ParserInline#ruler2 -> Ruler
     *
     * [[Ruler]] instance. Second ruler used for post-processing
     * (e.g. in emphasis-like rules).
     **/
    ruler2: Ruler<typeof _rules2[number][1]>

    State: typeof StateInline

    constructor() {
        this.ruler = new Ruler()
        for (let i = 0; i < _rules.length; i++) {
            this.ruler.push(_rules[i][0], _rules[i][1])
        }
        this.ruler2 = new Ruler()
        for (let i = 0; i < _rules2.length; i++) {
            this.ruler2.push(_rules2[i][0], _rules2[i][1])
        }
        this.State = StateInline
    }

    // Skip single token by running all rules in validation mode;
    // returns `true` if any rule reported success
    //
    skipToken(state: StateInline) {
        let ok,
            i,
            pos = state.pos,
            rules = this.ruler.getRules(""),
            len = rules.length,
            maxNesting = state.options.maxNesting,
            cache = state.cache

        if (typeof cache[pos] !== "undefined") {
            state.pos = cache[pos]
            return
        }

        if (state.level < maxNesting) {
            for (i = 0; i < len; i++) {
                // Increment state.level and decrement it later to limit recursion.
                // It's harmless to do here, because no tokens are created. But ideally,
                // we'd need a separate private state variable for this purpose.
                //
                state.level++
                ok = rules[i](state, true)
                state.level--

                if (ok) {
                    break
                }
            }
        } else {
            // Too much nesting, just skip until the end of the paragraph.
            //
            // NOTE: this will cause links to behave incorrectly in the following case,
            //       when an amount of `[` is exactly equal to `maxNesting + 1`:
            //
            //       [[[[[[[[[[[[[[[[[[[[[foo]()
            //
            // TODO: remove this workaround when CM standard will allow nested links
            //       (we can replace it by preventing links from being parsed in
            //       validation mode)
            //
            state.pos = state.posMax
        }

        if (!ok) {
            state.pos++
        }
        cache[pos] = state.pos
    }

    // Generate tokens for input range
    //
    tokenize(state: StateInline) {
        let ok,
            i,
            rules = this.ruler.getRules(""),
            len = rules.length,
            end = state.posMax,
            maxNesting = state.options.maxNesting

        while (state.pos < end) {
            // Try all possible rules.
            // On success, rule should:
            //
            // - update `state.pos`
            // - update `state.tokens`
            // - return true

            if (state.level < maxNesting) {
                for (i = 0; i < len; i++) {
                    ok = rules[i](state, false)
                    if (ok) {
                        break
                    }
                }
            }

            if (ok) {
                if (state.pos >= end) {
                    break
                }
                continue
            }

            state.pending += state.src[state.pos++]
        }

        if (state.pending) {
            state.pushPending()
        }
    }

    /**
     * ParserInline.parse(str, md, env, outTokens)
     *
     * Process input string and push inline tokens into `outTokens`
     **/
    parse(str: string, md: MarkdownIt, env: any, outTokens: Token[]) {
        let i, rules, len
        let state = new StateInline(str, md, env, outTokens, this, md.options)

        this.tokenize(state)

        rules = this.ruler2.getRules("")
        len = rules.length

        for (i = 0; i < len; i++) {
            rules[i](state)
        }
    }
}
