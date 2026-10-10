import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDemo } from "../context/DemoContext"
import { useTheme } from "../context/ThemeContext"

function MedicationList() {
    const [searchQuery, setSearchQuery] = useState("")
    const [typeFilter, setTypeFilter] = useState("All")
    const [showProfileMenu, setShowProfileMenu] = useState(false)

    const {demoUser, demoMedications} = useDemo()
    const {currentTheme} = useTheme()
    const navigate = useNavigate()

    const medications = demoMedications.filter((medication) => {
        const matchesSearch = medication.med_name
            .toLowerCase()
            .includes(searchQuery.toLowerCase())

        const matchesType =
            typeFilter === "All" ||
            medication.med_type === typeFilter

        return matchesSearch && matchesType
    })

    function goToAddMedication() {
        navigate("/add-medication")
    }

    function goToEditMedication(id) {
        navigate(`/edit-medication?id=${id}`)
    }

    function goToMedicationInfo(id) {
        navigate(`/medication-info?id=${id}`)
    }

    function getNextDose(medication) {
        if (medication.recurrence === "As needed") {
            return "As needed"
        }

        const times =
            medication.reminder_times?.length > 0
                ? medication.reminder_times
                : medication.first_dose_time
                    ? [medication.first_dose_time]
                    : []

        if (times.length === 0) {
            return "See schedule"
        }

        const now = new Date()

        const upcomingTimes = times
            .map((time) => {
                const [hours, minutes] = time.split(":")
                const date = new Date()

                date.setHours(Number(hours))
                date.setMinutes(Number(minutes))
                date.setSeconds(0)
                date.setMilliseconds(0)

                return date
            })
            .filter((date) => date > now)

        const nextDose =
            upcomingTimes.length > 0
                ? upcomingTimes.sort((a, b) => a - b)[0]
                : (() => {
                    const [hours, minutes] = times[0].split(":")
                    const tomorrow = new Date()

                    tomorrow.setDate(tomorrow.getDate() + 1)
                    tomorrow.setHours(Number(hours))
                    tomorrow.setMinutes(Number(minutes))
                    tomorrow.setSeconds(0)
                    tomorrow.setMilliseconds(0)

                    return tomorrow
                })()

        return nextDose.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
        })
    }

    return (
        <div className={`min-h-screen ${currentTheme.background} p-4 pb-24 flex flex-col`}>

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className={`${currentTheme.secondaryText} text-sm`}>
                        PillBug
                    </p>

                    <h1 className={`${currentTheme.text} text-xl font-bold`}>
                        My Medications
                    </h1>

                    <p className={`${currentTheme.secondaryText} text-sm`}>
                        Keep track of your medications and supplements
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {/* Profile Button */}
                    <div className="relative">
                        <button
                            onClick={() => setShowProfileMenu((open) => !open)}
                            aria-label="Open profile menu"
                            aria-expanded={showProfileMenu}
                            className={`w-10 h-10 ${currentTheme.primary} text-white rounded-full font-semibold`}
                        >
                            {demoUser
                                ? `${demoUser.firstName.charAt(0)}${demoUser.lastName.charAt(0)}`
                                : "?"}
                        </button>

                        {showProfileMenu && (
                            <div className={`absolute right-0 top-12 z-30 w-56 ${currentTheme.card} ${currentTheme.border} border rounded-xl p-3 shadow-lg`}>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className={`w-10 h-10 ${currentTheme.primary} text-white rounded-full flex items-center justify-center font-semibold`}>
                                        {demoUser
                                            ? `${demoUser.firstName.charAt(0)}${demoUser.lastName.charAt(0)}`
                                            : "?"}
                                    </div>

                                    <div className="min-w-0">
                                        <p className={`${currentTheme.text} font-semibold truncate`}>
                                            {demoUser
                                                ? `${demoUser.firstName} ${demoUser.lastName}`
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
                                        navigate("/")
                                    }}
                                    className="w-full text-left text-red-500 hover:bg-red-50 rounded-lg px-3 py-2 text-sm font-medium"
                                >
                                    Sign out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Medication Summary */}
            <div className={`${currentTheme.primary} text-white rounded-xl p-4 mb-4`}>
                <p className="text-sm opacity-80">
                    Your medication routine
                </p>

                <h2 className="text-lg font-bold">
                    {demoMedications.length}{" "}
                    {demoMedications.length === 1
                        ? "medication"
                        : "medications"}{" "}
                    added
                </h2>
            </div>

            {/* Your Medications */}
            <div className="mb-4">

                <h2 className={`text-lg font-bold mb-3 ${currentTheme.text}`}>
                    Your Medications
                </h2>

                {/* Search Bar */}
                <div className={`flex items-center gap-2 ${currentTheme.card} border ${currentTheme.border} rounded-xl px-3 py-2 mb-3`}>
                    <span>🔍</span>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder="Search medications by name..."
                        className={`w-full bg-transparent outline-none text-sm ${currentTheme.text}`}
                    />
                </div>

                {/* Type Filter */}
                <div className="flex gap-2 mb-4">
                    {["All", "Medication", "Supplement"].map((type) => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => setTypeFilter(type)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                typeFilter === type
                                    ? `${currentTheme.primary} text-white`
                                    : `${currentTheme.card} ${currentTheme.secondaryText} border ${currentTheme.border}`
                            }`}
                        >
                            {type === "All"
                                ? "All"
                                : type === "Medication"
                                    ? "Medications"
                                    : "Supplements"}
                        </button>
                    ))}
                </div>

                <div className="space-y-3">

                    {medications.length === 0 ? (
                        <div className={`${currentTheme.card} rounded-xl p-6 text-center shadow-sm`}>
                            <p className={`${currentTheme.text} font-semibold`}>
                                No matching medications
                            </p>
                            <p className={`${currentTheme.secondaryText} text-sm mt-1`}>
                                Try another name or change the type filter.
                            </p>
                        </div>
                    ) : (
                    medications.map((medication) => (
                        <div
                            key={medication.id}
                            className={`${currentTheme.card} rounded-xl p-4 shadow-sm`}
                        >

                            {/* Medication Name */}
                            <div className="flex items-start justify-between gap-3 mb-3">

                                <div>
                                    <h3 className={`text-lg font-bold ${currentTheme.text}`}>
                                        {medication.med_name}
                                    </h3>

                                    <p className={`text-sm ${currentTheme.secondaryText}`}>
                                        {medication.dosage}
                                    </p>
                                </div>

                                <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold">
                                    Active
                                </span>

                            </div>

                            {/* Medication Details */}
                            <div className="grid grid-cols-2 gap-3 mb-3">

                                <div className="bg-gray-100 rounded-lg p-3">
                                    <p className={`text-xs ${currentTheme.secondaryText} mb-1`}>
                                        Frequency
                                    </p>

                                    <p className={`text-sm font-semibold ${currentTheme.text}`}>
                                        {medication.recurrence}
                                    </p>
                                </div>

                                <div className="bg-gray-100 rounded-lg p-3">
                                    <p className={`text-xs ${currentTheme.secondaryText} mb-1`}>
                                        Per dose
                                    </p>

                                    <p className={`text-sm font-semibold ${currentTheme.text}`}>
                                        {medication.pills_per_dose}{" "}
                                        {medication.pills_per_dose === 1
                                            ? "pill"
                                            : "pills"}
                                    </p>
                                </div>

                            </div>

                            {/* Next Dose */}
                            <div className="bg-gray-100 rounded-lg p-3 mb-3">

                                <div className="flex items-center justify-between">
                                    <p className={`text-sm ${currentTheme.secondaryText}`}>
                                        Next dose
                                    </p>

                                    <p className={`text-sm font-semibold ${currentTheme.text}`}>
                                        {getNextDose(medication)}
                                    </p>
                                </div>

                            </div>

                            {/* Buttons */}
                            <div className="grid grid-cols-2 gap-2">

                                <button
                                    type="button"
                                    onClick={() =>
                                        goToEditMedication(medication.id)
                                    }
                                    className={`py-2 ${currentTheme.card} border ${currentTheme.border} ${currentTheme.text} rounded-lg text-sm font-medium hover:opacity-80`}
                                >
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        goToMedicationInfo(medication.id)
                                    }
                                    className={`py-2 ${currentTheme.primary} text-white rounded-lg text-sm font-medium hover:opacity-90`}
                                >
                                    More Info
                                </button>

                            </div>

                        </div>
                    ))
                    )}

                </div>
            </div>

            {/* Add Medication */}
            <button
                type="button"
                onClick={goToAddMedication}
                className={`w-full py-3 ${currentTheme.primary} text-white font-semibold rounded-xl hover:opacity-90`}
            >
                + Add Medication
            </button>

            {/* Bottom Navigation */}
            <nav className={`fixed bottom-0 left-0 right-0 ${currentTheme.card} border-t ${currentTheme.border} px-2 py-2`}>

                <div className="flex justify-around">

                    <button
                        onClick={() => navigate("/home")}
                        className={`flex flex-col items-center ${currentTheme.secondaryText} text-xs`}>
                        <span className="text-lg">⌂</span>
                        Home
                    </button>

                    <button
                        onClick={() => navigate("/MedPage")}
                        className={`flex flex-col items-center ${currentTheme.secondaryText} text-xs`}>
                        <span className="text-lg">💊</span>
                        My Medications
                    </button>

                    <button
                        onClick={() => navigate("/coming-soon")}
                        className={`flex flex-col items-center ${currentTheme.secondaryText} text-xs`}>
                        <span className="text-lg">📍</span>
                        Map
                    </button>

                    <button
                        onClick={() => navigate("/coming-soon")}
                        className={`flex flex-col items-center ${currentTheme.secondaryText} text-xs`}>
                        <span className="text-lg">📝</span>
                        Symptoms
                    </button>

                    <button
                        onClick={() => navigate("/coming-soon")}
                        className={`flex flex-col items-center ${currentTheme.secondaryText} text-xs`}>
                        <span className="text-lg">📅</span>
                        Calendar
                    </button>

                    <button
                        onClick={() => navigate("/coming-soon")}
                        className={`flex flex-col items-center ${currentTheme.secondaryText} text-xs`}>
                        <span className="text-lg">👤</span>
                        Profile
                    </button>

                </div>
            </nav>

        </div>
    )
}

export default MedicationList