import { useState } from "react"

function AddMedication() {
    // Medication information
    const [medicationName, setMedicationName] = useState("")
    const [medicationType, setMedicationType] = useState("Medication")
    const [dosage, setDosage] = useState("")
    const [pillsPerDose, setPillsPerDose] = useState("1")

    // Schedule
    const [frequency, setFrequency] = useState("Once daily")
    const [reminderTimes, setReminderTimes] = useState(["08:00"])
    const [hoursInterval, setHoursInterval] = useState("6")
    const [daysInterval, setDaysInterval] = useState("2")
    const [firstDoseTime, setFirstDoseTime] = useState("08:00")
    const [weeklyDay, setWeeklyDay] = useState("Monday")
    const [customDays, setCustomDays] = useState([])
    const [customTimes, setCustomTimes] = useState(["08:00"])

    // Dates
    const [startDate, setStartDate] = useState(
        new Date().toISOString().split("T")[0]
    )
    const [noEndDate, setNoEndDate] = useState(true)
    const [endDate, setEndDate] = useState("")

    // Refills
    const [refillEnabled, setRefillEnabled] = useState(false)
    const [pillQuantity, setPillQuantity] = useState("")
    const [refillReminder, setRefillReminder] = useState("5")

    // Additional information
    const [instructions, setInstructions] = useState("")
    const [avoidNotes, setAvoidNotes] = useState("")
    const [storageNotes, setStorageNotes] = useState("")

    // Search
    const [searchOpen, setSearchOpen] = useState(false)

    const medicationSuggestions = [
        "Ibuprofen",
        "Acetaminophen",
        "Amoxicillin",
        "Cetirizine",
        "Loratadine",
        "Vitamin D",
        "Vitamin C",
        "Magnesium",
        "Iron",
    ]

    const daysOfWeek = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ]

    function updateFrequency(newFrequency) {
        setFrequency(newFrequency)

        if (newFrequency === "Once daily") {
            setReminderTimes(["08:00"])
        } else if (newFrequency === "Twice daily") {
            setReminderTimes(["08:00", "20:00"])
        } else if (newFrequency === "3 times daily") {
            setReminderTimes(["08:00", "14:00", "20:00"])
        } else if (newFrequency === "4 times daily") {
            setReminderTimes(["08:00", "12:00", "16:00", "20:00"])
        } else if (newFrequency === "Once weekly") {
            setReminderTimes(["08:00"])
        } else if (newFrequency === "Every X hours") {
            setReminderTimes([])
        } else if (newFrequency === "Every X days") {
            setReminderTimes([])
        } else if (newFrequency === "As needed") {
            setReminderTimes([])
        } else if (newFrequency === "Custom schedule") {
            setReminderTimes([])
            setCustomTimes(["08:00"])
        }
    }

    function updateReminderTime(index, value) {
        const updatedTimes = [...reminderTimes]
        updatedTimes[index] = value
        setReminderTimes(updatedTimes)
    }

    function updateCustomTime(index, value) {
        const updatedTimes = [...customTimes]
        updatedTimes[index] = value
        setCustomTimes(updatedTimes)
    }

    function toggleCustomDay(day) {
        if (customDays.includes(day)) {
            setCustomDays(customDays.filter((item) => item !== day))
        } else {
            setCustomDays([...customDays, day])
        }
    }

    function addCustomTime() {
        setCustomTimes([...customTimes, "08:00"])
    }

    function removeCustomTime(index) {
        if (customTimes.length === 1) {
            return
        }

        setCustomTimes(customTimes.filter((_, i) => i !== index))
    }

    function handleSubmit(event) {
        event.preventDefault()

        if (!medicationName.trim()) {
            alert("Please enter a medication name.")
            return
        }

        if (!dosage.trim()) {
            alert("Please enter the medication strength.")
            return
        }

        if (frequency === "Custom schedule" && customDays.length === 0) {
            alert("Please select at least one day for the custom schedule.")
            return
        }

        if (frequency === "Custom schedule" && customTimes.length === 0) {
            alert("Please add at least one reminder time.")
            return
        }

        if (!noEndDate && !endDate) {
            alert("Please choose an end date or select No end date.")
            return
        }

        if (!noEndDate && endDate < startDate) {
            alert("End date cannot be before the start date.")
            return
        }

        if (refillEnabled && !pillQuantity) {
            alert("Please enter your current pill quantity.")
            return
        }

        const medicationData = {
            med_name: medicationName.trim(),
            med_type: medicationType,
            dosage: dosage.trim(),
            pills_per_dose: Number(pillsPerDose),
            recurrence: frequency,
            reminder_times:
                frequency === "As needed"
                    ? []
                    : frequency === "Every X hours"
                        ? [
                              {
                                  interval_hours: Number(hoursInterval),
                                  first_dose: firstDoseTime,
                              },
                          ]
                        : frequency === "Every X days"
                            ? [
                                  {
                                      interval_days: Number(daysInterval),
                                      first_dose: firstDoseTime,
                                  },
                              ]
                            : frequency === "Once weekly"
                                ? [
                                      {
                                          day: weeklyDay,
                                          time: reminderTimes[0],
                                      },
                                  ]
                                : frequency === "Custom schedule"
                                    ? [
                                          {
                                              days: customDays,
                                              times: customTimes,
                                          },
                                      ]
                                    : reminderTimes,
            start_date: startDate,
            end_date: noEndDate ? null : endDate,
            is_refillable: refillEnabled,
            pill_qty:
                refillEnabled && pillQuantity
                    ? Number(pillQuantity)
                    : null,
            refill_reminder:
                refillEnabled && refillReminder
                    ? Number(refillReminder)
                    : null,
            requirements: instructions.trim(),
            avoid_notes: avoidNotes.trim(),
            storage_notes: storageNotes.trim(),
        }

        console.log("Medication to send to backend:", medicationData)

        alert(`${medicationName} has been added!`)

        window.location.href = "/"
    }

    const inputClass =
        "w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"

    const labelClass =
        "block text-sm font-semibold text-gray-700 mb-2"

    const sectionClass =
        "bg-white rounded-xl p-4 mb-4 shadow-sm"

    return (
        <div className="min-h-screen bg-gray-50 p-4 flex flex-col pb-24">

            {/* Header */}
            <div className="mb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-600">
                            PillBug
                        </p>

                        <h1 className="text-xl font-bold">
                            Add Medication
                        </h1>

                        <p className="text-sm text-blue-600">
                            Add a medication or supplement to your routine
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => (window.location.href = "/")}
                        className="w-10 h-10 bg-blue-600 text-white rounded-full font-semibold"
                    >
                        ←
                    </button>
                </div>
            </div>

            <main className="max-w-2xl mx-auto w-full">
                <form onSubmit={handleSubmit}>

                    {/* 1. Medication */}
                    <section className={sectionClass}>
                        <div className="flex items-start gap-3 mb-5">
                            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                1
                            </div>

                            <div>
                                <h2 className="text-lg font-bold">
                                    Medication
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    Search for a medication or supplement
                                </p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className={labelClass}>
                                Medication Name
                            </label>

                            <div className="relative">
                                <input
                                    type="text"
                                    value={medicationName}
                                    onChange={(event) => {
                                        setMedicationName(event.target.value)
                                        setSearchOpen(true)
                                    }}
                                    onFocus={() => setSearchOpen(true)}
                                    placeholder="Search medication or supplement"
                                    className={inputClass}
                                />

                                {searchOpen &&
                                    medicationName.trim() !== "" && (
                                        <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
                                            {medicationSuggestions
                                                .filter((item) =>
                                                    item
                                                        .toLowerCase()
                                                        .includes(
                                                            medicationName.toLowerCase()
                                                        )
                                                )
                                                .map((item) => (
                                                    <button
                                                        key={item}
                                                        type="button"
                                                        onClick={() => {
                                                            setMedicationName(item)
                                                            setSearchOpen(false)
                                                        }}
                                                        className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50"
                                                    >
                                                        {item}
                                                    </button>
                                                ))}
                                        </div>
                                    )}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className={labelClass}>
                                Type
                            </label>

                            <div className="grid grid-cols-2 gap-2">
                                {["Medication", "Supplement"].map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setMedicationType(type)}
                                        className={
                                            medicationType === type
                                                ? "py-3 bg-blue-600 text-white rounded-lg text-sm font-semibold"
                                                : "py-3 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium"
                                        }
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className={labelClass}>
                                    Strength / Dosage
                                </label>

                                <input
                                    type="text"
                                    value={dosage}
                                    onChange={(event) =>
                                        setDosage(event.target.value)
                                    }
                                    placeholder="e.g. 200 mg"
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Pills per Dose
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
                        </div>
                    </section>

                    {/* 2. Dose */}
                    <section className={sectionClass}>
                        <div className="flex items-start gap-3 mb-5">
                            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                2
                            </div>

                            <div>
                                <h2 className="text-lg font-bold">
                                    Dose
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    Set how much you take at one time
                                </p>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                            <p className="text-sm text-gray-600">
                                You will take
                            </p>

                            <p className="text-xl font-bold text-blue-600 mt-1">
                                {pillsPerDose || 0}{" "}
                                {Number(pillsPerDose) === 1
                                    ? "pill"
                                    : "pills"}
                            </p>

                            <p className="text-sm text-gray-500 mt-1">
                                of {medicationName || "this medication"} per
                                dose
                            </p>
                        </div>
                    </section>

                    {/* 3. Schedule */}
                    <section className={sectionClass}>
                        <div className="flex items-start gap-3 mb-5">
                            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                3
                            </div>

                            <div>
                                <h2 className="text-lg font-bold">
                                    Schedule
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    Choose when you should take it
                                </p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className={labelClass}>
                                Frequency
                            </label>

                            <select
                                value={frequency}
                                onChange={(event) =>
                                    updateFrequency(event.target.value)
                                }
                                className={inputClass}
                            >
                                <option>Once daily</option>
                                <option>Twice daily</option>
                                <option>3 times daily</option>
                                <option>4 times daily</option>
                                <option>Every X hours</option>
                                <option>Once weekly</option>
                                <option>Every X days</option>
                                <option>As needed</option>
                                <option>Custom schedule</option>
                            </select>
                        </div>

                        {[
                            "Once daily",
                            "Twice daily",
                            "3 times daily",
                            "4 times daily",
                        ].includes(frequency) && (
                            <div className="space-y-3">
                                <label className={labelClass}>
                                    Reminder Times
                                </label>

                                {reminderTimes.map((time, index) => (
                                    <input
                                        key={index}
                                        type="time"
                                        value={time}
                                        onChange={(event) =>
                                            updateReminderTime(
                                                index,
                                                event.target.value
                                            )
                                        }
                                        className={inputClass}
                                    />
                                ))}
                            </div>
                        )}

                        {frequency === "Every X hours" && (
                            <div className="space-y-4">
                                <div>
                                    <label className={labelClass}>
                                        Every how many hours?
                                    </label>

                                    <input
                                        type="number"
                                        min="1"
                                        value={hoursInterval}
                                        onChange={(event) =>
                                            setHoursInterval(event.target.value)
                                        }
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        First Dose
                                    </label>

                                    <input
                                        type="time"
                                        value={firstDoseTime}
                                        onChange={(event) =>
                                            setFirstDoseTime(event.target.value)
                                        }
                                        className={inputClass}
                                    />
                                </div>
                            </div>
                        )}

                        {frequency === "Every X days" && (
                            <div className="space-y-4">
                                <div>
                                    <label className={labelClass}>
                                        Every how many days?
                                    </label>

                                    <input
                                        type="number"
                                        min="1"
                                        value={daysInterval}
                                        onChange={(event) =>
                                            setDaysInterval(event.target.value)
                                        }
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        First Dose
                                    </label>

                                    <input
                                        type="time"
                                        value={firstDoseTime}
                                        onChange={(event) =>
                                            setFirstDoseTime(event.target.value)
                                        }
                                        className={inputClass}
                                    />
                                </div>
                            </div>
                        )}

                        {frequency === "Once weekly" && (
                            <div className="space-y-4">
                                <div>
                                    <label className={labelClass}>
                                        Day
                                    </label>

                                    <select
                                        value={weeklyDay}
                                        onChange={(event) =>
                                            setWeeklyDay(event.target.value)
                                        }
                                        className={inputClass}
                                    >
                                        {daysOfWeek.map((day) => (
                                            <option key={day}>
                                                {day}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        Reminder Time
                                    </label>

                                    <input
                                        type="time"
                                        value={reminderTimes[0] || "08:00"}
                                        onChange={(event) =>
                                            setReminderTimes([
                                                event.target.value,
                                            ])
                                        }
                                        className={inputClass}
                                    />
                                </div>
                            </div>
                        )}

                        {frequency === "Custom schedule" && (
                            <div className="space-y-4">
                                <div>
                                    <label className={labelClass}>
                                        Days
                                    </label>

                                    <div className="grid grid-cols-2 gap-2">
                                        {daysOfWeek.map((day) => (
                                            <button
                                                key={day}
                                                type="button"
                                                onClick={() =>
                                                    toggleCustomDay(day)
                                                }
                                                className={
                                                    customDays.includes(day)
                                                        ? "py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold"
                                                        : "py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm"
                                                }
                                            >
                                                {day}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        Reminder Times
                                    </label>

                                    <div className="space-y-2">
                                        {customTimes.map((time, index) => (
                                            <div
                                                key={index}
                                                className="flex gap-2"
                                            >
                                                <input
                                                    type="time"
                                                    value={time}
                                                    onChange={(event) =>
                                                        updateCustomTime(
                                                            index,
                                                            event.target.value
                                                        )
                                                    }
                                                    className={inputClass}
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeCustomTime(index)
                                                    }
                                                    className="px-4 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={addCustomTime}
                                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
                                    >
                                        + Add Time
                                    </button>
                                </div>
                            </div>
                        )}

                        {frequency === "As needed" && (
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                                <p className="text-sm text-gray-600">
                                    This medication does not have a fixed
                                    reminder schedule.
                                </p>
                            </div>
                        )}
                    </section>

                    {/* 4. Dates */}
                    <section className={sectionClass}>
                        <div className="flex items-start gap-3 mb-5">
                            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                4
                            </div>

                            <div>
                                <h2 className="text-lg font-bold">
                                    Dates
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    Choose when the medication starts and ends
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

                            <label className="flex items-center gap-2 text-sm text-gray-700 mb-3">
                                <input
                                    type="checkbox"
                                    checked={noEndDate}
                                    onChange={(event) =>
                                        setNoEndDate(event.target.checked)
                                    }
                                    className="w-4 h-4 accent-blue-600"
                                />
                                No end date
                            </label>

                            {!noEndDate && (
                                <input
                                    type="date"
                                    value={endDate}
                                    min={startDate}
                                    onChange={(event) =>
                                        setEndDate(event.target.value)
                                    }
                                    className={inputClass}
                                />
                            )}
                        </div>
                    </section>

                    {/* 5. Refills */}
                    <section className={sectionClass}>
                        <div className="flex items-start gap-3 mb-5">
                            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                5
                            </div>

                            <div>
                                <h2 className="text-lg font-bold">
                                    Refills
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    Keep track of your medication supply
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm font-semibold text-gray-700">
                                    Refill tracking
                                </p>

                                <p className="text-xs text-gray-500 mt-1">
                                    Get reminded when your supply is low
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setRefillEnabled(!refillEnabled)
                                }
                                className={
                                    refillEnabled
                                        ? "w-12 h-7 bg-blue-600 rounded-full relative"
                                        : "w-12 h-7 bg-gray-300 rounded-full relative"
                                }
                            >
                                <span
                                    className={
                                        refillEnabled
                                            ? "absolute right-1 top-1 w-5 h-5 bg-white rounded-full"
                                            : "absolute left-1 top-1 w-5 h-5 bg-white rounded-full"
                                    }
                                />
                            </button>
                        </div>

                        {refillEnabled && (
                            <div className="space-y-4">
                                <div>
                                    <label className={labelClass}>
                                        Current Pill Quantity
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        value={pillQuantity}
                                        onChange={(event) =>
                                            setPillQuantity(event.target.value)
                                        }
                                        placeholder="e.g. 30"
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        Remind Me When
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

                                        <span className="text-sm text-gray-600 whitespace-nowrap">
                                            pills remain
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* 6. Additional Information */}
                    <section className={sectionClass}>
                        <div className="flex items-start gap-3 mb-5">
                            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                6
                            </div>

                            <div>
                                <h2 className="text-lg font-bold">
                                    Additional Information
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    Add any helpful instructions or notes
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className={labelClass}>
                                    Instructions
                                </label>

                                <textarea
                                    value={instructions}
                                    onChange={(event) =>
                                        setInstructions(event.target.value)
                                    }
                                    placeholder="e.g. Take with food"
                                    rows="3"
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Avoid
                                </label>

                                <textarea
                                    value={avoidNotes}
                                    onChange={(event) =>
                                        setAvoidNotes(event.target.value)
                                    }
                                    placeholder="e.g. Avoid taking with grapefruit"
                                    rows="3"
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Storage
                                </label>

                                <textarea
                                    value={storageNotes}
                                    onChange={(event) =>
                                        setStorageNotes(event.target.value)
                                    }
                                    placeholder="e.g. Store at room temperature"
                                    rows="3"
                                    className={inputClass}
                                />
                            </div>
                        </div>
                    </section>

                    {/* Review */}
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
                        <p className="text-sm font-semibold text-gray-700">
                            Medication ready to add?
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
                            Review your information before saving this
                            medication to your routine.
                        </p>
                    </div>

                    {/* Hidden submit button */}
                    <button
                        type="submit"
                        className="hidden"
                    >
                        Add Medication
                    </button>

                </form>
            </main>

            {/* Bottom Navigation / Actions */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 shadow-lg z-20">
                <div className="max-w-2xl mx-auto flex gap-2">

                    <button
                        type="button"
                        onClick={() => (window.location.href = "/")}
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
                        Add Medication
                    </button>

                </div>
            </div>

        </div>
    )
}

export default AddMedication