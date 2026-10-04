import { useState } from "react"

function EditMedication() {
    const [medicationName, setMedicationName] = useState("Ibuprofen")
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

        setMessage("")

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
            window.location.href = "/"
        }, 1000)
    }

    function cancelEdit() {
        window.location.href = "/"
    }

    const inputClass =
        "w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"

    const labelClass =
        "block text-sm font-semibold text-gray-700 mb-2"

    const sectionClass =
        "bg-white rounded-xl p-4 mb-4 shadow-sm"

    return (
        <div className="min-h-screen bg-gray-50 pb-24">

            {/* Header */}
            <header className="px-4 pt-4 pb-2">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-600">
                            PillBug
                        </p>

                        <h1 className="text-xl font-bold">
                            Edit Medication
                        </h1>

                        <p className="text-sm text-blue-600">
                            Update your medication information
                        </p>
                    </div>

                    <button
                        type="button"
                        aria-label="Back to medications"
                        onClick={cancelEdit}
                        className="w-10 h-10 bg-blue-600 text-white rounded-full font-semibold"
                    >
                        ←
                    </button>
                </div>
            </header>

            <main className="max-w-2xl mx-auto p-4">

                {/* Message */}
                {message && (
                    <div
                        className={
                            message.includes("successfully")
                                ? "bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-4 text-sm font-semibold"
                                : "bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-4 text-sm font-semibold"
                        }
                    >
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    {/* 1. Basic Information */}
                    <section className={sectionClass}>

                        <div className="flex items-start gap-3 mb-5">
                            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                1
                            </div>

                            <div>
                                <h2 className="text-lg font-bold">
                                    Basic Information
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    Update the medication or supplement details
                                </p>
                            </div>
                        </div>

                        {/* Medication Name */}
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
                                placeholder="Medication name"
                                className={inputClass}
                            />
                        </div>

                        {/* Medication Type */}
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

                        {/* Dosage */}
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
                                placeholder="Example: 200 mg"
                                className={inputClass}
                            />
                        </div>

                        {/* Pills Per Dose */}
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

                    {/* 2. Schedule */}
                    <section className={sectionClass}>

                        <div className="flex items-start gap-3 mb-5">
                            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                2
                            </div>

                            <div>
                                <h2 className="text-lg font-bold">
                                    Schedule
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    Update when and how often you take it
                                </p>
                            </div>
                        </div>

                        {/* Frequency */}
                        <div className="mb-4">
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
                        </div>

                        {/* Custom Hours */}
                        {frequency === "Every X hours" && (
                            <div className="mb-4">
                                <label className={labelClass}>
                                    Every How Many Hours?
                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    value={customHours}
                                    onChange={(event) =>
                                        setCustomHours(event.target.value)
                                    }
                                    placeholder="Example: 6"
                                    className={inputClass}
                                />
                            </div>
                        )}

                        {/* Start Date */}
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

                        {/* End Date */}
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

                            <p className="text-xs text-gray-500 mt-2">
                                Leave blank if there is no end date.
                            </p>
                        </div>

                    </section>

                    {/* 3. Refill */}
                    <section className={sectionClass}>

                        <div className="flex items-start gap-3 mb-5">
                            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                3
                            </div>

                            <div>
                                <h2 className="text-lg font-bold">
                                    Refill
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    Update your refill information
                                </p>
                            </div>
                        </div>

                        {/* Refillable */}
                        <div className="mb-4">
                            <label className={labelClass}>
                                Is this medication refillable?
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
                        </div>

                        {refillable === "yes" && (
                            <>
                                {/* Pill Quantity */}
                                <div className="mb-4">
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

                                {/* Refill Reminder */}
                                <div>
                                    <label className={labelClass}>
                                        Refill Reminder
                                    </label>

                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            min="1"
                                            value={refillReminder}
                                            onChange={(event) =>
                                                setRefillReminder(
                                                    event.target.value
                                                )
                                            }
                                            className={inputClass}
                                        />

                                        <span className="text-sm text-gray-500 whitespace-nowrap">
                                            days before empty
                                        </span>
                                    </div>
                                </div>
                            </>
                        )}

                    </section>

                    {/* 4. Additional Information */}
                    <section className={sectionClass}>

                        <div className="flex items-start gap-3 mb-5">
                            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                4
                            </div>

                            <div>
                                <h2 className="text-lg font-bold">
                                    Additional Information
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    Add instructions and other notes
                                </p>
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="mb-4">
                            <label className={labelClass}>
                                Instructions
                            </label>

                            <textarea
                                value={instructions}
                                onChange={(event) =>
                                    setInstructions(event.target.value)
                                }
                                placeholder="Example: Take with food"
                                rows="3"
                                className={inputClass}
                            />
                        </div>

                        {/* Avoid */}
                        <div className="mb-4">
                            <label className={labelClass}>
                                What to Avoid
                            </label>

                            <textarea
                                value={avoidNotes}
                                onChange={(event) =>
                                    setAvoidNotes(event.target.value)
                                }
                                placeholder="Example: Avoid taking more than directed"
                                rows="3"
                                className={inputClass}
                            />
                        </div>

                        {/* Storage */}
                        <div>
                            <label className={labelClass}>
                                Storage Instructions
                            </label>

                            <textarea
                                value={storageNotes}
                                onChange={(event) =>
                                    setStorageNotes(event.target.value)
                                }
                                placeholder="Example: Store at room temperature"
                                rows="3"
                                className={inputClass}
                            />
                        </div>

                    </section>

                    {/* Review */}
                    <section className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
                        <p className="text-sm font-semibold text-gray-700">
                            Ready to update?
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
                            Review your information before saving your
                            medication changes.
                        </p>
                    </section>

                </form>
            </main>

            {/* Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 shadow-lg z-20">
                <div className="max-w-2xl mx-auto flex gap-2">

                    <button
                        type="button"
                        onClick={cancelEdit}
                        className="flex-1 py-3 border border-gray-300 bg-white text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50"
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
                        className="flex-[2] py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700"
                    >
                        Save Changes
                    </button>

                </div>
            </div>

        </div>
    )
}

export default EditMedication