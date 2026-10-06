import {createContext, useContext, useState} from "react"

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
    },

    dark: {
        background: "bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950",
        card: "bg-slate-800",
        text: "text-white",
        secondaryText: "text-gray-300",
        primary: "bg-blue-500",
        primaryHover: "hover:bg-blue-600",
        border: "border-slate-700",
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