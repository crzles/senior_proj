
import { useSearchParams, useNavigate, useLocation } from "react-router-dom"
import { useDemo } from "../context/DemoContext"
import { useTheme } from "../context/ThemeContext"

function MedicationInfo() {
    const [searchParams] = useSearchParams()
    const medicationId = searchParams.get("id")
    const { demoMedications } = useDemo()
    const { currentTheme } = useTheme()
    const navigate = useNavigate()
    const location = useLocation()

    // Go back to wherever the user came from. If this page was opened
    // directly (no previous page in the app), fall back to the medication list.
    function goBack() {
        if (location.key !== "default") {
            navigate(-1)
        } else {
            navigate("/MedPage")
        }
    }

    const medication = demoMedications.find(
        (med) => String(med.id) === medicationId
    )

    if (!medication) {
        return (
            <div className={`min-h-screen ${currentTheme.background} p-6`}>
                <button
                    onClick={goBack}
                    className={`${currentTheme.text} mb-6`}
                >
                    ← Back to medications
                </button>
                <p className={currentTheme.text}>
                    Medication not found.
                </p>
            </div>
        )
    }

    const inputCard =
        `${currentTheme.card} rounded-xl p-4 shadow-sm`

    const labelClass =
        `text-xs ${currentTheme.secondaryText}`

    const valueClass =
        `text-sm font-semibold ${currentTheme.text}`

    // Next reminder = first time later today, otherwise earliest time (tomorrow)
    const reminderTimes = [...(
        medication.reminder_times?.length > 0
            ? medication.reminder_times
            : medication.first_dose_time
                ? [medication.first_dose_time]
                : []
    )].sort()

    const nowHHMM = new Date().toTimeString().slice(0, 5)

    const nextReminder =
        reminderTimes.find((time) => time > nowHHMM) || reminderTimes[0]

    const formattedReminder = nextReminder
        ? new Date(
            `2000-01-01T${nextReminder}:00`
        ).toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
        })
        : "No reminder set"

    return (
        <div className={`min-h-screen ${currentTheme.background} p-4 pb-24`}>
            <div className="w-full">

                {/* Header */}
                <header className="flex items-center gap-3 mb-6">
                    <button
                        type="button"
                        onClick={goBack}
                        aria-label="Back"
                        className={`w-10 h-10 ${currentTheme.card} ${currentTheme.text} rounded-full shadow-sm text-2xl`}
                    >
                        ‹
                    </button>

                    <h1 className={`text-lg font-bold ${currentTheme.text}`}>
                        Medication Information
                    </h1>
                </header>

                {/* Medication Card */}
                <section className={`${inputCard} flex items-center gap-3 mb-4`}>
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-2xl">
                        ♡
                    </div>

                    <div>
                        <h2 className={`text-lg font-bold ${currentTheme.text}`}>
                            {medication.med_name}
                        </h2>
                        <p className={`text-sm ${currentTheme.secondaryText}`}>
                            {medication.dosage}
                        </p>
                    </div>
                </section>

                {/* Next Reminder */}
                <section className="bg-blue-600 text-white rounded-xl p-4 mb-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">
                        ◷
                    </div>

                    <div>
                        <p className="text-xs text-blue-100">
                            Next Reminder
                        </p>
                        <p className="text-lg font-bold">
                            {formattedReminder}
                        </p>
                    </div>
                </section>

                {/* Medication Details */}
                <section className={`${inputCard} mb-4`}>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className={labelClass}>Type</p>
                            <p className={valueClass}>
                                {medication.med_type}
                            </p>
                        </div>

                        <div>
                            <p className={labelClass}>Dosage</p>
                            <p className={valueClass}>
                                {medication.dosage}
                            </p>
                        </div>

                        <div>
                            <p className={labelClass}>Re-occurrence</p>
                            <p className={valueClass}>
                                {medication.recurrence || "Not specified"}
                            </p>
                        </div>

                        <div>
                            <p className={labelClass}>Treatment Duration</p>
                            <p className={valueClass}>
                                {medication.start_date && medication.end_date
                                    ? `${medication.start_date} to ${medication.end_date}`
                                    : medication.end_date
                                        ? `Ends ${medication.end_date}`
                                        : "Ongoing"}
                            </p>
                        </div>
                    </div>

                    <div className={`border-t ${currentTheme.border} mt-4 pt-3 flex justify-between gap-3`}>
                        <p className={labelClass}>Refillable</p>
                        <p className={valueClass}>
                            {medication.is_refillable ? "Yes" : "No"}
                        </p>
                    </div>
                </section>

                {/* Symptoms / Tags */}
                <section className={`${inputCard} mb-4`}>
                    <div className="flex items-center justify-between gap-3">
                        <h3 className={`text-sm font-semibold ${currentTheme.text}`}>
                            Symptoms / Tags
                        </h3>

                        <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs">
                            Pain relief
                        </span>
                    </div>
                </section>

                {/* Additional Information */}
                <section className={`${inputCard} mb-4`}>
                    <div className="flex gap-3 pb-3">
                        <span className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                            ♧
                        </span>
                        <div>
                            <h3 className={`text-sm font-semibold ${currentTheme.text}`}>
                                Requirements / Suggestions
                            </h3>
                            <p className={`text-sm ${currentTheme.secondaryText}`}>
                                {medication.requirements || "No instructions added."}
                            </p>
                        </div>
                    </div>

                    <div className={`flex gap-3 py-3 border-t ${currentTheme.border}`}>
                        <span className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                            !
                        </span>
                        <div>
                            <h3 className={`text-sm font-semibold ${currentTheme.text}`}>
                                Avoid
                            </h3>
                            <p className={`text-sm ${currentTheme.secondaryText}`}>
                                {medication.avoid_notes || "No notes added."}
                            </p>
                        </div>
                    </div>

                    <div className={`flex gap-3 pt-3 border-t ${currentTheme.border}`}>
                        <span className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                            ◈
                        </span>
                        <div>
                            <h3 className={`text-sm font-semibold ${currentTheme.text}`}>
                                Storage
                            </h3>
                            <p className={`text-sm ${currentTheme.secondaryText}`}>
                                {medication.storage_notes || "No storage notes added."}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Bottom Actions */}
                <div className="space-y-2">
                    <button
                        type="button"
                        onClick={() =>
                            navigate(`/edit-medication?id=${medication.id}`)
                        }
                        className="w-full py-3 bg-blue-600 text-white rounded-lg text-sm font-bold"
                    >
                        ✎ Edit Medication
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/MedPage")}
                        className={`w-full py-3 border ${currentTheme.border} ${currentTheme.card} text-blue-600 rounded-lg text-sm font-semibold`}
                    >
                        My Medications
                    </button>
                </div>

            </div>
        </div>
    )
}

export default MedicationInfo