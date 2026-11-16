import {useState} from "react"
import {useDemo} from "../context/DemoContext"
import {useTheme} from "../context/ThemeContext"

function formatBirthday(birthday) {
    const [year, month, day] = birthday.split("-")

    return `${month} / ${day} / ${year}`
}

function getToday() {
    const now = new Date()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const day = String(now.getDate()).padStart(2, "0")

    return `${now.getFullYear()}-${month}-${day}`
}

const emptyPasswordForm = {current: "", next: "", confirm: ""}

// The "User information" section of the profile: the details, the dark mode switch,
// and the Edit details / Change password forms.
function UserInformation() {
    // null, "details" or "password": which form is open
    const [openForm, setOpenForm] = useState(null)
    const [detailsForm, setDetailsForm] = useState({})
    const [passwordForm, setPasswordForm] = useState(emptyPasswordForm)
    const [error, setError] = useState("")
    const [notice, setNotice] = useState("")
    const [saving, setSaving] = useState(false)

    const {demoMode, demoUser, updateProfile, changePassword} = useDemo()
    const {theme, currentTheme, changeTheme} = useTheme()
    const isDark = theme === "dark"

    const inputClass = `w-full rounded-lg border ${currentTheme.border} bg-transparent px-3 py-2 text-sm outline-none ${currentTheme.text}`
    const labelClass = `${currentTheme.text} mb-1 block text-sm font-medium`
    const outlineButton = `w-full rounded-lg border ${currentTheme.accentBorder} ${currentTheme.accentText} py-2 text-sm font-medium`

    function openDetails() {
        setDetailsForm({
            first_name: demoUser.first_name,
            last_name: demoUser.last_name,
            email: demoUser.email,
            d_o_b: demoUser.d_o_b,
        })
        setError("")
        setNotice("")
        setOpenForm("details")
    }

    function openPassword() {
        setPasswordForm(emptyPasswordForm)
        setError("")
        setNotice("")
        setOpenForm("password")
    }

    function closeForm() {
        setOpenForm(null)
        setError("")
    }

    async function save(request, successMessage) {
        setSaving(true)
        setError("")

        try {
            await request()
            setOpenForm(null)
            setNotice(successMessage)
        } catch (saveError) {
            setError(saveError.message)
        } finally {
            setSaving(false)
        }
    }

    function handleDetailsSubmit(event) {
        event.preventDefault()

        const details = {
            first_name: detailsForm.first_name.trim(),
            last_name: detailsForm.last_name.trim(),
            email: detailsForm.email.trim(),
            d_o_b: detailsForm.d_o_b,
        }

        if (!details.first_name || !details.last_name || !details.email || !details.d_o_b) {
            setError("Please fill out every field.")
            return
        }

        if (!/^\S+@\S+\.\S+$/.test(details.email)) {
            setError("Please enter a valid email address.")
            return
        }

        if (details.d_o_b > getToday()) {
            setError("Birthday can't be in the future.")
            return
        }

        save(() => updateProfile(details), "Your details were updated.")
    }

    function handlePasswordSubmit(event) {
        event.preventDefault()

        if (!passwordForm.current || !passwordForm.next || !passwordForm.confirm) {
            setError("Please fill out every field.")
            return
        }

        if (passwordForm.next.length < 8) {
            setError("Your new password must be at least 8 characters.")
            return
        }

        if (passwordForm.next !== passwordForm.confirm) {
            setError("The new passwords don't match.")
            return
        }

        if (passwordForm.next === passwordForm.current) {
            setError("Your new password must be different from your current one.")
            return
        }

        save(
            () => changePassword(passwordForm.current, passwordForm.next),
            demoMode
                ? "Password change checked. Demo mode doesn't store passwords."
                : "Your password was updated."
        )
    }

    function field(form, setForm, name, label, props = {}) {
        return (
            <div>
                <label htmlFor={`profile-${name}`} className={labelClass}>
                    {label}
                </label>
                <input
                    id={`profile-${name}`}
                    value={form[name]}
                    onChange={(event) => setForm((current) => ({...current, [name]: event.target.value}))}
                    className={inputClass}
                    {...props}
                />
            </div>
        )
    }

    const formButtons = (submitLabel) => (
        <div className="grid grid-cols-2 gap-2">
            <button
                type="button"
                onClick={closeForm}
                className={`rounded-lg border ${currentTheme.border} ${currentTheme.text} py-2 text-sm font-medium`}
            >
                Cancel
            </button>
            <button
                type="submit"
                disabled={saving}
                className={`${currentTheme.primary} rounded-lg py-2 text-sm font-medium text-white disabled:opacity-60`}
            >
                {saving ? "Saving..." : submitLabel}
            </button>
        </div>
    )

    return (
        <div className={`border-t ${currentTheme.border} p-4`}>
            <dl className="space-y-2 text-sm">
                {[
                    ["Name", `${demoUser.first_name} ${demoUser.last_name}`],
                    ["Email", demoUser.email],
                    ["Birthday", formatBirthday(demoUser.d_o_b)],
                ].map(([label, value]) => (
                    <div key={label} className="flex gap-2">
                        <dt className={`${currentTheme.text} font-semibold`}>{label}</dt>
                        <dd className={`${currentTheme.secondaryText} break-all`}>{value}</dd>
                    </div>
                ))}
            </dl>

            <div className="mb-4 mt-4 flex items-center justify-between">
                <div>
                    <p className={`${currentTheme.text} text-sm font-semibold`}>
                        Dark mode
                    </p>
                    <p className={`${currentTheme.secondaryText} text-xs`}>
                        {isDark ? "Dark theme is on." : "Light theme is on."}
                    </p>
                </div>

                <button
                    type="button"
                    role="switch"
                    aria-checked={isDark}
                    aria-label="Toggle dark mode"
                    onClick={() => changeTheme(isDark ? "light" : "dark")}
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                        isDark ? "bg-blue-500" : "bg-gray-300"
                    }`}
                >
                    <span
                        className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                            isDark ? "translate-x-5" : ""
                        }`}
                    />
                </button>
            </div>

            {notice && openForm === null && (
                <p role="status" className={`${currentTheme.secondaryText} mb-3 text-sm`}>
                    {notice}
                </p>
            )}

            {openForm === "details" && (
                <form onSubmit={handleDetailsSubmit} className="mb-3 space-y-3">
                    {field(detailsForm, setDetailsForm, "first_name", "First name", {type: "text", maxLength: 50})}
                    {field(detailsForm, setDetailsForm, "last_name", "Last name", {type: "text", maxLength: 50})}
                    {field(detailsForm, setDetailsForm, "email", "Email", {type: "email", maxLength: 255})}
                    {field(detailsForm, setDetailsForm, "d_o_b", "Birthday", {type: "date", max: getToday()})}

                    {error && <p role="alert" className={`text-sm ${currentTheme.dangerText}`}>{error}</p>}

                    {formButtons("Save details")}
                </form>
            )}

            {openForm === "password" && (
                <form onSubmit={handlePasswordSubmit} className="mb-3 space-y-3">
                    {field(passwordForm, setPasswordForm, "current", "Current password", {type: "password", autoComplete: "current-password"})}
                    {field(passwordForm, setPasswordForm, "next", "New password", {type: "password", autoComplete: "new-password"})}
                    {field(passwordForm, setPasswordForm, "confirm", "Confirm new password", {type: "password", autoComplete: "new-password"})}

                    {error && <p role="alert" className={`text-sm ${currentTheme.dangerText}`}>{error}</p>}

                    {formButtons("Update password")}
                </form>
            )}

            {openForm === null && (
                <div className="space-y-2">
                    <button type="button" onClick={openDetails} className={outlineButton}>
                        Edit details
                    </button>
                    <button type="button" onClick={openPassword} className={outlineButton}>
                        Change password
                    </button>
                </div>
            )}
        </div>
    )
}

export default UserInformation
