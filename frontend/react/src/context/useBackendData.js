import {useCallback, useEffect, useState} from "react"
import * as authApi from "../api/auth"
import {clearToken, getToken, onUnauthorized} from "../api/client"
import * as medicationApi from "../api/medications"
import * as pharmacyApi from "../api/pharmacies"
import * as symptomApi from "../api/symptoms"

// The id used to track one dose on one day, shared by demo mode and the backend.
export function getDoseKey(medicationId, time, date = new Date()) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")

    return `${medicationId}|${year}-${month}-${day}|${time}`
}

// Fields the backend stores for a medication; everything else the pages send is kept
// on this device only (see "extras" below).
const MEDICATION_FIELDS = [
    "med_name", "med_type", "dosage", "route", "is_otc", "pills_per_dose",
    "recurrence", "start_date", "end_date", "is_refillable", "refill_reminder",
    "pill_qty", "requirements", "avoid_notes", "storage_notes", "label_set_id",
]

// Schedule options the medication API doesn't accept yet. (The medications table has
// columns for them, but the request and response schemas don't include them.)
const MEDICATION_EXTRA_FIELDS = [
    "schedule_type", "interval_hours", "interval_days", "first_dose_time",
    "weekly_day", "custom_days", "custom_times",
]

function pick(object, keys) {
    return keys.reduce((result, key) => {
        if (key in object) {
            result[key] = object[key]
        }

        return result
    }, {})
}

// "Extras" are the details the backend can't take yet. They are kept in this browser,
// per user, and merged back in when the data loads. Remove once the API accepts them.
function extrasKey(userId, kind) {
    return `pillbug-${kind}-extras-${userId}`
}

function readExtras(userId, kind) {
    try {
        return JSON.parse(localStorage.getItem(extrasKey(userId, kind))) || {}
    } catch {
        return {}
    }
}

function saveExtra(userId, kind, id, value) {
    const extras = readExtras(userId, kind)

    extras[id] = {...extras[id], ...value}

    try {
        localStorage.setItem(extrasKey(userId, kind), JSON.stringify(extras))
    } catch {
        // Storage is blocked; the extra details just won't be remembered.
    }
}

function toFrontendMedication(medication, reminders, extras = {}) {
    return {
        ...medication,
        // The API sends decimals as strings.
        pills_per_dose: Number(medication.pills_per_dose),
        pill_qty: medication.pill_qty == null ? null : Number(medication.pill_qty),
        reminders: reminders.map((reminder) => ({
            id: reminder.id,
            time: reminder.dose_time.slice(0, 5),
            is_active: reminder.is_active,
        })),
        reminder_times: reminders
            .filter((reminder) => reminder.is_active)
            .map((reminder) => reminder.dose_time.slice(0, 5)),
        schedule_type: medication.recurrence,
        interval_hours: null,
        interval_days: null,
        first_dose_time: null,
        weekly_day: null,
        custom_days: [],
        custom_times: [],
        ...extras,
    }
}

async function loadMedications(userId) {
    const medications = await medicationApi.listMedications()

    const reminderLists = await Promise.all(
        medications.map((medication) => medicationApi.listReminders(medication.id))
    )

    const extras = readExtras(userId, "medication")

    return medications.map((medication, index) =>
        toFrontendMedication(medication, reminderLists[index], extras[medication.id])
    )
}

// Today's doses that were marked as taken, keyed like the demo data: key -> taken_at.
async function loadTakenDoses() {
    const now = new Date()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const day = String(now.getDate()).padStart(2, "0")

    const taken = await medicationApi.listTakenDoses(`${now.getFullYear()}-${month}-${day}`)
    const logs = {}

    taken.forEach((dose) => {
        logs[getDoseKey(dose.med_id, dose.dose_time)] = dose.taken_at
    })

    return logs
}

function toFrontendSymptomLog(log) {
    return {
        ...log,
        time: log.time.slice(0, 5),
    }
}

const initialPharmacyState = {status: "idle", pharmacies: [], message: "", origin: null}

// Asks the browser for the user's location.
function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("This browser can't share your location."))
            return
        }

        navigator.geolocation.getCurrentPosition(
            (position) => resolve(position.coords),
            reject,
            {timeout: 10000, maximumAge: 5 * 60 * 1000}
        )
    })
}

