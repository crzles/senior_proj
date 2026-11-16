import {useState} from "react"
import {useDemo} from "../context/DemoContext"
import {useTheme} from "../context/ThemeContext"

const smokingOptions = ["Never used", "Previously used", "Currently use", "Prefer not to say"]
const alcoholOptions = ["None", "Occasionally", "Regularly", "Prefer not to say"]

// The "Health habits" section of the profile. Every answer is optional.
function HealthHabits() {
    const {healthHabits, updateHealthHabits} = useDemo()
    const {currentTheme} = useTheme()

    const [form, setForm] = useState(healthHabits)
    const [error, setError] = useState("")
    const [saved, setSaved] = useState(false)
    const [saving, setSaving] = useState(false)

    const inputClass = `w-full rounded-lg border ${currentTheme.border} bg-transparent px-3 py-2 text-sm outline-none ${currentTheme.text}`

    function setField(name, value) {
        setForm((current) => ({...current, [name]: value}))
        setSaved(false)
        setError("")
    }

    async function handleSubmit(event) {
        event.preventDefault()

        const activity = form.activity_days
        const sleep = form.sleep_hours

        if (activity !== "" && (!Number.isInteger(Number(activity)) || Number(activity) < 0 || Number(activity) > 7)) {
            setError("Physical activity must be a whole number of days from 0 to 7.")
            return
        }

        if (sleep !== "" && (Number(sleep) < 0 || Number(sleep) > 24)) {
            setError("Sleep duration must be between 0 and 24 hours.")
            return
        }

        setSaving(true)

        try {
            await updateHealthHabits(form)
            setSaved(true)
        } catch (saveError) {
            setError(saveError.message)
        } finally {
            setSaving(false)
        }
    }

    function radioGroup(name, legend, options) {
        return (
            <fieldset className="mb-4">
                <legend className={`${currentTheme.text} mb-2 text-sm font-semibold`}>
                    {legend}
                </legend>

                <div className="grid grid-cols-2 gap-2">
                    {options.map((option) => (
                        <label
                            key={option}
                            className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                                form[name] === option
                                    ? `${currentTheme.accentBorder} ${currentTheme.accentText}`
                                    : `${currentTheme.border} ${currentTheme.secondaryText}`
                            }`}
                        >
                            <input
                                type="radio"
                                name={name}
                                value={option}
                                checked={form[name] === option}
                                onChange={() => setField(name, option)}
                                className="h-4 w-4 accent-blue-600"
                            />
                            {option}
                        </label>
                    ))}
                </div>
            </fieldset>
        )
    }

    return (
        <form onSubmit={handleSubmit} className={`border-t ${currentTheme.border} p-4`}>
            <p className={`${currentTheme.secondaryText} mb-4 text-xs`}>
                All fields are optional. Share what you'd like.
            </p>

            {radioGroup("smoking", "Smoking / tobacco use", smokingOptions)}

            <div className={`border-t ${currentTheme.border} pt-4`}>
                {radioGroup("alcohol", "Alcohol use", alcoholOptions)}
            </div>

            <div className={`grid grid-cols-2 gap-3 border-t ${currentTheme.border} pt-4`}>
                <div>
                    <label htmlFor="habit-activity" className={`${currentTheme.text} mb-1 block text-sm font-semibold`}>
                        Physical activity
                    </label>
                    <input
                        id="habit-activity"
                        type="number"
                        min="0"
                        max="7"
                        step="1"
                        value={form.activity_days}
                        onChange={(event) => setField("activity_days", event.target.value)}
                        placeholder="e.g. 3"
                        className={inputClass}
                    />
                    <p className={`${currentTheme.secondaryText} mt-1 text-xs`}>
                        Days per week (0–7)
                    </p>
                </div>

                <div>
                    <label htmlFor="habit-sleep" className={`${currentTheme.text} mb-1 block text-sm font-semibold`}>
                        Sleep duration
                    </label>
                    <input
                        id="habit-sleep"
                        type="number"
                        min="0"
                        max="24"
                        step="0.5"
                        value={form.sleep_hours}
                        onChange={(event) => setField("sleep_hours", event.target.value)}
                        placeholder="e.g. 7.5"
                        className={inputClass}
                    />
                    <p className={`${currentTheme.secondaryText} mt-1 text-xs`}>
                        Average hours / night
                    </p>
                </div>
            </div>

            {error && (
                <p role="alert" className={`${currentTheme.dangerText} mt-3 text-sm`}>
                    {error}
                </p>
            )}

            {saved && (
                <p role="status" className={`${currentTheme.secondaryText} mt-3 text-sm`}>
                    Your health habits were saved.
                </p>
            )}

            <button
                type="submit"
                disabled={saving}
                className={`mt-4 w-full py-3 ${currentTheme.primary} rounded-xl font-semibold text-white hover:opacity-90 disabled:opacity-60`}
            >
                {saving ? "Saving..." : "Save health habits"}
            </button>
        </form>
    )
}

export default HealthHabits
