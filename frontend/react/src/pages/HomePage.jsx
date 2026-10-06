import {useDemo} from "../context/DemoContext"
import {useTheme} from "../context/ThemeContext"

function HomePage() {
    const {demoUser, demoMedications} = useDemo()

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

    const medicationStatuses = demoMedications.map((medication) => {
        const reminderTime = medication.reminder_times[0]
        const [hour, minute] = reminderTime.split(":")

        const scheduledTime = new Date()
        scheduledTime.setHours(Number(hour), Number(minute), 0, 0)

        if (medication.taken) {
            return "Taken"
        } else if (today < scheduledTime) {
            return "Pending"
        } else {
            return "Missed"
        }
    })

    const takenCount = medicationStatuses.filter(
        (status) => status === "Taken"
    ).length

    const pendingCount = medicationStatuses.filter(
        (status) => status === "Pending"
    ).length

    const missedCount = medicationStatuses.filter(
        (status) => status === "Missed"
    ).length

    const nextMedication = demoMedications.find(
        (medication, index) => medicationStatuses[index] === "Pending"
    )

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

                        <p className="text-sm text-blue-600">
                            📅 {formattedDate}
                        </p>
                    </div>

                    {/* Profile Button */}
                    <button className="w-10 h-10 bg-blue-600 text-white rounded-full font-semibold">
                        {demoUser
                        ? `${demoUser.firstName.charAt(0)}${demoUser.lastName.charAt(0)}`
                        : "?"}
                    </button>
                </div>
            </div>

            {/* Next Dose Card */}
            {nextMedication && (
                <div className="bg-blue-600 text-white rounded-xl p-4 mb-4">
                    <div className="flex items-center gap-3">

                        {/* Clock Icon */}
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <span className="text-xl">
                                ◷
                            </span>
                        </div>

                        {/* Next Dose Information */}
                        <div className="flex-1">
                            <p className="text-xs opacity-80">
                                Next dose
                            </p>

                            <h2 className="text-lg font-bold">
                                {nextMedication.med_name} · {formatTime(nextMedication.reminder_times[0])}
                            </h2>

                            <p className="text-sm opacity-80">
                                {nextMedication.dosage} · {nextMedication.pills_per_dose} pill
                            </p>
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
                <div className="bg-blue-600 text-white rounded-xl p-4 mb-4">

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

            {/* Medication Filters */}
            <div className="flex gap-2 mb-4 overflow-x-auto">

                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
                    All
                </button>
                
                <button className={`px-4 py-2 ${currentTheme.card} ${currentTheme.secondaryText} rounded-lg text-sm font-medium`}>
                    Morning
                </button>

                <button className={`px-4 py-2 ${currentTheme.card} ${currentTheme.secondaryText} rounded-lg text-sm font-medium`}>
                    Afternoon
                </button>

                <button className={`px-4 py-2 ${currentTheme.card} ${currentTheme.secondaryText} rounded-lg text-sm font-medium`}>
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
                        {demoMedications.map((medication, index) => {
                           const status = medicationStatuses[index]

                           return (
                            <div
                                key={medication.med_name}
                                className={`rounded-xl p-4 mb-3 shadow-sm ${
                                    status === "Taken"
                                        ? theme === "dark"
                                            ? "bg-green-900"
                                            : "bg-green-100"
                                        : status === "Pending"
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

                                    {/* Pill icon */}
                                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                                        <span className="text-xl">
                                            💊
                                        </span>
                                    </div>

                                    {/* Medication details */}
                                    <div className="flex-1">
                                        <h3 className={`${currentTheme.text} font-bold`}>
                                            {medication.med_name}
                                        </h3>

                                        <p className={`${currentTheme.secondaryText} text-sm`}>
                                            {medication.dosage} · {medication.pills_per_dose} pill · Due {formatTime(medication.reminder_times[0])}
                                        </p>
                                    </div>

                                    {/* Status */}
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                            status === "Taken"
                                                ? "bg-green-500"
                                                : status === "Pending"
                                                ? "border-2 border-orange-500"
                                                : "bg-red-500"
                                        }`}
                                    >
                                        {status === "Taken" && (
                                            <span className="text-white text-sm">
                                                ✓
                                            </span>
                                        )}

                                        {status === "Pending" && (
                                            <span className="text-orange-500 text-sm">
                                                ◷
                                            </span>
                                        )}

                                        {status === "Missed" && (
                                            <span className="text-white text-sm">
                                                ✕
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/*Status Information*/}
                                <div className="text-xs mt-3">
                                    {status === "Taken" && (
                                        <span className={theme === "dark" ? "text-green-300" : "text-green-700"}>
                                            Taken today
                                        </span>
                                    )}
                                    {status === "Pending" && (
                                        <span className={theme === "dark" ? "text-orange-300" : "text-orange-500"}>
                                            Pending · Due {formatTime(medication.reminder_times[0])}
                                        </span>
                                    )}
                                    {status === "Missed" && (
                                        <span className={theme === "dark" ? "text-red-300" : "text-red-500"}>
                                            Missed · Was due {formatTime(medication.reminder_times[0])}
                                        </span>
                                    )}
                                </div>
                            </div>
                           )
                        })}
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
            <button className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700">
                + Add Medication 
            </button>

            {/* Medication Type Filter */}
            <div className={`fixed bottom-[68px] left-0 right-0 ${currentTheme.background} flex gap-2 px-4 py-2 z-10`}>

                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
                    All
                </button>

                <button className={`px-4 py-2 ${currentTheme.card} ${currentTheme.secondaryText} rounded-lg text-sm font-medium`}>
                    Medication
                </button>

                <button className={`px-4 py-2 ${currentTheme.card} ${currentTheme.secondaryText} rounded-lg text-sm font-medium`}>
                    Supplement
                </button>
            </div>

            {/* Bottom Navigation */}
            <nav className={`fixed bottom-0 left-0 right-0 ${currentTheme.card} border-t ${currentTheme.border} px-2 py-2`}>

                <div className="flex justify-around">

                    <button className={`flex flex-col items-center ${currentTheme.secondaryText} text-xs`}>
                        <span className="text-lg">⌂</span>
                        Home
                    </button>

                    <button className={`flex flex-col items-center ${currentTheme.secondaryText} text-xs`}>
                        <span className="text-lg">💊</span>
                        All Medications
                    </button>

                    <button className={`flex flex-col items-center ${currentTheme.secondaryText} text-xs`}>
                        <span className="text-lg">📍</span>
                        Map
                    </button>

                    <button className={`flex flex-col items-center ${currentTheme.secondaryText} text-xs`}>
                        <span className="text-lg">📝</span>
                        Symptoms
                    </button>

                    <button className={`flex flex-col items-center ${currentTheme.secondaryText} text-xs`}>
                        <span className="text-lg">📅</span>
                        Calendar
                    </button>

                    <button className={`flex flex-col items-center ${currentTheme.secondaryText} text-xs`}>
                        <span className="text-lg">👤</span>
                        Profile
                    </button>

                </div>
            </nav>

        </div>
    )
}

export default HomePage