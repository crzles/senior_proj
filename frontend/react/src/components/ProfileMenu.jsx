import {useState} from "react"
import {useNavigate} from "react-router-dom"
import {useDemo} from "../context/DemoContext"
import {useTheme} from "../context/ThemeContext"

function ProfileMenu() {
    const [showProfileMenu, setShowProfileMenu] = useState(false)

    const navigate = useNavigate()
    const {demoUser, signOut} = useDemo()
    const {currentTheme} = useTheme()

    const initials = demoUser
        ? `${demoUser.first_name.charAt(0)}${demoUser.last_name.charAt(0)}`
        : "?"

    return (
        <div className="relative">
            <button
                onClick={() => setShowProfileMenu((open) => !open)}
                aria-label="Open profile menu"
                aria-expanded={showProfileMenu}
                className={`w-10 h-10 ${currentTheme.primary} text-white rounded-full font-semibold`}
            >
                {initials}
            </button>

            {/* Profile Pop-up Menu (opens when the initials button above is clicked) */}
            {showProfileMenu && (
                <div className={`absolute right-0 top-12 z-30 w-56 ${currentTheme.card} ${currentTheme.border} border rounded-xl p-3 shadow-lg`}>
                    <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 ${currentTheme.primary} text-white rounded-full flex items-center justify-center font-semibold`}>
                            {initials}
                        </div>

                        <div className="min-w-0">
                            <p className={`${currentTheme.text} font-semibold truncate`}>
                                {demoUser
                                    ? `${demoUser.first_name} ${demoUser.last_name}`
                                    : "Guest"}
                            </p>
                            <p className={`${currentTheme.secondaryText} text-xs`}>
                                Version 1.0.0
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            setShowProfileMenu(false)
                            signOut()
                            navigate("/")
                        }}
                        className={`w-full text-left ${currentTheme.dangerText} ${currentTheme.dangerHover} rounded-lg px-3 py-2 text-sm font-medium`}
                    >
                        Sign out
                    </button>
                </div>
            )}
        </div>
    )
}

export default ProfileMenu
