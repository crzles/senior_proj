import {Calendar, ClipboardList, House, MapPin, Pill, User} from "lucide-react"
import {useLocation, useNavigate} from "react-router-dom"
import {useTheme} from "../context/ThemeContext"

const navItems = [
    {label: "Home", path: "/home", icon: House},
    {label: "My Medications", path: "/MedPage", icon: Pill},
    {label: "Map", path: "/map", icon: MapPin},
    {label: "Symptoms", path: "/symptoms", icon: ClipboardList},
    {label: "Calendar", path: "/coming-soon", icon: Calendar},
    {label: "Profile", path: "/profile", icon: User},
]

// The bottom tab bar shared by the main pages. It highlights the tab for the current page.
function BottomNav() {
    const navigate = useNavigate()
    const location = useLocation()
    const {theme, currentTheme} = useTheme()

    const activeColor = theme === "dark" ? "text-blue-400" : "text-blue-600"

    return (
        <nav className={`fixed bottom-0 left-0 right-0 ${currentTheme.card} border-t ${currentTheme.border} px-2 py-2`}>
            <div className="flex justify-around">
                {navItems.map(({label, path, icon: Icon}) => {
                    // The Calendar tab points at Coming Soon, which is not a tab of its own.
                    const isActive = label !== "Calendar" && location.pathname === path

                    return (
                        <button
                            key={label}
                            onClick={() => navigate(path)}
                            aria-current={isActive ? "page" : undefined}
                            className={`flex flex-col items-center gap-0.5 text-xs ${
                                isActive
                                    ? `${activeColor} font-semibold`
                                    : currentTheme.secondaryText
                            }`}
                        >
                            <Icon className="h-5 w-5" strokeWidth={isActive ? 2.25 : 1.75} aria-hidden="true" />
                            {label}
                        </button>
                    )
                })}
            </div>
        </nav>
    )
}

export default BottomNav
