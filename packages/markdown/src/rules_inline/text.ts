// Skip text characters for text token, place those to pending buffer
// and increment current pos

import { StateInline } from "../state_inline"

// Rule to skip pure text
// '{}$%@~+=:' reserved for extentions

// !, ", #, $, %, &, ', (, ), *, +, ,, -, ., /, :, ;, <, =, >, ?, @, [, \, ], ^, _, `, {, |, }, or ~

// !!!! Don't confuse with "Markdown ASCII Punctuation" chars
// http://spec.commonmark.org/0.15/#ascii-punctuation-character
function isTerminatorChar(ch: number) {
    switch (ch) {
        case 0x0a /* \n */:
        case 0x21 /* ! */:
        case 0x23 /* # */:
        case 0x24 /* $ */:
        case 0x25 /* % */:
        case 0x26 /* & */:
        case 0x2a /* * */:
        case 0x2b /* + */:
        case 0x2d /* - */:
        case 0x3a /* : */:
        case 0x3c /* < */:
        case 0x3d /* = */:
        case 0x3e /* > */:
        case 0x40 /* @ */:
        case 0x5b /* [ */:
        case 0x5c /* \ */:
        case 0x5d /* ] */:
        case 0x5e /* ^ */:
        case 0x5f /* _ */:
        case 0x60 /* ` */:
        case 0x7b /* { */:
        case 0x7d /* } */:
        case 0x7e /* ~ */:
            return true
        default:
            return false
    }
}

export function text(state: StateInline, silent: boolean) {
    let pos = state.pos

    while (pos < state.posMax && !isTerminatorChar(state.src.charCodeAt(pos))) {
        pos++
    }

    if (pos === state.pos) {
        return false
    }

    if (!silent) {
        state.pending += state.src.slice(state.pos, pos)
    }

    state.pos = pos

    return true
}

// Alternative implementation, for memory.
//
// It costs 10% of performance, but allows extend terminators list, if place it
// to `ParcerInline` property. Probably, will switch to it sometime, such
// flexibility required.

/*
var TERMINATOR_RE = /[\n!#$%&*+\-:<=>@[\\\]^_`{}~]/;

module.exports = function text(state, silent) {
  var pos = state.pos,
      idx = state.src.slice(pos).search(TERMINATOR_RE);

  // first char is terminator -> empty text
  if (idx === 0) { return false; }

  // no terminator -> text till end of string
  if (idx < 0) {
    if (!silent) { state.pending += state.src.slice(pos); }
    state.pos = state.src.length;
    return true;
  }

  if (!silent) { state.pending += state.src.slice(pos, pos + idx); }

  state.pos += idx;

  return true;
};*/
