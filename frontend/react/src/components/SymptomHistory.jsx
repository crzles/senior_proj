import {useState} from "react"
import {useDemo} from "../context/DemoContext"
import {useTheme} from "../context/ThemeContext"

const severities = ["Mild", "Moderate", "Severe"]

// Number of days each range reaches back, counting today. null means no limit.
const ranges = [
    {label: "Today", days: 1},
    {label: "Past 7 days", days: 7},
    {label: "Past 30 days", days: 30},
    {label: "All", days: null},
]

function toDateKey(date) {
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")

    return `${date.getFullYear()}-${month}-${day}`
}

// Entry dates are "YYYY-MM-DD" strings, so they can be compared directly with this cutoff.
function getCutoffKey(days) {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - (days - 1))

    return toDateKey(cutoff)
}

function formatEntryDate(entry) {
    const date = new Date(`${entry.logged_on}T${entry.time || "00:00"}`)

    return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        ...(entry.time && {hour: "numeric", minute: "2-digit"}),
    })
}

function formatAge(isoString) {
    const minutes = Math.max(0, Math.floor((Date.now() - new Date(isoString)) / 60000))

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes} min ago`

    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} hr ago`

    const days = Math.floor(hours / 24)
    return `${days} ${days === 1 ? "day" : "days"} ago`
}

