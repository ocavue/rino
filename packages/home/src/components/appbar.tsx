import React from "react"

export const Appbar: React.FC = ({ children }) => (
    <div className="flex justify-between items-center border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10">
        {children}
    </div>
)
