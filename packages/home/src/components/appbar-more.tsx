import React from "react"

export const AppbarMore: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <div className="sm:hidden">
        <button
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 transition duration-150 ease-in-out hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500"
            type="button"
            onClick={onClick}
        >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                ></path>
            </svg>
        </button>
    </div>
)