function SymptomHistory() {
    const [search, setSearch] = useState("")
    const [range, setRange] = useState("Today")
    const [editingId, setEditingId] = useState(null)
    // Unsaved edits, keyed by entry id. They are only applied when "Save changes" is pressed.
    const [drafts, setDrafts] = useState({})

    const {symptomLogs, updateSymptomEntry, deleteSymptomEntry} = useDemo()
    const {currentTheme} = useTheme()

    const inputClass = `w-full rounded-lg border ${currentTheme.border} bg-transparent px-3 py-2 text-sm outline-none ${currentTheme.text}`

    const query = search.trim().toLowerCase()
    const activeRange = ranges.find((item) => item.label === range)
    const cutoffKey = activeRange.days ? getCutoffKey(activeRange.days) : null

    // Searching looks through every day; otherwise only the selected range is shown.
    const visibleEntries = symptomLogs.filter((entry) => {
        if (query !== "") {
            return (
                entry.symptom.toLowerCase().includes(query) ||
                entry.note.toLowerCase().includes(query)
            )
        }

        return cutoffKey === null || entry.logged_on >= cutoffKey
    })

    const hasChanges = Object.keys(drafts).length > 0

    function getDraft(entry) {
        return drafts[entry.id] || {
            symptom: entry.symptom,
            severity: entry.severity,
            duration: entry.duration,
            note: entry.note,
        }
    }

    function updateDraft(entry, field, value) {
        setDrafts((current) => ({
            ...current,
            [entry.id]: {...getDraft(entry), [field]: value},
        }))
    }

    async function saveChanges() {
        try {
            for (const [id, draft] of Object.entries(drafts)) {
                if (!draft.symptom.trim()) {
                    continue
                }

                await updateSymptomEntry(Number(id), {
                    ...draft,
                    symptom: draft.symptom.trim(),
                    duration: draft.duration.trim(),
                    note: draft.note.trim(),
                })
            }
        } catch (error) {
            alert(error.message)
            return
        }

        setDrafts({})
        setEditingId(null)
    }

    async function handleDelete(entry) {
        if (!window.confirm(`Delete this ${entry.symptom} entry?`)) {
            return
        }

        try {
            await deleteSymptomEntry(entry.id)
        } catch (error) {
            alert(error.message)
            return
        }

        setDrafts((current) => {
            const updated = {...current}
            delete updated[entry.id]
            return updated
        })
    }

    return (
        <div className={`border-t ${currentTheme.border} p-4`}>

            {/* Saved Entries Header */}
            <div className="flex items-start justify-between mb-3">
                <div>
                    <h3 className={`${currentTheme.text} font-semibold`}>
                        Saved entries
                    </h3>
                    <p className={`${currentTheme.secondaryText} text-xs`}>
                        Entries are text-only and self-reported.
                    </p>
                </div>

                <span className={`${currentTheme.secondaryText} text-xs whitespace-nowrap`}>
                    {visibleEntries.length} of {symptomLogs.length}
                </span>
            </div>

            {/* Search */}
            <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search saved symptoms"
                aria-label="Search saved symptoms"
                className={`${inputClass} mb-3`}
            />

            {/* Date Range Filters */}
            <div className="flex gap-2 mb-3 overflow-x-auto">
                {ranges.map(({label}) => (
                    <button
                        key={label}
                        type="button"
                        onClick={() => setRange(label)}
                        disabled={query !== ""}
                        className={`px-3 py-1.5 whitespace-nowrap rounded-lg text-sm font-medium disabled:opacity-50 ${
                            range === label
                                ? `${currentTheme.primary} text-white`
                                : `border ${currentTheme.border} ${currentTheme.secondaryText}`
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {query !== "" && (
                <p className={`${currentTheme.secondaryText} text-xs mb-3`}>
                    Searching all days.
                </p>
            )}

            {/* Entries */}
            <ul className="space-y-3 mb-4">
                {visibleEntries.map((entry) => {
                    const isEditing = editingId === entry.id
                    const draft = getDraft(entry)

                    return (
                        <li
                            key={entry.id}
                            className={`rounded-xl border ${currentTheme.border} p-3`}
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                    <p className={`${currentTheme.text} font-semibold`}>
                                        {entry.symptom}
                                    </p>
                                    <p className={`${currentTheme.secondaryText} text-xs`}>
                                        {formatEntryDate(entry)}
                                    </p>
                                </div>

                                <span className={`${currentTheme.secondaryText} text-xs whitespace-nowrap`}>
                                    {entry.logged_at && formatAge(entry.logged_at)}
                                </span>
                            </div>

                            {isEditing ? (
                                <div className="mt-3 space-y-2">
                                    <input
                                        type="text"
                                        value={draft.symptom}
                                        onChange={(event) => updateDraft(entry, "symptom", event.target.value)}
                                        aria-label="Symptom"
                                        className={inputClass}
                                    />

                                    <select
                                        value={draft.severity}
                                        onChange={(event) => updateDraft(entry, "severity", event.target.value)}
                                        aria-label="Severity"
                                        className={`${inputClass} ${currentTheme.card}`}
                                    >
                                        {draft.severity === "" && <option value="">Not set</option>}
                                        {severities.map((severity) => (
                                            <option key={severity} value={severity}>
                                                {severity}
                                            </option>
                                        ))}
                                    </select>

                                    <input
                                        type="text"
                                        value={draft.duration}
                                        onChange={(event) => updateDraft(entry, "duration", event.target.value)}
                                        placeholder="Duration (optional)"
                                        aria-label="Duration"
                                        className={inputClass}
                                    />

                                    <textarea
                                        rows={2}
                                        value={draft.note}
                                        onChange={(event) => updateDraft(entry, "note", event.target.value)}
                                        placeholder="Notes (optional)"
                                        aria-label="Notes"
                                        className={inputClass}
                                    />
                                </div>
                            ) : (
                                <div className={`${currentTheme.secondaryText} text-sm mt-2`}>
                                    {entry.severity && <p>Self-reported severity: {entry.severity}</p>}
                                    {entry.duration && <p>Duration: {entry.duration}</p>}
                                    {entry.note && <p>{entry.note}</p>}
                                </div>
                            )}

                            <div className="flex gap-4 mt-3 text-sm font-medium">
                                <button
                                    type="button"
                                    onClick={() => setEditingId(isEditing ? null : entry.id)}
                                    className={currentTheme.accentText}
                                >
                                    {isEditing ? "Done" : "Review / edit"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleDelete(entry)}
                                    className={currentTheme.dangerText}
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    )
                })}

                {visibleEntries.length === 0 && (
                    <li className={`${currentTheme.secondaryText} text-sm text-center py-2`}>
                        {query !== ""
                            ? "No entries match your search."
                            : range === "Today"
                                ? "No entries today. Choose a longer range or search to see earlier ones."
                                : "No entries in this range."}
                    </li>
                )}
            </ul>

            <p className={`${currentTheme.secondaryText} text-xs mb-3`}>
                These details are self-reported. You can review them at any time.
            </p>

            <button
                type="button"
                onClick={saveChanges}
                disabled={!hasChanges}
                className={`w-full py-3 ${currentTheme.primary} text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-50`}
            >
                Save changes
            </button>
        </div>
    )
}

export default SymptomHistory
