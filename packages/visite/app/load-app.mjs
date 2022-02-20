export const pages = import.meta.globEager("/src/pages/_app.(jsx|js|tsx|ts)")

export const App = Object.values(pages)[0]?.default
