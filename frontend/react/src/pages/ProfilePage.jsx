import { useNavigate } from "react-router-dom"
import { useTheme } from "../context/ThemeContext"
import pillbugLogo from "../assets/pillbug-logo.png"

const profileSections = [
    {
        title: "User information",
        description: "Personal details will appear here.",
    },
    {
        title: "Allergens",
        description: "Your saved allergens will appear here.",
    },
    {
        title: "Health habits",
        description: "Your health habits will appear here.",
    },
    {
        title: "Symptom history",
        description: "Your symptom history will appear here.",
    },
]

function ProfilePage() {
    const navigate = useNavigate()
    const {currentTheme} = useTheme()

    return (
        <div className={`min-h-screen ${currentTheme.background} p-4`}>
            <header className="mb-6 flex items-center justify-between">
                <img
                    src={pillbugLogo}
                    alt="PillBug"
                    className="h-10 w-10 object-contain"
                />
                <button
                    type="button"
                    onClick={() => navigate("/home")}
                    className={`${currentTheme.text} rounded-lg px-3 py-2 text-sm font-medium hover:bg-black/5`}
                >
                    ← Back to Home
                </button>
            </header>

            <main className="mx-auto w-full max-w-2xl">
                <div className="mb-6">
                    <h1 className={`${currentTheme.text} text-2xl font-bold`}>
                        User Profile
                    </h1>
                    <p className={`${currentTheme.secondaryText} mt-1 text-sm`}>
                        Manage your personal health information.
                    </p>
                </div>

                <div className="space-y-3">
                    {profileSections.map(({title, description}) => (
                        <details
                            key={title}
                            className={`${currentTheme.card} ${currentTheme.border} group rounded-xl border shadow-sm`}
                        >
                            <summary className={`${currentTheme.text} flex cursor-pointer list-none items-center justify-between p-4 font-semibold`}>
                                {title}
                                <span className={`${currentTheme.secondaryText} transition-transform group-open:rotate-180`} aria-hidden="true">
                                    ⌄
                                </span>
                            </summary>
                            <p className={`${currentTheme.secondaryText} border-t ${currentTheme.border} px-4 py-4 text-sm`}>
                                {description}
                            </p>
                        </details>
                    ))}
                </div>
            </main>
        </div>
    )
}

export default ProfilePage
