# rino

[![Coverage Status](https://coveralls.io/repos/github/ocavue/rino/badge.svg?branch=master)](https://coveralls.io/github/ocavue/rino?branch=master)
[![Build Status](https://circleci.com/gh/ocavue/rino/tree/master.svg?&style=shield)](https://circleci.com/gh/ocavue/rino/tree/master)

## Installation

```
yarn install
```

## Running Tests

To run all tests:

```bash
yarn test
```

To run all unit tests:

```bash
yarn test unit
```

To run all e2e tests:

```bash
yarn test e2e
```

To run a special test file:

```bash
yarn test tests/xx.spec.ts
```

You can set environment variable `PUPPETEER_HEADLESS=false` to launch puppeteer in headful mode when running tests.

