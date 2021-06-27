import { css } from "@emotion/css"

import { EDITOR_THEME_BASE } from "./base"

export const EDITOR_THEME_GITHUB = css`
    ${EDITOR_THEME_BASE}

    & .anchor {
        float: left;
        line-height: 1;
        margin-left: -20px;
        padding-right: 4px;
    }

    & .anchor:focus {
        outline: none;
    }

    & {
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%;
        line-height: 1.5;
        word-wrap: break-word;
        font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji;
        font-size: 16px;

        & .show {
            font-size: 16px;
        }

        &.markdown-body--light {
            color: #24292e;
        }
        &.markdown-body--dark {
            color: #d7dbe0;
        }
    }

    & a:active,
    & a:hover {
        outline-width: 0;
    }

    &.markdown-body--dark .md-mark {
        color: rgb(238, 153, 238);
        font-size: 0;
    }
    &.markdown-body--light .md-mark {
        color: rgb(211, 46, 211);
        font-size: 0;
    }

    & strong {
        font-weight: inherit;
        font-weight: bolder;
    }

    & img {
        border-style: none;
    }

    & hr {
        box-sizing: initial;
        height: 0;
        overflow: visible;
    }

    & input {
        font: inherit;
        margin: 0;
    }

    & input {
        overflow: visible;
    }

    & [type="checkbox"] {
        box-sizing: border-box;
        padding: 0;
    }

    & input {
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
    }

    & a {
        color: #0366d6;
        cursor: pointer;

        text-decoration: none;
        &:hover {
            text-decoration: underline;
        }
    }

    & .md-img-uri,
    & .md-img-text,
    & .md-link {
        font-size: 0;
        letter-spacing: 0; // A .md-link element could caontain many characters. Although the font-size is 0, there is still a obvious gap because of the letter-spacing.
    }

    & strong {
        font-weight: 600;
    }

    & hr {
        height: 0;
        margin: 15px 0;
        overflow: hidden;
        background: transparent;
        border: 0;
        border-bottom: 1px solid #dfe2e5;
    }

    & hr:after,
    & hr:before {
        display: table;
        content: "";
    }

    & hr:after {
        clear: both;
    }

    & table {
        border-spacing: 0;
        border-collapse: collapse;
    }

    & td,
    & th {
        padding: 0;
    }

    & details summary {
        cursor: pointer;
    }

    & kbd {
        display: inline-block;
        padding: 3px 5px;
        font: 11px SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;
        line-height: 10px;
        color: #444d56;
        vertical-align: middle;
        background-color: #fafbfc;
        border: 1px solid #d1d5da;
        border-radius: 3px;
        box-shadow: inset 0 -1px 0 #d1d5da;
    }

    & p {
        margin-top: 0;
        margin-bottom: 10px;
    }

    & blockquote {
        margin: 0;
    }

    & ol,
    & ul {
        padding-left: 0;
        margin-top: 0;
        margin-bottom: 0;
    }

    & ol ol,
    & ul ol {
        list-style-type: lower-roman;
    }

    & ol ol ol,
    & ol ul ol,
    & ul ol ol,
    & ul ul ol {
        list-style-type: lower-alpha;
    }

    & dd {
        margin-left: 0;
    }

    & pre {
        margin-top: 0;
        margin-bottom: 0;
    }

    & input::-webkit-inner-spin-button,
    & input::-webkit-outer-spin-button {
        margin: 0;
        -webkit-appearance: none;
        appearance: none;
    }

    & :checked + .radio-label {
        position: relative;
        z-index: 1;
        border-color: #0366d6;
    }

    & .border {
        border: 1px solid #e1e4e8 !important;
    }

    & .border-0 {
        border: 0 !important;
    }

    & .border-bottom {
        border-bottom: 1px solid #e1e4e8 !important;
    }

    & .rounded-1 {
        border-radius: 3px !important;
    }

    & .bg-white {
        background-color: #fff !important;
    }

    & .bg-gray-light {
        background-color: #fafbfc !important;
    }

    & .text-gray-light {
        color: #6a737d !important;
    }

    & hr {
        border-bottom-color: #eee;
    }

    &:after {
        clear: both;
    }

    & a:not([href]) {
        color: inherit;
        text-decoration: none;
    }

    & blockquote,
    & details,
    & dl,
    & ol,
    & p,
    & pre,
    & table,
    & ul {
        margin-top: 0;
        margin-bottom: 16px;
    }

    & hr {
        height: 0.25em;
        padding: 0;
        margin: 24px 0;
        background-color: #e1e4e8;
        border: 0;
    }

    & blockquote {
        padding: 0 1em;
        color: #6a737d;
        border-left: 0.25em solid #dfe2e5;
    }

    & .ProseMirror > h1:first-of-type,
    & .ProseMirror > h2:first-of-type,
    & .ProseMirror > h3:first-of-type,
    & .ProseMirror > h4:first-of-type,
    & .ProseMirror > h5:first-of-type,
    & .ProseMirror > h6:first-of-type {
        margin-top: 0;
    }

    & blockquote > :first-child {
        margin-top: 0;
    }

    & blockquote > :last-child {
        margin-bottom: 0;
    }

    & h1,
    & h2,
    & h3,
    & h4,
    & h5,
    & h6 {
        margin-top: 24px;
        margin-bottom: 16px;
        font-weight: 600;
        line-height: 1.25;
    }

    & h1,
    & h2 {
        padding-bottom: 0.3em;
        border-bottom: 1px solid #eaecef;
    }

    & h1 {
        font-size: 2rem;
        & .show {
            font-size: 2rem;
        }
    }

    & h2 {
        font-size: 1.5rem;
        & .show {
            font-size: 1.5rem;
        }
    }

    & h3 {
        font-size: 1.25rem;
        & .show {
            font-size: 1.25rem;
        }
    }

    & h4 {
        font-size: 1rem;
        & .show {
            font-size: 1rem;
        }
    }

    & h5 {
        font-size: 0.875rem;
        & .show {
            font-size: 0.875rem;
        }
    }

    & h6 {
        color: #6a737d;
        font-size: 0.85rem;
        & .show {
            font-size: 0.85rem;
        }
    }

    & ol,
    & ul {
        padding-left: 2em;
    }

    & ol ol,
    & ol ul,
    & ul ol,
    & ul ul {
        margin-top: 0;
        margin-bottom: 0;
    }

    & li {
        word-wrap: break-all;
    }

    & li > p {
        margin-top: 16px;
    }

    & li + li {
        margin-top: 0.25em;
    }

    & {
        table {
            display: block;
            width: 100%;
            overflow: auto;
        }

        table th {
            font-weight: 600;
        }

        table td,
        table th {
            padding: 6px 13px;
            border: 1px solid #dfe2e5;
        }

        table tr {
            border-top: 1px solid #c6cbd1;
        }

        table tr:nth-child(1) {
            font-weight: 700;
        }

        &.markdown-body--dark table tr {
            background-color: #3b3b3b;
        }

        &.markdown-body--dark table tr:nth-child(2n) {
            background-color: #525252;
        }

        &.markdown-body--light table tr {
            background-color: #dadee6;
        }

        &.markdown-body--light table tr:nth-child(2n) {
            background-color: #f6f8fa;
        }
    }

    & img {
        max-width: 100%;
        box-sizing: initial;
        background-color: #fff;
    }

    & code {
        padding: 0.2em 0.4em;
        margin: 0;
        font-size: 0.85em;

        border-radius: 3px;
    }

    &.markdown-body--light code {
        background-color: rgba(27, 31, 35, 0.05);
    }
    &.markdown-body--dark code {
        background-color: rgba(149, 171, 192, 0.15);
    }

    & pre {
        word-wrap: normal;
    }

    & pre > code {
        padding: 0;
        margin: 0;
        font-size: 100%;
        word-break: normal;
        white-space: pre;
        background: transparent;
        border: 0;
    }

    & .highlight {
        margin-bottom: 16px;
    }

    & .highlight pre {
        margin-bottom: 0;
        word-break: normal;
    }

    & .highlight pre,
    & pre {
        padding: 16px;
        overflow: auto;
        font-size: 85%;
        line-height: 1.45;
        background-color: #f6f8fa;
        border-radius: 3px;
    }

    & pre code {
        display: inline;
        max-width: auto;
        padding: 0;
        margin: 0;
        overflow: visible;
        line-height: inherit;
        word-wrap: normal;
        background-color: initial;
        border: 0;
    }

    & li.selectable-list-item {
        /* CSS4 ':has()' draft can be used here: li:has(> input[type=checkbox]) */
        list-style-type: none;
    }

    & .selectable-list-item + .selectable-list-item {
        margin-top: 3px;
    }

    & li.selectable-list-item > input[type="checkbox"] {
        position: absolute;
        left: -1.3em;
        top: 0.3em;
    }

    &.markdown-body--light {
        caret-color: #000000;
    }
    &.markdown-body--dark {
        caret-color: #ffffff;
    }

    & .CodeMirror {
        padding: 8px;
        border-radius: 4px;

        // By setting an editor's 'height' style to 'auto' and giving the 'viewportMargin' a
        // value of 'Infinity', CodeMirror can be made to automatically resize to fit its
        // content.
        // https://codemirror.net/demo/resize.html
        height: auto;
    }
`
