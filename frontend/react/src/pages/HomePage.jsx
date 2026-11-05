import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDemo } from "../context/DemoContext"
import { useTheme } from "../context/ThemeContext"

function HomePage() {
    const [medicationFilter, setMedicationFilter] = useState("All")
    const [typeFilter, setTypeFilter] = useState("All")
    const [showProfileMenu, setShowProfileMenu] = useState(false)

    const navigate = useNavigate()

    const {demoUser, demoMedications, doseLogs, getDoseKey, toggleDoseTaken} = useDemo()

    const {theme, currentTheme} = useTheme()
    const today = new Date()

    function formatTime(time) {
        const [hour, minute] = time.split(":")
        const date = new Date()
        date.setHours(Number(hour), Number(minute))

        return date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit"
        })
    }

    function getTimeOfDay(time) {
        const [hour] = time.split(":")
        const hourNumber = Number(hour)

        if (hourNumber >= 5 && hourNumber < 12) {
            return "Morning"
        } else if (hourNumber >= 12 && hourNumber < 17) {
            return "Afternoon"
        } else {
            return "Evening"
        }
    }

    function getTimeSections() {
        return ["Morning", "Afternoon", "Evening"]
    }

    // A dose is "Due" from its scheduled time until the grace period ends.
    const DUE_WINDOW_MINUTES = 60

    function getDoseStatus(doseKey, scheduledTime, medication) {
        if (doseLogs[doseKey]) {
            return "Taken"
        }

        // Do not mark a dose as missed if the medication
        // was added after that dose's scheduled time.
        const addedAt = medication.added_at
            ? new Date(medication.added_at)
            : null

        if (addedAt && scheduledTime < addedAt) {
            return "Upcoming"
        }

        const dueUntil = new Date(
            scheduledTime.getTime() + DUE_WINDOW_MINUTES * 60 * 1000
        )

        if (today < scheduledTime) {
            return "Upcoming"
        } else if (today < dueUntil) {
            return "Due"
        } else {
            return "Missed"
        }
    }

    // TODO: Update this to match the reminder_times format used in AddMedication.jsx when advanced scheduling is implemented.
    const doses = demoMedications
        .flatMap((medication) =>
            (medication.reminder_times || []).map((time) => {
                const [hour, minute] = time.split(":")

                const scheduledTime = new Date()
                scheduledTime.setHours(Number(hour), Number(minute), 0, 0)

                const key = getDoseKey(medication.id, time)

                return {
                    key,
                    medication,
                    time,
                    scheduledTime,
                    takenAt: doseLogs[key] || null,
                    status: getDoseStatus(key, scheduledTime, medication),
                }
            })
        )
        .sort((a, b) => a.scheduledTime - b.scheduledTime)

    const takenCount = doses.filter(
        (dose) => dose.status === "Taken"
    ).length

    const pendingCount = doses.filter(
        (dose) => dose.status === "Upcoming" || dose.status === "Due"
    ).length

    const missedCount = doses.filter(
        (dose) => dose.status === "Missed"
    ).length

    // Doses added after their scheduled time are marked "Upcoming" even though
    // that time has already passed, so skip those when picking the next dose.
    const nextDose = doses.find(
        (dose) =>
            dose.status === "Due" ||
            (dose.status === "Upcoming" && dose.scheduledTime > today)
    )

    const tomorrowNextDose = demoMedications
        .filter((medication) => medication.recurrence !== "As needed")
        .flatMap((medication) => {
            const times =
                medication.reminder_times?.length > 0
                    ? medication.reminder_times
                    : medication.first_dose_time
                        ? [medication.first_dose_time]
                        : []

            return times.map((time) => ({
                medication,
                time,
            }))
        })
        .sort((a, b) => a.time.localeCompare(b.time))[0]

    const formattedDate = today.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
    })

    return (
        <div className={`min-h-screen ${currentTheme.background} p-4 pb-24 flex flex-col`}>

            {/* Welcome Header */}
            <div className="mb-4">
                <p className={`${currentTheme.secondaryText} text-sm`}>
                    Welcome to PillBug {demoUser ? `, ${demoUser.firstName}` : ""} 👋
                </p>

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className={`${currentTheme.text} text-xl font-bold`}>
                            Today's Medications
                        </h1>

                        <p className={`text-sm ${currentTheme.secondaryText}`}>
                            📅 {formattedDate}
                        </p>
                    </div>

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

                        {/* Profile Pop-up Menu (opens when the initials button above is clicked) */}
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

            {/* Next Dose Card */}
            {(nextDose || doses.length > 0) && (
                <div
                    className={`${currentTheme.primary} text-white rounded-xl p-4 mb-4 ${nextDose ? "cursor-pointer" : ""}`}
                    onClick={nextDose ? () => navigate(`/medication-info?id=${nextDose.medication.id}`) : undefined}
                    role={nextDose ? "button" : undefined}
                    tabIndex={nextDose ? 0 : undefined}
                    onKeyDown={nextDose ? (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault()
                            navigate(`/medication-info?id=${nextDose.medication.id}`)
                        }
                    } : undefined}
                >
                    <div className="flex items-center gap-3">

                        {/* Clock Icon */}
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <span className="text-xl">
                                ◷
                            </span>
                        </div>

                        {/* Next Dose Information */}
                        <div className="flex-1">
                            {nextDose ? (
                                <>
                                    <p className="text-xs opacity-80">
                                        Next dose
                                    </p>

                                    <h2 className="text-lg font-bold">
                                        {nextDose.medication.med_name} · {formatTime(nextDose.time)}
                                    </h2>

                                    <p className="text-sm opacity-80">
                                        {nextDose.medication.dosage} · {nextDose.medication.pills_per_dose} pill
                                    </p>
                                </>
                            ) : tomorrowNextDose ? (
                                <>
                                    <p className="text-xs opacity-80">
                                        {takenCount === doses.length
                                            ? "All done for today!"
                                            : "Nothing left to take today"}
                                    </p>

                                    <h2 className="text-lg font-bold">
                                        No doses left for today!
                                    </h2>

                                    <p className="text-sm opacity-80">
                                        Tomorrow's next dose → {tomorrowNextDose.medication.med_name} · {formatTime(tomorrowNextDose.time)}
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p className="text-xs opacity-80">
                                        {takenCount === doses.length
                                            ? "All done for today!"
                                            : "Nothing left to take today"}
                                    </p>

                                    <h2 className="text-lg font-bold">
                                        No doses left for today!
                                    </h2>

                                    <p className="text-sm opacity-80">
                                        Check your medication list for your next scheduled dose.
                                    </p>
                                </>
                            )}
                        </div>

                        {/* Arrow */}
                        <div className="text-xl">
                            ➔
                        </div>

                    </div>
                </div>
            )}

            {/* Fresh Start Card */}
            {demoMedications.length === 0 && (
                <div className={`${currentTheme.primary} text-white rounded-xl p-4 mb-4`}>

                    <p className="text-sm opacity-80">
                        A fresh start
                    </p>

                    <h2 className="text-lg font-bold">
                        Your routine starts here
                    </h2>

                    <p className="text-sm opacity-80">
                        Add your first medication to begin.
                    </p>

                </div>
            )}

            {/* Medication Status */}
            <div className="grid grid-cols-3 gap-3 mb-4">

                {/* Taken */}
                <div className={`${currentTheme.card} rounded-xl p-3 text-center shadow-sm`}>
                    <p className="text-xl font-bold text-blue-600">
                        {takenCount}
                    </p>
                    <p className={`${currentTheme.secondaryText} text-xs`}>
                        Taken
                    </p>
                </div>

                {/* Pending */}
                <div className={`${currentTheme.card} rounded-xl p-3 text-center shadow-sm`}>
                    <p className="text-xl font-bold text-yellow-600">
                        {pendingCount}
                    </p>
                    <p className={`${currentTheme.secondaryText} text-xs`}>
                        Pending
                    </p>
                </div>

                {/* Missed */}
                <div className={`${currentTheme.card} rounded-xl p-3 text-center shadow-sm`}>
                    <p className="text-xl font-bold text-red-600">
                        {missedCount}
                    </p>
                    <p className={`${currentTheme.secondaryText} text-xs`}>
                        Missed
                    </p>
                </div>

            </div>

            {/* Dose Progress */}
            {doses.length > 0 && (
                <p className={`${currentTheme.secondaryText} text-sm mb-4`}>
                    {takenCount} of {doses.length} {doses.length === 1 ? "dose" : "doses"} taken today
                </p>
            )}

            {/* Medication Filters */}
            <div className="flex gap-2 mb-4 overflow-x-auto">

                <button
                    onClick={() => setMedicationFilter("All")}
                    className={`px-4 py-2 ${
                        medicationFilter === "All"
                            ? `${currentTheme.primary} text-white`
                            : `${currentTheme.card} ${currentTheme.secondaryText}`
                    } rounded-lg text-sm font-medium`}
                >
                    All
                </button>
                
                <button 
                    onClick={() => setMedicationFilter("Morning")}
                    className={`px-4 py-2 ${
                        medicationFilter === "Morning"
                            ? `${currentTheme.primary} text-white`
                            : `${currentTheme.card} ${currentTheme.secondaryText}`
                    } rounded-lg text-sm font-medium`}>
                    Morning
                </button>

                <button 
                    onClick={() => setMedicationFilter("Afternoon")}
                    className={`px-4 py-2 ${
                        medicationFilter === "Afternoon"
                            ? `${currentTheme.primary} text-white`
                            : `${currentTheme.card} ${currentTheme.secondaryText}`
                    } rounded-lg text-sm font-medium`}>
                    Afternoon
                </button>

                <button 
                    onClick={() => setMedicationFilter("Evening")}
                    className={`px-4 py-2 ${
                        medicationFilter === "Evening"
                            ? `${currentTheme.primary} text-white`
                            : `${currentTheme.card} ${currentTheme.secondaryText}`
                    } rounded-lg text-sm font-medium`}>
                    Evening
                </button>
            </div>

            {/* Your medications */}
            <div className="mb-4">
                <h2 className={`${currentTheme.text} text-lg font-bold mb-2`}>
                    Your Medications
                </h2>

                {demoMedications.length === 0 ? (
                    <div className={`${currentTheme.card} rounded-xl p-6 text-center shadow-sm`}>

                        {/* Pill Icon */}
                        <div className={`w-16 h-16 ${currentTheme.background} rounded-full flex items-center justify-center mx-auto mb-4`}>
                            <span className="text-3xl">
                                💊
                            </span>
                        </div>

                        {/* Empty State Title */}
                        <h3 className={`${currentTheme.text} text-lg font-bold mb-2`}>
                            No medications yet
                        </h3>

                        {/* Description */}
                        <p className={`${currentTheme.secondaryText} text-sm max-w-xs mx-auto`}>
                            Add your first medication or supplement to see your daily
                            schedule here.
                        </p>

                        {/* Divider */}
                        <div className={`border-t ${currentTheme.border} my-4`}></div>

                        {/* No Doses */}
                        <p className={`${currentTheme.secondaryText} text-sm`}>
                            No doses scheduled Today
                        </p>
                    </div>

                ) : (
                    <div>
                        {getTimeSections()
                            .filter((section) => medicationFilter === "All" || medicationFilter === section)
                            .map((section) => {
                                const sectionDoses = doses.filter((dose) => {
                                    const matchesTime =
                                        getTimeOfDay(dose.time) === section

                                    const matchesType =
                                        typeFilter === "All" ||
                                        dose.medication.med_type === typeFilter

                                    return matchesTime && matchesType
                                })

                                if (sectionDoses.length === 0) {
                                    return null
                                }

                                return (
                                    <div key={section} className="mb-6">
                                        <h3 className={`text-lg font-bold mb-3 ${currentTheme.text}`}>
                                            {section}
                                        </h3>

                                        {sectionDoses.map((dose) => {
                                            const {medication, status} = dose

                                            return (
                                                <div
                                                    key={dose.key}
                                                    role="button"
                                                    tabIndex={0}
                                                    onClick={() => navigate(`/medication-info?id=${dose.medication.id}`)}
                                                    onKeyDown={(event) => {
                                                        if (event.target !== event.currentTarget) {
                                                            return
                                                        }

                                                        if (event.key === "Enter" || event.key === " ") {
                                                            event.preventDefault()
                                                            navigate(`/medication-info?id=${dose.medication.id}`)
                                                        }
                                                    }}
                                                    className={`rounded-xl p-4 mb-3 shadow-sm cursor-pointer ${
                                                        status === "Taken"
                                                            ? theme === "dark"
                                                                ? "bg-green-900"
                                                                : "bg-green-100"
                                                            : status === "Due"
                                                            ? theme === "dark"
                                                                ? "bg-yellow-900"
                                                                : "bg-yellow-100"
                                                            : status === "Upcoming"
                                                            ? theme === "dark"
                                                                ? "bg-orange-900"
                                                                : "bg-orange-100"
                                                            : theme === "dark"
                                                                ? "bg-red-950"
                                                                : "bg-red-100"
                                                    }`}
                                                >

                                                    {/* Medication Information*/}
                                                    <div className="flex items-center gap-3">

                                                        {/* Pill Icon */}
                                                        <div className={`w-10 h-10 ${currentTheme.background} rounded-full flex items-center justify-center`}>
                                                            <span className="text-xl">
                                                                💊
                                                            </span>
                                                        </div>

                                                        {/* Medication Details */}
                                                        <div className="flex-1">
                                                            <h3 className={`${currentTheme.text} font-bold`}>
                                                                {medication.med_name}
                                                            </h3>

                                                            <p className={`${currentTheme.secondaryText} text-sm`}>
                                                                {medication.dosage} · {medication.pills_per_dose} pill
                                                            </p>
                                                        </div>

                                                        {/* Status */}
                                                        <button
                                                            onClick={(event) => {
                                                                event.stopPropagation()
                                                                toggleDoseTaken(dose.key)
                                                            }}
                                                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                                status === "Taken"
                                                                    ? "bg-green-500"
                                                                    : status === "Due"
                                                                    ? "border-2 border-yellow-500"
                                                                    : status === "Upcoming"
                                                                    ? "border-2 border-orange-500"
                                                                    : "bg-red-500"
                                                            }`}
                                                        >
                                                            {status === "Taken" && (
                                                                <span className="text-white text-sm">
                                                                    ✓
                                                                </span>
                                                            )}

                                                            {status === "Due" && (
                                                                <span className="text-yellow-600 text-sm">
                                                                    ◷
                                                                </span>
                                                            )}

                                                            {status === "Upcoming" && (
                                                                <span className="text-orange-500 text-sm">
                                                                    ◷
                                                                </span>
                                                            )}

                                                            {status === "Missed" && (
                                                                <span className="text-white text-sm">
                                                                    ✕
                                                                </span>
                                                            )}
                                                        </button>
                                                    </div>

                                                    {/* Status Information */}
                                                    <div className="text-xs mt-3">
                                                        {status === "Taken" && (
                                                            <span className={theme === "dark" ? "text-green-300" : "text-green-700"}>
                                                                Taken at {new Date(dose.takenAt).toLocaleTimeString("en-US", {
                                                                    hour: "numeric",
                                                                    minute: "2-digit"
                                                                })} · Scheduled {formatTime(dose.time)}
                                                            </span>
                                                        )}

                                                        {status === "Due" && (
                                                            <span className={theme === "dark" ? "text-yellow-300" : "text-yellow-700"}>
                                                                Due now · Scheduled {formatTime(dose.time)}
                                                            </span>
                                                        )}

                                                        {status === "Upcoming" && (
                                                            <span className={theme === "dark" ? "text-orange-300" : "text-orange-500"}>
                                                                Upcoming · Due {formatTime(dose.time)}
                                                            </span>
                                                        )}

                                                        {status === "Missed" && (
                                                            <span className={theme === "dark" ? "text-red-300" : "text-red-500"}>
                                                                Missed · Was due {formatTime(dose.time)}
                                                            </span>
                                                        )}
                                                    </div>

                                                </div>
                                            )
                                        })}
                                    </div>
                                )
                            })}

                        {doses.length === 0 && (
                            <div className={`${currentTheme.card} rounded-xl p-4 text-center shadow-sm`}>
                                <p className={`${currentTheme.secondaryText} text-sm`}>
                                    No scheduled doses today
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Reminder Information */}
            {demoMedications.length === 0 && (
                <div className={`${currentTheme.card} ${currentTheme.border} border rounded-xl p-4 mb-4`}>

                    <h3 className={`${currentTheme.text} font-semibold mb-1`}>
                        Medication reminders
                    </h3>

                    <p className={`${currentTheme.secondaryText} text-sm`}>
                        Once you add a medication, your reminders and upcoming doses will appear here.
                    </p>

                </div>
            )}

            {/* Add Medication Button */}
            <button
                onClick={() => navigate("/add-medication")} 
                className={`w-full py-3 ${currentTheme.primary} text-white font-semibold rounded-xl hover:opacity-90`}>
                + Add Medication 
            </button>

            {/* Medication Type Filter */}
            <div className={`fixed bottom-[68px] left-0 right-0 ${currentTheme.background} flex gap-2 px-4 py-2 z-10`}>

                <button
                    onClick={() => setTypeFilter("All")}
                    className={`px-4 py-2 ${
                        typeFilter === "All" 
                            ? `${currentTheme.primary} text-white` 
                            : `${currentTheme.card} ${currentTheme.secondaryText}`
                    } rounded-lg text-sm font-medium`}
                >
                    All
                </button>

                <button
                    onClick={() => setTypeFilter("Medication")}
                    className={`px-4 py-2 ${
                        typeFilter === "Medication" 
                            ? `${currentTheme.primary} text-white` 
                            : `${currentTheme.card} ${currentTheme.secondaryText}`
                    } rounded-lg text-sm font-medium`}>
                    Medication
                </button>

                <button
                    onClick={() => setTypeFilter("Supplement")}
                    className={`px-4 py-2 ${
                        typeFilter === "Supplement" 
                            ? `${currentTheme.primary} text-white` 
                            : `${currentTheme.card} ${currentTheme.secondaryText}`
                    } rounded-lg text-sm font-medium`}>
                    Supplement
                </button>
            </div>

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

export default HomePage