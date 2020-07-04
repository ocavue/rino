import React from "react"

const Link: React.FC<{ href: string; text: string }> = ({ href, text }) => (
    <a target="_blank" rel="noreferrer" href={href} className="mx-4 text-gray-500 underline">
        {text}
    </a>
)

export const Footer: React.FC = () => (
    <div className="relative mt-20 mb-0 pt-20 pb-20 bg-gray-100 w-full flex justify-center">
        <Link text="Twitter" href="https://twitter.com/rino_editor" />
        <Link text="Github" href="https://github.com/ocavue/rino" />
        <Link text="Email" href="mailto:support@rino.app" />
    </div>
)