// Signs the user in and loads everything from the backend. Used when demo mode is off.
export function useBackendData(enabled) {
    const [user, setUser] = useState(null)
    const [authLoading, setAuthLoading] = useState(() => enabled && Boolean(getToken()))
    const [medications, setMedications] = useState([])
    const [doseLogs, setDoseLogs] = useState({})
    const [symptomLogs, setSymptomLogs] = useState([])
    // medication id -> its refills, newest first (loaded when a medication's page is opened)
    const [refills, setRefills] = useState({})
    // status: "idle" (loading), "ready", "denied" (location blocked) or "error"
    const [pharmacyState, setPharmacyState] = useState(initialPharmacyState)

    function resetData() {
        setRefills({})
        setPharmacyState(initialPharmacyState)
        setUser(null)
        setMedications([])
        setDoseLogs({})
        setSymptomLogs([])
    }

    // Sign out if the backend says the token has expired.
    useEffect(() => {
        if (!enabled) {
            return
        }

        onUnauthorized(() => {
            clearToken()
            resetData()
        })
    }, [enabled])

    // Restore the session after a refresh.
    useEffect(() => {
        if (!enabled || !getToken()) {
            return
        }

        let cancelled = false

        authApi
            .getMe()
            .then((currentUser) => {
                if (!cancelled) {
                    setUser(currentUser)
                }
            })
            .catch((error) => {
                if (error.status === 401) {
                    clearToken()
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setAuthLoading(false)
                }
            })

        return () => {
            cancelled = true
        }
    }, [enabled])

    // Load the user's data once they are signed in.
    useEffect(() => {
        if (!enabled || !user) {
            return
        }

        let cancelled = false

        Promise.all([loadMedications(user.id), loadTakenDoses(), symptomApi.listSymptomLogs()])
            .then(([medicationList, takenDoses, logs]) => {
                if (cancelled) {
                    return
                }

                setMedications(medicationList)
                setDoseLogs(takenDoses)
                setSymptomLogs(logs.map(toFrontendSymptomLog))
            })
            .catch((error) => {
                console.error("Could not load your data:", error)
            })

        return () => {
            cancelled = true
        }
    }, [enabled, user])

    // Finds pharmacies near the user, nearest first.
    const loadPharmacies = useCallback(async () => {
        try {
            const {latitude, longitude} = await getCurrentPosition()
            const pharmacies = await pharmacyApi.listNearbyPharmacies(latitude, longitude)

            setPharmacyState({
                status: "ready",
                pharmacies,
                message: "",
                origin: {lat: latitude, lng: longitude},
            })
        } catch (error) {
            // GeolocationPositionError code 1 means the user (or browser) blocked location.
            const denied = error.code === 1

            setPharmacyState({
                ...initialPharmacyState,
                status: denied ? "denied" : "error",
                message: denied
                    ? "Location is turned off. Allow location access to see pharmacies near you."
                    : error.message || "Couldn't load pharmacies right now.",
            })
        }
    }, [])

    const retryPharmacies = useCallback(() => {
        setPharmacyState(initialPharmacyState)
        loadPharmacies()
    }, [loadPharmacies])

    async function signIn(email, password) {
        await authApi.logIn(email, password)
        setUser(await authApi.getMe())
    }

    async function signUp(details) {
        await authApi.signUp(details)
        await signIn(details.email, details.password)
    }

    function signOut() {
        clearToken()
        resetData()
    }

    async function refreshMedications() {
        setMedications(await loadMedications(user.id))
    }

    // Adds the medication, then one reminder per time (the backend keeps reminders separately).
    async function addMedication(medication) {
        const {reminder_times = [], ...rest} = medication

        const created = await medicationApi.createMedication(pick(rest, MEDICATION_FIELDS))

        saveExtra(user.id, "medication", created.id, pick(rest, MEDICATION_EXTRA_FIELDS))

        try {
            for (const time of new Set(reminder_times)) {
                await medicationApi.createReminder(created.id, time)
            }
        } finally {
            await refreshMedications()
        }
    }

    async function updateMedication(medicationId, changes) {
        const medicationChanges = pick(changes, MEDICATION_FIELDS)

        if (Object.keys(medicationChanges).length > 0) {
            await medicationApi.updateMedication(medicationId, medicationChanges)
        }

        saveExtra(user.id, "medication", medicationId, pick(changes, MEDICATION_EXTRA_FIELDS))

        try {
            if (changes.reminder_times) {
                const current = medications.find((medication) => medication.id === medicationId)
                const wanted = new Set(changes.reminder_times)
                const existing = new Set((current?.reminders || []).map((reminder) => reminder.time))

                for (const reminder of current?.reminders || []) {
                    if (!wanted.has(reminder.time)) {
                        await medicationApi.deleteReminder(medicationId, reminder.id)
                    }
                }

                for (const time of wanted) {
                    if (!existing.has(time)) {
                        await medicationApi.createReminder(medicationId, time)
                    }
                }
            }
        } finally {
            await refreshMedications()
        }
    }

    // Checks or unchecks a dose. The backend also adjusts the medication's pill count.
    async function toggleDoseTaken(doseKey) {
        const [medicationId, doseDate, doseTime] = doseKey.split("|")

        const result = await medicationApi.toggleDose({
            med_id: Number(medicationId),
            dose_date: doseDate,
            dose_time: doseTime,
        })

        setDoseLogs((current) => {
            const updated = {...current}

            if (result.taken) {
                updated[doseKey] = result.taken_at
            } else {
                delete updated[doseKey]
            }

            return updated
        })

        // Keep the pill count shown in the app in step with what the backend now holds.
        setMedications((current) =>
            current.map((medication) =>
                medication.id === Number(medicationId) && medication.pill_qty != null
                    ? {
                        ...medication,
                        pill_qty: medication.pill_qty + (result.taken ? -1 : 1) * medication.pills_per_dose,
                    }
                    : medication
            )
        )
    }

    async function deleteMedication(medicationId) {
        await medicationApi.deleteMedication(medicationId)

        setMedications((current) => current.filter((medication) => medication.id !== medicationId))

        // Forget its checked doses too (the backend removes them along with the medication).
        setDoseLogs((current) =>
            Object.fromEntries(
                Object.entries(current).filter(([key]) => !key.startsWith(`${medicationId}|`))
            )
        )
    }

    const loadRefills = useCallback(async (medicationId) => {
        try {
            const list = await medicationApi.listRefills(medicationId)

            setRefills((current) => ({...current, [medicationId]: list}))
        } catch (error) {
            console.error("Could not load refills:", error)
        }
    }, [])

    // Logs a refill. The backend adds the quantity to the pill count, so do the same here.
    async function addRefill(medicationId, refill) {
        const created = await medicationApi.createRefill(medicationId, refill)

        setRefills((current) => ({
            ...current,
            [medicationId]: [created, ...(current[medicationId] || [])],
        }))

        setMedications((current) =>
            current.map((medication) =>
                medication.id === medicationId
                    ? {...medication, pill_qty: (medication.pill_qty || 0) + created.qty_added}
                    : medication
            )
        )
    }

    async function addSymptomEntry(entry) {
        const created = await symptomApi.createSymptomLog(entry)

        setSymptomLogs((current) => [toFrontendSymptomLog(created), ...current])

        return created
    }

    async function updateSymptomEntry(entryId, changes) {
        const updated = await symptomApi.updateSymptomLog(
            entryId,
            pick(changes, ["symptom", "severity", "duration", "notes"])
        )

        setSymptomLogs((current) =>
            current.map((log) => (log.id === entryId ? toFrontendSymptomLog(updated) : log))
        )
    }

    async function deleteSymptomEntry(entryId) {
        await symptomApi.deleteSymptomLog(entryId)

        setSymptomLogs((current) => current.filter((log) => log.id !== entryId))
    }

    return {
        user,
        authLoading,
        medications,
        doseLogs,
        symptomLogs,
        refills,
        loadRefills,
        addRefill,
        deleteMedication,
        pharmacies: pharmacyState.pharmacies,
        pharmacyStatus: pharmacyState.status,
        pharmacyMessage: pharmacyState.message,
        pharmacyOrigin: pharmacyState.origin,
        loadPharmacies,
        retryPharmacies,
        signIn,
        signUp,
        signOut,
        addMedication,
        updateMedication,
        toggleDoseTaken,
        addSymptomEntry,
        updateSymptomEntry,
        deleteSymptomEntry,
    }
}
