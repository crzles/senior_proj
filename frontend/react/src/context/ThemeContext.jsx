import {createContext, useContext, useEffect, useState} from "react"

const ThemeContext = createContext()

const themes = {
    light: {
        background: "bg-gradient-to-br from-blue-100 via-purple-100 to-purple-200",
        card: "bg-white",
        text: "text-gray-900",
        secondaryText: "text-gray-600",
        primary: "bg-blue-600",
        primaryHover: "hover:bg-blue-700",
        border: "border-gray-200",
        // Panels inside a card, and light-blue icon chips
        inset: "bg-gray-100",
        accentSoft: "bg-blue-50 text-blue-600",
        // Blue and red for text and outlines that sit on a card
        accentText: "text-blue-600",
        accentBorder: "border-blue-600",
        dangerText: "text-red-500",
        dangerHover: "hover:bg-red-50",
        // Green and red message boxes
        successSoft: "bg-green-50 text-green-700",
        dangerSoft: "bg-red-50 text-red-700",
    },

    dark: {
        background: "bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950",
        card: "bg-slate-800",
        text: "text-white",
        secondaryText: "text-gray-300",
        primary: "bg-blue-500",
        primaryHover: "hover:bg-blue-600",
        border: "border-slate-700",
        inset: "bg-slate-700",
        accentSoft: "bg-blue-500/20 text-blue-300",
        accentText: "text-blue-400",
        accentBorder: "border-blue-400",
        dangerText: "text-red-400",
        dangerHover: "hover:bg-red-500/10",
        successSoft: "bg-green-900/40 text-green-300",
        dangerSoft: "bg-red-900/40 text-red-300",
    },
}

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(
        localStorage.getItem("pillbug-theme") || "light"
    )

    function changeTheme(newTheme) {
        setTheme(newTheme)
        localStorage.setItem("pillbug-theme", newTheme)
    }

    useEffect(() => {
        document.documentElement.style.colorScheme = theme
    }, [theme])

    return (
        <ThemeContext.Provider
            value={{
                theme,
                themes,
                currentTheme: themes[theme],
                changeTheme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    return useContext(ThemeContext)
}