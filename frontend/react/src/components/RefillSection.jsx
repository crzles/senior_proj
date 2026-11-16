import {useEffect, useState} from "react"
import {useDemo} from "../context/DemoContext"
import {useTheme} from "../context/ThemeContext"

const emptyForm = {qty: "", pharmacy_name: "", pharmacy_address: "", dosage: ""}

function formatDate(isoString) {
    return new Date(isoString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    })
}

// Refills for one medication: current supply, a low-supply warning, the refill history,
// and a form to log a new refill. Only shown for medications marked as refillable.
function RefillSection({medication}) {
    const {refills, loadRefills, addRefill} = useDemo()
    const {currentTheme} = useTheme()

    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState(emptyForm)
    const [error, setError] = useState("")
    const [notice, setNotice] = useState("")
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (medication.is_refillable) {
            loadRefills(medication.id)
        }
    }, [loadRefills, medication.id, medication.is_refillable])

    const history = refills[medication.id] || []

    const supply = medication.pill_qty
    const isLow =
        supply != null &&
        medication.refill_reminder != null &&
        supply <= medication.refill_reminder

    const inputClass = `w-full rounded-lg border ${currentTheme.border} bg-transparent px-3 py-2 text-sm outline-none ${currentTheme.text}`
    const labelClass = `${currentTheme.text} mb-1 block text-sm font-medium`

    function setField(name, value) {
        setForm((current) => ({...current, [name]: value}))
        setError("")
    }

    async function handleSubmit(event) {
        event.preventDefault()

        const qty = Number(form.qty)

        if (!Number.isInteger(qty) || qty < 1) {
            setError("Enter how many pills were added, as a whole number.")
            return
        }

        setSaving(true)

        try {
            await addRefill(medication.id, {
                qty_added: qty,
                pharmacy_name: form.pharmacy_name.trim() || undefined,
                pharmacy_address: form.pharmacy_address.trim() || undefined,
                dosage: form.dosage.trim() || undefined,
            })

            setForm(emptyForm)
            setShowForm(false)
            setNotice(`Refill logged. Added ${qty} ${qty === 1 ? "pill" : "pills"} to your supply.`)
        } catch (saveError) {
            setError(saveError.message)
        } finally {
            setSaving(false)
        }
    }

    if (!medication.is_refillable) {
        return null
    }

    return (
        <section className={`${currentTheme.card} rounded-xl p-4 shadow-sm mb-4`}>
            <h3 className={`text-sm font-semibold ${currentTheme.text} mb-3`}>
                Refills
            </h3>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className={`text-xs ${currentTheme.secondaryText}`}>Current supply</p>
                    <p className={`text-sm font-semibold ${currentTheme.text}`}>
                        {supply == null ? "Not set" : `${supply} ${supply === 1 ? "pill" : "pills"}`}
                    </p>
                </div>

                <div>
                    <p className={`text-xs ${currentTheme.secondaryText}`}>Remind me at</p>
                    <p className={`text-sm font-semibold ${currentTheme.text}`}>
                        {medication.refill_reminder == null
                            ? "Not set"
                            : `${medication.refill_reminder} ${medication.refill_reminder === 1 ? "pill" : "pills"} left`}
                    </p>
                </div>
            </div>

            {isLow && (
                <p role="status" className={`mt-3 rounded-lg px-3 py-2 text-xs font-semibold ${currentTheme.dangerSoft}`}>
                    Running low. Time to request a refill.
                </p>
            )}

            {notice && !showForm && (
                <p role="status" className={`mt-3 text-sm ${currentTheme.secondaryText}`}>
                    {notice}
                </p>
            )}

            {showForm ? (
                <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                    <div>
                        <label htmlFor="refill-qty" className={labelClass}>Pills added</label>
                        <input
                            id="refill-qty"
                            type="number"
                            min="1"
                            max="99999"
                            step="1"
                            value={form.qty}
                            onChange={(event) => setField("qty", event.target.value)}
                            placeholder="e.g. 30"
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label htmlFor="refill-pharmacy" className={labelClass}>
                            Pharmacy <span className={`text-xs font-normal ${currentTheme.secondaryText}`}>(optional)</span>
                        </label>
                        <input
                            id="refill-pharmacy"
                            type="text"
                            value={form.pharmacy_name}
                            onChange={(event) => setField("pharmacy_name", event.target.value)}
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label htmlFor="refill-address" className={labelClass}>
                            Pharmacy address <span className={`text-xs font-normal ${currentTheme.secondaryText}`}>(optional)</span>
                        </label>
                        <input
                            id="refill-address"
                            type="text"
                            value={form.pharmacy_address}
                            onChange={(event) => setField("pharmacy_address", event.target.value)}
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label htmlFor="refill-dosage" className={labelClass}>
                            Strength <span className={`text-xs font-normal ${currentTheme.secondaryText}`}>(optional)</span>
                        </label>
                        <input
                            id="refill-dosage"
                            type="text"
                            maxLength={50}
                            value={form.dosage}
                            onChange={(event) => setField("dosage", event.target.value)}
                            placeholder={medication.dosage}
                            className={inputClass}
                        />
                    </div>

                    {error && (
                        <p role="alert" className={`text-sm ${currentTheme.dangerText}`}>{error}</p>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                setShowForm(false)
                                setError("")
                            }}
                            className={`rounded-lg border ${currentTheme.border} ${currentTheme.text} py-2 text-sm font-medium`}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className={`${currentTheme.primary} rounded-lg py-2 text-sm font-medium text-white disabled:opacity-60`}
                        >
                            {saving ? "Saving..." : "Save refill"}
                        </button>
                    </div>
                </form>
            ) : (
                <button
                    type="button"
                    onClick={() => {
                        setNotice("")
                        setShowForm(true)
                    }}
                    className={`mt-4 w-full rounded-lg border ${currentTheme.accentBorder} ${currentTheme.accentText} py-2 text-sm font-medium`}
                >
                    Log a refill
                </button>
            )}

            <div className={`mt-4 border-t ${currentTheme.border} pt-3`}>
                <p className={`text-xs font-semibold ${currentTheme.text} mb-2`}>Refill history</p>

                {history.length === 0 ? (
                    <p className={`text-sm ${currentTheme.secondaryText}`}>No refills logged yet.</p>
                ) : (
                    <ul className="space-y-3">
                        {history.map((refill) => (
                            <li key={refill.id} className="text-sm">
                                <div className="flex items-center justify-between gap-3">
                                    <span className={`font-medium ${currentTheme.text}`}>
                                        +{refill.qty_added} {refill.qty_added === 1 ? "pill" : "pills"}
                                    </span>
                                    <span className={`text-xs ${currentTheme.secondaryText}`}>
                                        {formatDate(refill.refilled_at)}
                                    </span>
                                </div>

                                {(refill.pharmacy_name || refill.pharmacy_address || refill.dosage) && (
                                    <p className={`text-xs ${currentTheme.secondaryText}`}>
                                        {[refill.pharmacy_name, refill.pharmacy_address, refill.dosage]
                                            .filter(Boolean)
                                            .join(" · ")}
                                    </p>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    )
}

export default RefillSection
