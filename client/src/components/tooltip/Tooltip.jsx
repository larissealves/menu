import React, { useEffect, useState } from 'react'

export default function Tooltip({ className, tooltipContent, children }) {
    const API_BASE_URL =
        import.meta.env.VITE_API_URL || 'https://menu-2hxb.onrender.com';

    const baseStyle =
        "text-white font-normal px-2 rounded-lg flex items-center mb-2 "

    const setClassCssBackgroundColor = () => {
        if (className === "message") {
            return 'bg-purple-700'; // message
        }
        if (className === "alert") {
            return 'bg-yellow-600'; // alert
        }
        return 'bg-gray-400'; // default / disabled
    };


    const setNewClassCss = `${baseStyle} ${setClassCssBackgroundColor()}`

    return (
        <div className="tooltip">
            <div className={`${setNewClassCss} tooltip-title`} >{tooltipContent}</div>
            <div className="tooltip-content" >{children}</div>
        </div>
    );
}
