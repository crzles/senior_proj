
import {useEffect, useState} from "react"
import {useDemo} from "../context/DemoContext"
import {useTheme} from "../context/ThemeContext"
import {listAllergies, createAllergy, updateAllergy, deleteAllergy} from "../api/allergies"

const emptyForm = {
    name: "",
    reaction: "",
    severity: "Unknown",
    note: "",
}

function Allergies() {
    const {demoMode} = useDemo()
    const {currentTheme} = useTheme()

    const [allergies, setAllergies] = useState([])
    const [form, setForm] = useState({...emptyForm})
    const [editingId, setEditingId] = useState(null)
    const [loading, setLoading] = useState(!demoMode)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState("")
    const [notice, setNotice] = useState("")

    useEffect(() => {
        let active = true

        if (demoMode) {
            setAllergies([])
            setLoading(false)
            return () => {
                active = false
            }
        }

        setLoading(true)
        listAllergies()
            .then((data) => {
                if (active) setAllergies(data)
            })
            .catch((err) => {
                if (active) setError(err.message)
            })
            .finally(() => {
                if (active) setLoading(false)
            })

        return () => {
            active = false
        }
    }, [demoMode])

    function changeField(event) {
        const {name, value} = event.target
        setForm((current) => ({...current, [name]: value}))
    }

    function resetForm() {
        setForm({...emptyForm})
        setEditingId(null)
    }

    async function handleSubmit(event) {
        event.preventDefault()
        setError("")
        setNotice("")

        const payload = {
            name: form.name.trim(),
            reaction: form.reaction.trim(),
            severity: form.severity,
            note: form.note.trim() || null,
        }

        if (!payload.name || !payload.reaction) {
            setError("Please enter an allergen and reaction.")
            return
        }

        if (allergies.some((allergy) =>
            allergy.name.toLowerCase() === payload.name.toLowerCase() &&
            allergy.allergy_id !== editingId
        )) {
            setError("This allergy has already been added.")
            return
        }

        setSaving(true)

        try {
            if (demoMode) {
                if (editingId !== null) {
                    setAllergies((current) =>
                        current.map((allergy) =>
                            allergy.allergy_id === editingId
                                ? {...allergy, ...payload}
                                : allergy
                        )
                    )
                } else {
                    setAllergies((current) => [
                        ...current,
                        {...payload, allergy_id: Date.now()},
                    ])
                }
            } else {
                if (editingId !== null) {
                    await updateAllergy(editingId, payload)
                } else {
                    await createAllergy(payload)
                }

                const updated = await listAllergies()
                setAllergies(updated)
            }

            setNotice(editingId !== null
                ? "Allergy updated successfully."
                : "Allergy added successfully."
            )
            resetForm()
        } catch (err) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    function startEditing(allergy) {
        setEditingId(allergy.allergy_id)
        setForm({
            name: allergy.name,
            reaction: allergy.reaction,
            severity: allergy.severity,
            note: allergy.note || "",
        })
        setError("")
        setNotice("")
    }

    async function handleDelete(allergyId) {
        setError("")
        setNotice("")
        setSaving(true)

        try {
            if (!demoMode) {
                await deleteAllergy(allergyId)
            }

            setAllergies((current) =>
                current.filter((allergy) => allergy.allergy_id !== allergyId)
            )

            if (editingId === allergyId) resetForm()
            setNotice("Allergy deleted successfully.")
        } catch (err) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    const inputClass = `w-full rounded-lg border ${currentTheme.border} ${currentTheme.card} ${currentTheme.text} px-3 py-2 text-sm outline-none`
    const labelClass = `${currentTheme.text} mb-1 block text-sm font-medium`
    const outlineButton = `rounded-lg border ${currentTheme.accentBorder} ${currentTheme.accentText} px-3 py-2 text-sm font-medium`

    return (
        <div className={`border-t ${currentTheme.border} p-4 space-y-4`}>
            {error && (
                <p role="alert" className={`${currentTheme.dangerSoft} rounded-lg p-3 text-sm`}>
                    {error}
                </p>
            )}

            {notice && (
                <p role="status" className={`${currentTheme.successSoft} rounded-lg p-3 text-sm`}>
                    {notice}
                </p>
            )}

            {loading ? (
                <p className={`${currentTheme.secondaryText} text-sm`}>
                    Loading allergies...
                </p>
            ) : allergies.length === 0 ? (
                <div className={`${currentTheme.inset} rounded-lg p-3`}>
                    <p className={`${currentTheme.text} text-sm font-semibold`}>
                        No allergies added
                    </p>
                    <p className={`${currentTheme.secondaryText} text-xs`}>
                        Your allergy status hasn't been set.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {allergies.map((allergy) => (
                        <div
                            key={allergy.allergy_id}
                            className={`rounded-lg border ${currentTheme.border} p-3`}
                        >
                            <p className={`${currentTheme.text} text-sm font-semibold`}>
                                {allergy.name}
                            </p>

                            <p className={`${currentTheme.secondaryText} text-sm`}>
                                Reaction: {allergy.reaction}
                            </p>

                            <p className={`${currentTheme.secondaryText} text-sm`}>
                                Severity: {allergy.severity}
                            </p>

                            {allergy.note && (
                                <p className={`${currentTheme.secondaryText} text-sm`}>
                                    Notes: {allergy.note}
                                </p>
                            )}

                            <div className="mt-3 flex gap-2">
                                <button
                                    type="button"
                                    disabled={saving}
                                    onClick={() => startEditing(allergy)}
                                    className={outlineButton}
                                >
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    disabled={saving}
                                    onClick={() => handleDelete(allergy.allergy_id)}
                                    className={`rounded-lg px-3 py-2 text-sm font-medium ${currentTheme.dangerText} ${currentTheme.dangerHover}`}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                    <label htmlFor="allergy-name" className={labelClass}>
                        Allergen / medication *
                    </label>
                    <input
                        id="allergy-name"
                        name="name"
                        value={form.name}
                        onChange={changeField}
                        placeholder="Enter an allergen or medication"
                        className={inputClass}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="allergy-reaction" className={labelClass}>
                        Reaction *
                    </label>
                    <input
                        id="allergy-reaction"
                        name="reaction"
                        value={form.reaction}
                        onChange={changeField}
                        placeholder="e.g. Rash, itching"
                        className={inputClass}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="allergy-severity" className={labelClass}>
                        Severity
                    </label>
                    <select
                        id="allergy-severity"
                        name="severity"
                        value={form.severity}
                        onChange={changeField}
                        className={inputClass}
                    >
                        <option value="Unknown">Unknown</option>
                        <option value="Mild">Mild</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Severe">Severe</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="allergy-note" className={labelClass}>
                        Additional notes (optional)
                    </label>
                    <textarea
                        id="allergy-note"
                        name="note"
                        value={form.note}
                        onChange={changeField}
                        placeholder="Add any additional information"
                        rows={3}
                        className={inputClass}
                    />
                </div>

                <button
                    type="submit"
                    disabled={saving || loading}
                    className={`${currentTheme.primary} ${currentTheme.primaryHover} w-full rounded-lg py-2 text-sm font-medium text-white disabled:opacity-60`}
                >
                    {saving
                        ? "Saving..."
                        : editingId !== null
                            ? "Save changes"
                            : "+ Add allergy"}
                </button>

                {editingId !== null && (
                    <button
                        type="button"
                        onClick={resetForm}
                        className={`w-full text-sm ${currentTheme.accentText}`}
                    >
                        Cancel editing
                    </button>
                )}
            </form>
        </div>
    )
}

export default Allergies
