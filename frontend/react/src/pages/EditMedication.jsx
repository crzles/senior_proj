import { useEffect, useState } from "react"
import { useSearchParams, useNavigate, useLocation } from "react-router-dom"
import { useDemo } from "../context/DemoContext"
import { useTheme } from "../context/ThemeContext"

function EditMedication() {
    const [searchParams] = useSearchParams()
    const medicationId = searchParams.get("id")

    const {demoMedications} = useDemo()
    const {currentTheme} = useTheme()
    const navigate = useNavigate()
    const location = useLocation()

    const medication = demoMedications.find(
        (med) => String(med.id) === medicationId
    )

    const [medicationName, setMedicationName] = useState("")
    const [medicationType, setMedicationType] = useState("Medication")
    const [dosage, setDosage] = useState("200 mg")
    const [pillsPerDose, setPillsPerDose] = useState("1")

    const [frequency, setFrequency] = useState("Every 6 hours")
    const [customHours, setCustomHours] = useState("")

    const [startDate, setStartDate] = useState("2026-10-01")
    const [endDate, setEndDate] = useState("")

    const [refillable, setRefillable] = useState("yes")
    const [pillQuantity, setPillQuantity] = useState("30")
    const [refillReminder, setRefillReminder] = useState("7")

    const [instructions, setInstructions] = useState(
        "Take with food if needed."
    )

    const [avoidNotes, setAvoidNotes] = useState(
        "Avoid taking more than directed."
    )

    const [storageNotes, setStorageNotes] = useState(
        "Store at room temperature."
    )

    const [message, setMessage] = useState("")

    useEffect(() => {
        if (!medication) {
            return
        }

        setMedicationName(medication.med_name || "")
        setMedicationType(medication.med_type || "Medication")
        setDosage(medication.dosage || "")
        setPillsPerDose(String(medication.pills_per_dose || 1))

        setFrequency(medication.recurrence || "Once daily")

        setStartDate(medication.start_date || "")
        setEndDate(medication.end_date || "")

        setRefillable(
            medication.is_refillable
                ? "yes"
                : "no"
        )

        setPillQuantity(
            medication.pill_qty
                ? String(medication.pill_qty)
                : ""
        )

        setRefillReminder(
            medication.refill_reminder
                ? String(medication.refill_reminder)
                : ""
        )

        setInstructions(medication.requirements || "")
        setAvoidNotes(medication.avoid_notes || "")
        setStorageNotes(medication.storage_notes || "")
    }, [medication])

    const frequencyOptions = [
        "Once daily",
        "Twice daily",
        "3 times daily",
        "4 times daily",
        "Every X hours",
        "Once weekly",
        "Every X days",
        "As needed",
        "Custom schedule",
    ]

    function handleSubmit(event) {
        event.preventDefault()

        if (!medicationName.trim()) {
            setMessage("Please enter a medication name.")
            return
        }

        if (!dosage.trim()) {
            setMessage("Please enter a dosage.")
            return
        }

        if (!pillsPerDose || Number(pillsPerDose) < 1) {
            setMessage("Please enter a valid pills per dose amount.")
            return
        }

        if (endDate && startDate && endDate < startDate) {
            setMessage("End date cannot be before the start date.")
            return
        }

        if (refillable === "yes" && Number(pillQuantity) < 1) {
            setMessage("Please enter the current pill quantity.")
            return
        }

        const medicationData = {
            medicationName,
            medicationType,
            dosage,
            pillsPerDose: Number(pillsPerDose),
            frequency,
            customHours,
            startDate,
            endDate,
            refillable: refillable === "yes",
            pillQuantity:
                refillable === "yes"
                    ? Number(pillQuantity)
                    : null,
            refillReminder:
                refillable === "yes"
                    ? Number(refillReminder)
                    : null,
            instructions,
            avoidNotes,
            storageNotes,
        }

        console.log("Updated medication:", medicationData)

        setMessage("Medication updated successfully!")

        setTimeout(() => {
            navigate("/MedPage")
        }, 1000)
    }

    // Go back to wherever the user came from. If this page was opened
    // directly (no previous page in the app), fall back to the medication list.
    function cancelEdit() {
        if (location.key !== "default") {
            navigate(-1)
        } else {
            navigate("/MedPage")
        }
    }

    const inputClass =
        `w-full px-4 py-3 border ${currentTheme.border} rounded-xl ${currentTheme.card} ${currentTheme.text} text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`

    const labelClass =
        `block text-sm font-semibold ${currentTheme.text} mb-2`

    const sectionClass =
        `${currentTheme.card} rounded-xl p-4 mb-4 shadow-sm`

    return (
        <div className={`min-h-screen ${currentTheme.background} pb-24`}>

            {/* Header */}
            <header className="px-4 pt-4 pb-2">
                <div className="flex items-center justify-between">

                    <div>
                        <p className={`text-sm ${currentTheme.secondaryText}`}>
                            PillBug
                        </p>

                        <h1 className={`text-xl font-bold ${currentTheme.text}`}>
                            Edit Medication
                        </h1>

                        <p className={`text-sm ${currentTheme.secondaryText}`}>
                            Update your medication information
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={cancelEdit}
                        aria-label="Back"
                        className={`w-10 h-10 ${currentTheme.primary} text-white rounded-full font-semibold`}
                    >
                        ←
                    </button>

                </div>
            </header>

            <main className="max-w-2xl mx-auto p-4">

                <form onSubmit={handleSubmit}>

                    {/* Basic Information */}
                    <section className={sectionClass}>

                        <div className="flex items-start gap-3 mb-5">

                            <div className={`w-8 h-8 min-w-8 ${currentTheme.primary} text-white rounded-full flex items-center justify-center text-sm font-bold`}>
                                1
                            </div>

                            <div>
                                <h2 className={`text-lg font-bold ${currentTheme.text}`}>
                                    Basic Information
                                </h2>

                                <p className={`text-sm ${currentTheme.secondaryText} mt-1`}>
                                    Update the medication or supplement details
                                </p>
                            </div>

                        </div>

                        <div className="mb-4">

                            <label className={labelClass}>
                                Medication Name
                            </label>

                            <input
                                type="text"
                                value={medicationName}
                                onChange={(event) =>
                                    setMedicationName(event.target.value)
                                }
                                className={inputClass}
                            />

                        </div>

                        <div className="mb-4">

                            <label className={labelClass}>
                                Medication Type
                            </label>

                            <select
                                value={medicationType}
                                onChange={(event) =>
                                    setMedicationType(event.target.value)
                                }
                                className={inputClass}
                            >
                                <option value="Medication">
                                    Medication
                                </option>

                                <option value="Supplement">
                                    Supplement
                                </option>
                            </select>

                        </div>

                        <div className="mb-4">

                            <label className={labelClass}>
                                Dosage
                            </label>

                            <input
                                type="text"
                                value={dosage}
                                onChange={(event) =>
                                    setDosage(event.target.value)
                                }
                                className={inputClass}
                            />

                        </div>

                        <div>

                            <label className={labelClass}>
                                Pills Per Dose
                            </label>

                            <input
                                type="number"
                                min="1"
                                value={pillsPerDose}
                                onChange={(event) =>
                                    setPillsPerDose(event.target.value)
                                }
                                className={inputClass}
                            />

                        </div>

                    </section>

                    {/* Schedule */}
                    <section className={sectionClass}>

                        <div className="flex items-start gap-3 mb-5">

                            <div className={`w-8 h-8 min-w-8 ${currentTheme.primary} text-white rounded-full flex items-center justify-center text-sm font-bold`}>
                                2
                            </div>

                            <div>
                                <h2 className={`text-lg font-bold ${currentTheme.text}`}>
                                    Schedule
                                </h2>

                                <p className={`text-sm ${currentTheme.secondaryText} mt-1`}>
                                    Update how often you take it
                                </p>
                            </div>

                        </div>

                        <label className={labelClass}>
                            Frequency
                        </label>

                        <select
                            value={frequency}
                            onChange={(event) =>
                                setFrequency(event.target.value)
                            }
                            className={inputClass}
                        >
                            {frequencyOptions.map((option) => (
                                <option
                                    key={option}
                                    value={option}
                                >
                                    {option}
                                </option>
                            ))}
                        </select>

                        {frequency === "Every X hours" && (
                            <div className="mt-4">

                                <label className={labelClass}>
                                    Every how many hours?
                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    value={customHours}
                                    onChange={(event) =>
                                        setCustomHours(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Example: 6"
                                    className={inputClass}
                                />

                            </div>
                        )}

                    </section>

                    {/* Dates */}
                    <section className={sectionClass}>

                        <div className="flex items-start gap-3 mb-5">

                            <div className={`w-8 h-8 min-w-8 ${currentTheme.primary} text-white rounded-full flex items-center justify-center text-sm font-bold`}>
                                3
                            </div>

                            <div>
                                <h2 className={`text-lg font-bold ${currentTheme.text}`}>
                                    Dates
                                </h2>

                                <p className={`text-sm ${currentTheme.secondaryText} mt-1`}>
                                    Update when you take this medication
                                </p>
                            </div>

                        </div>

                        <div className="mb-4">

                            <label className={labelClass}>
                                Start Date
                            </label>

                            <input
                                type="date"
                                value={startDate}
                                onChange={(event) =>
                                    setStartDate(event.target.value)
                                }
                                className={inputClass}
                            />

                        </div>

                        <div>

                            <label className={labelClass}>
                                End Date
                            </label>

                            <input
                                type="date"
                                value={endDate}
                                min={startDate}
                                onChange={(event) =>
                                    setEndDate(event.target.value)
                                }
                                className={inputClass}
                            />

                            <p className={`${currentTheme.secondaryText} text-xs mt-2`}>
                                Leave blank if there is no end date.
                            </p>

                        </div>

                    </section>

                    {/* Refills */}
                    <section className={sectionClass}>

                        <div className="flex items-start gap-3 mb-5">

                            <div className={`w-8 h-8 min-w-8 ${currentTheme.primary} text-white rounded-full flex items-center justify-center text-sm font-bold`}>
                                4
                            </div>

                            <div>
                                <h2 className={`text-lg font-bold ${currentTheme.text}`}>
                                    Refills
                                </h2>

                                <p className={`text-sm ${currentTheme.secondaryText} mt-1`}>
                                    Update your medication supply
                                </p>
                            </div>

                        </div>

                        <label className={labelClass}>
                            Refillable
                        </label>

                        <select
                            value={refillable}
                            onChange={(event) =>
                                setRefillable(event.target.value)
                            }
                            className={inputClass}
                        >
                            <option value="yes">
                                Yes
                            </option>

                            <option value="no">
                                No
                            </option>
                        </select>

                        {refillable === "yes" && (
                            <div className="mt-4 space-y-4">

                                <div>

                                    <label className={labelClass}>
                                        Current Pill Quantity
                                    </label>

                                    <input
                                        type="number"
                                        min="1"
                                        value={pillQuantity}
                                        onChange={(event) =>
                                            setPillQuantity(
                                                event.target.value
                                            )
                                        }
                                        className={inputClass}
                                    />

                                </div>

                                <div>

                                    <label className={labelClass}>
                                        Refill Reminder
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        value={refillReminder}
                                        onChange={(event) =>
                                            setRefillReminder(
                                                event.target.value
                                            )
                                        }
                                        className={inputClass}
                                    />

                                    <p className={`${currentTheme.secondaryText} text-xs mt-2`}>
                                        Remind me when I have this many
                                        pills left.
                                    </p>

                                </div>

                            </div>
                        )}

                    </section>

                    {/* Additional Information */}
                    <section className={sectionClass}>

                        <div className="flex items-start gap-3 mb-5">

                            <div className={`w-8 h-8 min-w-8 ${currentTheme.primary} text-white rounded-full flex items-center justify-center text-sm font-bold`}>
                                5
                            </div>

                            <div>
                                <h2 className={`text-lg font-bold ${currentTheme.text}`}>
                                    Additional Information
                                </h2>

                                <p className={`text-sm ${currentTheme.secondaryText} mt-1`}>
                                    Update any useful notes
                                </p>
                            </div>

                        </div>

                        <div className="mb-4">

                            <label className={labelClass}>
                                Instructions
                            </label>

                            <textarea
                                value={instructions}
                                onChange={(event) =>
                                    setInstructions(
                                        event.target.value
                                    )
                                }
                                rows="3"
                                className={`${inputClass} resize-y`}
                            />

                        </div>

                        <div className="mb-4">

                            <label className={labelClass}>
                                Avoid
                            </label>

                            <textarea
                                value={avoidNotes}
                                onChange={(event) =>
                                    setAvoidNotes(
                                        event.target.value
                                    )
                                }
                                rows="3"
                                className={`${inputClass} resize-y`}
                            />

                        </div>

                        <div>

                            <label className={labelClass}>
                                Storage
                            </label>

                            <textarea
                                value={storageNotes}
                                onChange={(event) =>
                                    setStorageNotes(
                                        event.target.value
                                    )
                                }
                                rows="3"
                                className={`${inputClass} resize-y`}
                            />

                        </div>

                    </section>

                    {/* Status Message */}
                    {message && (
                        <div
                            className={`rounded-xl p-4 mb-4 text-sm font-semibold ${
                                message.includes("successfully")
                                    ? "bg-green-50 text-green-700 border border-green-200"
                                    : "bg-red-50 text-red-700 border border-red-200"
                            }`}
                        >
                            {message}
                        </div>
                    )}

                </form>

            </main>

            {/* Bottom Action Bar */}
            <div className={`fixed bottom-0 left-0 right-0 ${currentTheme.card} border-t ${currentTheme.border} px-4 py-2 shadow-lg z-20`}>

                <div className="max-w-2xl mx-auto flex gap-2">

                    <button
                        type="button"
                        onClick={cancelEdit}
                        className={`flex-1 py-3 border ${currentTheme.border} ${currentTheme.card} ${currentTheme.text} rounded-xl text-sm font-semibold hover:opacity-80`}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            document
                                .querySelector("form")
                                ?.requestSubmit()
                        }
                        className={`flex-[2] py-3 ${currentTheme.primary} text-white rounded-xl text-sm font-bold hover:opacity-90`}
                    >
                        Save Changes
                    </button>

                </div>

            </div>

        </div>
    )
}

export default EditMedication