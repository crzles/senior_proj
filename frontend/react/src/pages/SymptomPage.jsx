import {useState} from "react"
import {useNavigate} from "react-router-dom"
import {useDemo} from "../context/DemoContext"
import {useTheme} from "../context/ThemeContext"

const commonSymptoms = [
    "Headache",
    "Nausea",
    "Dizziness",
    "Fatigue",
    "Fever",
    "Cough",
    "Stomach pain",
    "Rash",
    "Shortness of breath",
]

const severities = ["Mild", "Moderate", "Severe"]

function getToday() {
    const now = new Date()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const day = String(now.getDate()).padStart(2, "0")

    return `${now.getFullYear()}-${month}-${day}`
}

const emptyForm = {
    symptom: "",
    date: "",
    time: "",
    severity: "",
    duration: "",
    notes: "",
}

function SymptomPage() {
    const [form, setForm] = useState(emptyForm)
    const [saved, setSaved] = useState(false)
    const [error, setError] = useState("")

    const navigate = useNavigate()
    const {addSymptomEntry} = useDemo()
    const {currentTheme} = useTheme()

    const inputClass = `w-full rounded-lg border ${currentTheme.border} bg-transparent px-3 py-2 text-sm outline-none ${currentTheme.text}`

    function updateField(field, value) {
        setForm((current) => ({...current, [field]: value}))
        setSaved(false)
        setError("")
    }

    function handleSubmit(event) {
        event.preventDefault()

        if (!form.symptom.trim() || !form.date || !form.time || !form.severity) {
            setError("Please add a symptom, date, time and severity.")
            return
        }

        addSymptomEntry({
            ...form,
            symptom: form.symptom.trim(),
            duration: form.duration.trim(),
            notes: form.notes.trim(),
        })

        setForm(emptyForm)
        setSaved(true)
    }

    return (
        <div className={`min-h-screen ${currentTheme.background} p-4 pb-24 flex flex-col`}>

            {/* Header */}
            <div className="mb-4">
                <h1 className={`${currentTheme.text} text-xl font-bold`}>
                    Symptom log
                </h1>
                <p className={`${currentTheme.secondaryText} text-sm`}>
                    Record symptoms. Keep your streaks.
                </p>
            </div>

            {/* New Entry Form */}
            <form
                onSubmit={handleSubmit}
                className={`${currentTheme.card} rounded-2xl p-4 shadow-sm mb-4`}
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className={`${currentTheme.text} font-bold`}>
                        New entry
                    </h2>
                    <span className={`${currentTheme.secondaryText} text-xs`}>
                        {saved ? "Saved" : "Not saved"}
                    </span>
                </div>

                {/* Symptom */}
                <div className="mb-3">
                    <label htmlFor="symptom" className={`${currentTheme.text} block text-sm font-medium mb-1`}>
                        Symptom
                    </label>
                    <input
                        id="symptom"
                        type="text"
                        list="symptom-options"
                        value={form.symptom}
                        onChange={(event) => updateField("symptom", event.target.value)}
                        placeholder="Choose or type a symptom"
                        className={inputClass}
                    />
                    <datalist id="symptom-options">
                        {commonSymptoms.map((symptom) => (
                            <option key={symptom} value={symptom} />
                        ))}
                    </datalist>
                    <p className={`${currentTheme.secondaryText} text-xs mt-1`}>
                        Select a symptom or enter your own.
                    </p>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                        <label htmlFor="symptom-date" className={`${currentTheme.text} block text-sm font-medium mb-1`}>
                            Date
                        </label>
                        <input
                            id="symptom-date"
                            type="date"
                            max={getToday()}
                            value={form.date}
                            onChange={(event) => updateField("date", event.target.value)}
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label htmlFor="symptom-time" className={`${currentTheme.text} block text-sm font-medium mb-1`}>
                            Time
                        </label>
                        <input
                            id="symptom-time"
                            type="time"
                            value={form.time}
                            onChange={(event) => updateField("time", event.target.value)}
                            className={inputClass}
                        />
                    </div>
                </div>

                {/* Severity */}
                <fieldset className="mb-3">
                    <legend className={`${currentTheme.text} text-sm font-medium mb-1`}>
                        Severity{" "}
                        <span className={`${currentTheme.secondaryText} text-xs font-normal`}>
                            (Self-reported)
                        </span>
                    </legend>
                    <div className="grid grid-cols-3 gap-2">
                        {severities.map((severity) => (
                            <label
                                key={severity}
                                className={`flex items-center justify-center gap-2 rounded-lg border px-2 py-2 text-sm cursor-pointer ${
                                    form.severity === severity
                                        ? `${currentTheme.primary} border-transparent text-white`
                                        : `${currentTheme.border} ${currentTheme.secondaryText}`
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="severity"
                                    value={severity}
                                    checked={form.severity === severity}
                                    onChange={() => updateField("severity", severity)}
                                    className="sr-only"
                                />
                                {severity}
                            </label>
                        ))}
                    </div>
                </fieldset>

                {/* Duration */}
                <div className="mb-3">
                    <label htmlFor="symptom-duration" className={`${currentTheme.text} block text-sm font-medium mb-1`}>
                        Duration{" "}
                        <span className={`${currentTheme.secondaryText} text-xs font-normal`}>
                            (Optional)
                        </span>
                    </label>
                    <input
                        id="symptom-duration"
                        type="text"
                        value={form.duration}
                        onChange={(event) => updateField("duration", event.target.value)}
                        placeholder="e.g. 30 minutes"
                        className={inputClass}
                    />
                </div>

                {/* Notes */}
                <div className="mb-4">
                    <label htmlFor="symptom-notes" className={`${currentTheme.text} block text-sm font-medium mb-1`}>
                        Notes{" "}
                        <span className={`${currentTheme.secondaryText} text-xs font-normal`}>
                            (Optional)
                        </span>
                    </label>
                    <textarea
                        id="symptom-notes"
                        rows={3}
                        value={form.notes}
                        onChange={(event) => updateField("notes", event.target.value)}
                        placeholder="Add any details you want to record"
                        className={inputClass}
                    />
                </div>

                {error && (
                    <p role="alert" className="text-red-500 text-sm mb-3">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    className={`w-full py-3 ${currentTheme.primary} text-white font-semibold rounded-xl hover:opacity-90`}
                >
                    Save entry
                </button>
            </form>

            {/* History Link */}
            <div className="px-1">
                <button
                    onClick={() => navigate("/profile")}
                    className={`${currentTheme.text} text-sm font-semibold underline`}
                >
                    View history in Profile
                </button>
                <p className={`${currentTheme.secondaryText} text-xs mt-1`}>
                    Saved entries are now grouped under Symptom history in your Profile.
                </p>
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
                        onClick={() => navigate("/map")}
                        className={`flex flex-col items-center ${currentTheme.secondaryText} text-xs`}>
                        <span className="text-lg">📍</span>
                        Map
                    </button>

                    <button
                        onClick={() => navigate("/symptoms")}
                        aria-current="page"
                        className={`flex flex-col items-center ${currentTheme.text} font-semibold text-xs`}>
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
                        onClick={() => navigate("/profile")}
                        className={`flex flex-col items-center ${currentTheme.secondaryText} text-xs`}>
                        <span className="text-lg">👤</span>
                        Profile
                    </button>

                </div>
            </nav>

        </div>
    )
}

export default SymptomPage
