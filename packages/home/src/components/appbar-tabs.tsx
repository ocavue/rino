import React from "react"

const className =
    "text-base leading-6 font-medium text-gray-500 transition ease-in-out duration-150 hover:text-gray-900 focus:outline-none focus:text-gray-900"

export const AppbarTabs: React.FC = () => (
    <nav className="hidden space-x-10 md:flex">
        <a
            className={className}
            href="https://github.com/ocavue/rino"
            target="_blank"
            rel="noreferrer"
        >
            GitHub
        </a>
    </nav>
)
