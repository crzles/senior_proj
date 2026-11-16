import {useEffect, useRef, useState} from "react"
import * as authApi from "../api/auth"
import {clearToken, getToken, onUnauthorized} from "../api/client"
import * as medicationApi from "../api/medications"
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

// Schedule options the backend has no columns for yet.
const MEDICATION_EXTRA_FIELDS = [
    "schedule_type", "interval_hours", "interval_days", "first_dose_time",
    "weekly_day", "custom_days", "custom_times",
]

// Symptom details the backend has no columns for yet.
const SYMPTOM_EXTRA_FIELDS = ["time", "severity", "duration"]

function pick(object, keys) {
    return keys.reduce((result, key) => {
        if (key in object) {
            result[key] = object[key]
        }

        return result
    }, {})
}

// "Extras" are the details the backend can't store yet. They are kept in this browser,
// per user, and merged back in when the data loads. Remove once the backend has the columns.
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

function writeExtras(userId, kind, extras) {
    try {
        localStorage.setItem(extrasKey(userId, kind), JSON.stringify(extras))
    } catch {
        // Storage is blocked; the extra details just won't be remembered.
    }
}

function saveExtra(userId, kind, id, value) {
    const extras = readExtras(userId, kind)

    if (value) {
        extras[id] = {...extras[id], ...value}
    } else {
        delete extras[id]
    }

    writeExtras(userId, kind, extras)
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

async function loadMedicationData(userId) {
    const medications = await medicationApi.listMedications()

    const reminderLists = await Promise.all(
        medications.map((medication) => medicationApi.listReminders(medication.id))
    )

    const extras = readExtras(userId, "medication")

    // reminder id -> which medication and time it belongs to, used to match doses below.
    const reminderLookup = {}

    medications.forEach((medication, index) => {
        reminderLists[index].forEach((reminder) => {
            reminderLookup[reminder.id] = {
                medId: medication.id,
                time: reminder.dose_time.slice(0, 5),
            }
        })
    })

    return {
        medications: medications.map((medication, index) =>
            toFrontendMedication(medication, reminderLists[index], extras[medication.id])
        ),
        reminderLookup,
    }
}

async function loadDoses(reminderLookup) {
    const doses = await medicationApi.listTodayDoses()
    const logs = {}
    const ids = {}

    doses.forEach((dose) => {
        const reminder = reminderLookup[dose.reminder_id]

        if (!reminder) {
            return
        }

        const key = getDoseKey(reminder.medId, reminder.time)

        ids[key] = dose.id

        if (dose.status === "taken") {
            logs[key] = dose.taken_at
        }
    })

    return {logs, ids}
}

function toFrontendSymptomLog(log, symptoms, extras = {}) {
    return {
        ...log,
        note: log.note || "",
        symptom: symptoms.find((symptom) => symptom.id === log.symptom_id)?.name || "",
        time: "",
        severity: "",
        duration: "",
        ...extras,
    }
}

function sortSymptomLogs(logs) {
    return [...logs].sort((a, b) =>
        `${b.logged_on}T${b.time || "00:00"}`.localeCompare(`${a.logged_on}T${a.time || "00:00"}`)
    )
}

// Signs the user in and loads everything from the backend. Used when demo mode is off.
export function useBackendData(enabled) {
    const [user, setUser] = useState(null)
    const [authLoading, setAuthLoading] = useState(() => enabled && Boolean(getToken()))
    const [medications, setMedications] = useState([])
    const [doses, setDoses] = useState({logs: {}, ids: {}})
    const [symptoms, setSymptoms] = useState([])
    const [symptomLogs, setSymptomLogs] = useState([])

    const reminderLookup = useRef({})

    function resetData() {
        setUser(null)
        setMedications([])
        setDoses({logs: {}, ids: {}})
        setSymptoms([])
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

        async function load() {
            const medicationData = await loadMedicationData(user.id)
            reminderLookup.current = medicationData.reminderLookup

            const [doseData, symptomList, logList] = await Promise.all([
                loadDoses(medicationData.reminderLookup),
                symptomApi.listSymptoms(),
                symptomApi.listSymptomLogs(),
            ])

            if (cancelled) {
                return
            }

            const symptomExtras = readExtras(user.id, "symptom")

            setMedications(medicationData.medications)
            setDoses(doseData)
            setSymptoms(symptomList)
            setSymptomLogs(
                sortSymptomLogs(
                    logList.map((log) => toFrontendSymptomLog(log, symptomList, symptomExtras[log.id]))
                )
            )
        }

        load().catch((error) => {
            console.error("Could not load your data:", error)
        })

        return () => {
            cancelled = true
        }
    }, [enabled, user])

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
        const medicationData = await loadMedicationData(user.id)
        reminderLookup.current = medicationData.reminderLookup

        setMedications(medicationData.medications)
        setDoses(await loadDoses(medicationData.reminderLookup))
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

    // The backend can mark a dose as taken but has no way to undo it.
    async function toggleDoseTaken(doseKey) {
        if (doses.logs[doseKey]) {
            throw new Error("A dose that was marked as taken can't be undone yet.")
        }

        let doseId = doses.ids[doseKey]

        if (!doseId) {
            const fresh = await loadDoses(reminderLookup.current)
            setDoses(fresh)
            doseId = fresh.ids[doseKey]
        }

        if (!doseId) {
            throw new Error("This dose isn't scheduled yet. Please try again in a moment.")
        }

        const updated = await medicationApi.markDoseTaken(doseId)

        setDoses((current) => ({
            ...current,
            logs: {...current.logs, [doseKey]: updated.taken_at},
        }))
    }

    // Finds a symptom by name, or adds it to the shared list when it's new.
    async function getSymptomId(name) {
        const trimmed = name.trim()
        const find = (list) =>
            list.find((symptom) => symptom.name.toLowerCase() === trimmed.toLowerCase())

        const existing = find(symptoms)

        if (existing) {
            return {id: existing.id, list: symptoms}
        }

        try {
            const created = await symptomApi.createSymptom(trimmed)
            const list = [...symptoms, created]

            setSymptoms(list)

            return {id: created.id, list}
        } catch (error) {
            // Someone else added it first, so fetch the list and use that one.
            if (error.status !== 409) {
                throw error
            }

            const list = await symptomApi.listSymptoms()

            setSymptoms(list)

            return {id: find(list).id, list}
        }
    }

    async function addSymptomEntry({symptom, logged_on, note, ...extras}) {
        const {id: symptomId, list} = await getSymptomId(symptom)

        const created = await symptomApi.createSymptomLog({
            symptom_id: symptomId,
            logged_on,
            note: note || undefined,
        })

        const entryExtras = pick(extras, SYMPTOM_EXTRA_FIELDS)

        saveExtra(user.id, "symptom", created.id, entryExtras)

        setSymptomLogs((current) =>
            sortSymptomLogs([...current, toFrontendSymptomLog(created, list, entryExtras)])
        )

        return created
    }

    async function deleteSymptomEntry(entryId) {
        await symptomApi.deleteSymptomLog(entryId)

        saveExtra(user.id, "symptom", entryId, null)

        setSymptomLogs((current) => current.filter((log) => log.id !== entryId))
    }

    // The backend has no way to edit a log, so an edit saves a new entry and removes the old one.
    async function updateSymptomEntry(entryId, changes) {
        const existing = symptomLogs.find((log) => log.id === entryId)

        if (!existing) {
            return
        }

        const merged = {...existing, ...changes}

        await addSymptomEntry({
            symptom: merged.symptom,
            logged_on: merged.logged_on,
            note: merged.note,
            time: merged.time,
            severity: merged.severity,
            duration: merged.duration,
        })

        await deleteSymptomEntry(entryId)
    }

    return {
        user,
        authLoading,
        medications,
        doseLogs: doses.logs,
        symptoms,
        symptomLogs,
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
