import { useNavigate } from "react-router-dom"
import { useDemo } from "../context/DemoContext"
import { useTheme } from "../context/ThemeContext"

function MedicationList() {
    const {demoMedications} = useDemo()
    const {currentTheme} = useTheme()
    const navigate = useNavigate()

    const medications = demoMedications

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
            <div className="mb-4">
                <p className={`text-sm ${currentTheme.secondaryText}`}>
                    PillBug
                </p>

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className={`text-xl font-bold ${currentTheme.text}`}>
                            My Medications
                        </h1>

                        <p className={`text-sm ${currentTheme.secondaryText}`}>
                            Keep track of your medications and supplements
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={goToAddMedication}
                        className={`w-10 h-10 ${currentTheme.primary} text-white rounded-full font-semibold`}
                    >
                        +
                    </button>
                </div>
            </div>

            {/* Medication Summary */}
            <div className={`${currentTheme.primary} text-white rounded-xl p-4 mb-4`}>
                <p className="text-sm opacity-80">
                    Your medication routine
                </p>

                <h2 className="text-lg font-bold">
                    {medications.length}{" "}
                    {medications.length === 1
                        ? "medication"
                        : "medications"}{" "}
                    added
                </h2>
            </div>

            {/* Your Medications */}
            <div className="mb-4">

                <h2 className={`text-lg font-bold mb-2 ${currentTheme.text}`}>
                    Your Medications
                </h2>

                <div className="space-y-3">

                    {medications.map((medication) => (
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
                    ))}

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