# Contributing to Rino

Thank you for considering contributing to Rino! We welcome contributions from the community and are grateful for any help you can provide.

## How to Contribute

Here are some ways you can contribute to the project:

- Report bugs and request features by opening an issue
- Suggest improvements to the codebase by opening a pull request
- Write or improve documentation
- Share the project with others and spread the word

## Setting up the Development Environment

To set up the development environment for the project, follow these steps:

1. Enable [Node.js Corepack](https://nodejs.org/docs/latest-v18.x/api/corepack.html): `corepack enable`
2. Clone the repository: `git clone https://github.com/ocavue/rino.git`
3. Install the dependencies: `pnpm install`
4. Start the dev server for the editor playground: `pnpm -w dev playground`
5. Open `http://localhost:3001` in your browser.

## Submitting Changes

To submit changes, follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b my-branch`
3. Make your changes
4. Make sure that the code follows the TypeScript coding guidelines and the project's coding style by running `pnpm -w typecheck` and `pnpm -w fix`.
5. Commit your changes using a descriptive commit message that follows the ["Conventional Commits" conventions](https://www.conventionalcommits.org/en/v1.0.0/).
6. Push the branch: `git push origin my-branch`
7. Open a pull request and describe the changes you have made

## License

By contributing to the project, you agree to license your contributions under the GPL-3.0 License. Please be aware that the project owner reserves the right to change the license in the future without notifying you. We appreciate your understanding and support.

Thank you for your contributions!
