
import { useDemo } from "../context/DemoContext"
import { useTheme } from "../context/ThemeContext"
import SymptomHistory from "../components/SymptomHistory"
import UserInformation from "../components/UserInformation"
import Allergies from "../components/Allergies"
import {ChevronDown, ClipboardList, Heart, ShieldAlert, User} from "lucide-react"
import HealthHabits from "../components/HealthHabits"
import BottomNav from "../components/BottomNav"

const profileSections = [
    {
        title: "User information",
        icon: User,
        description: "Personal details will appear here.",
    },
    {
        title: "Allergens",
        icon: ShieldAlert,
        description: "Your saved allergens will appear here.",
    },
    {
        title: "Health habits",
        icon: Heart,
        optional: true,
        description: "Your health habits will appear here.",
    },
    {
        title: "Symptom history",
        icon: ClipboardList,
        description: "Your symptom history will appear here.",
    },
]

function ProfilePage() {
    const {currentTheme} = useTheme()
    const {demoUser, symptomLogs} = useDemo()

    return (
        <div className={`min-h-screen ${currentTheme.background} p-4 pb-24 flex flex-col`}>
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
                    {profileSections.map(({title, description, icon: Icon, optional}) => (
                        <details
                            key={title}
                            className={`${currentTheme.card} ${currentTheme.border} group rounded-xl border shadow-sm`}
                        >
                            <summary className={`${currentTheme.text} flex cursor-pointer list-none items-center justify-between p-4 font-semibold`}>
                                <span className="flex items-center gap-3">
                                    <span className={`flex h-8 w-8 items-center justify-center rounded-full ${currentTheme.accentSoft}`}>
                                        <Icon className="h-4 w-4" aria-hidden="true" />
                                    </span>
                                    {title}
                                </span>

                                <span className="flex items-center gap-2">
                                    {optional && (
                                        <span className={`${currentTheme.secondaryText} text-xs font-normal`}>
                                            Optional
                                        </span>
                                    )}
                                    <span className={`${currentTheme.secondaryText} transition-transform group-open:rotate-180`} aria-hidden="true">
                                        <ChevronDown className="h-5 w-5" />
                                    </span>
                                </span>
                            </summary>
                            {title === "User information" && demoUser ? (
                                <UserInformation />
                            ) : title === "Allergens" ? (
                                <Allergies />
                            ) : title === "Health habits" ? (
                                <HealthHabits />
                            ) : title === "Symptom history" && symptomLogs.length > 0 ? (
                                <SymptomHistory />
                            ) : (
                                <p className={`${currentTheme.secondaryText} border-t ${currentTheme.border} px-4 py-4 text-sm`}>
                                    {description}
                                </p>
                            )}
                        </details>
                    ))}
                </div>
            </main>

            {/* Bottom Navigation */}
            <BottomNav />
        </div>
    )
}

export default ProfilePage
