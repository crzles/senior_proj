import {createContext, useContext, useMemo, useState} from "react"
import {getDoseKey, useBackendData} from "./useBackendData"

const DemoContext = createContext()

const emptyHabits = {smoking: "", alcohol: "", activity_days: "", sleep_hours: ""}

// TODO: The backend has no table for health habits yet (see the TODO in models/health.py).
// Until it does, signed-in users' answers are remembered in this browser, per user.
const habitsKey = (userId) => `pillbug-health-habits-${userId}`

function readStoredHabits(userId) {
    if (!userId) {
        return emptyHabits
    }

    try {
        return {...emptyHabits, ...JSON.parse(localStorage.getItem(habitsKey(userId)))}
    } catch {
        return emptyHabits
    }
}

// A sample drug label for the demo Ibuprofen, shaped like the backend's /api/drugs/{set_id}.
// The text is a short demo summary, not real label data.
const demoDrugLabels = {
    "demo-ibuprofen": {
        set_id: "demo-ibuprofen",
        med_name: "Ibuprofen",
        generic_name: "Ibuprofen",
        purpose: "Pain reliever / fever reducer",
        indications: "Temporarily relieves minor aches and pains due to headache, muscular aches, backache, the common cold, toothache and menstrual cramps. Temporarily reduces fever. (Demo sample text.)",
        dosage: "Adults: take 1 tablet every 4 to 6 hours while symptoms last. Do not exceed the amount on the package. (Demo sample text.)",
        storage: "Store at room temperature and avoid excessive heat and humidity. (Demo sample text.)",
        warnings: "Ibuprofen may cause stomach bleeding, especially if you take other pain relievers, blood thinners or steroids, have had stomach ulcers, or drink three or more alcoholic drinks a day. Ask a doctor before use if you have heart disease, high blood pressure or kidney disease. (Demo sample text.)",
        boxed_warning: null,
        last_updated: "2025-01-15T00:00:00Z",
    },
}

// Where the demo user "is" (downtown Springfield, IL), so the real map has somewhere to centre.
// (Module level so the same object is reused and the map is not redrawn on every render.)
const demoOrigin = {lat: 39.799, lng: -89.644}

// Demo mode keeps its refills in memory, so there is nothing to load.
const noopLoadRefills = () => {}

export function DemoProvider({children}) {
    // Demo mode shows sample data for testing. When it is off, everything comes from the
    // backend. Set VITE_DEMO_MODE=true in frontend/react/.env.local to turn it on.
    const [demoMode, setDemoMode] = useState(import.meta.env.VITE_DEMO_MODE === "true")
    const backend = useBackendData(!demoMode)
    const [demoUserEdits, setDemoUserEdits] = useState({})
    const [savedHabits, setSavedHabits] = useState(null)
    const [deletedMedicationIds, setDeletedMedicationIds] = useState([])
    // medication id -> refills, newest first. Ibuprofen starts with one from two weeks ago.
    const [demoRefills, setDemoRefills] = useState(() => ({
        1: [{
            id: 1,
            med_id: 1,
            refilled_at: new Date(`${getDemoDateKey(14)}T10:00`).toISOString(),
            qty_added: 30,
            dosage: "200 mg",
            pharmacy_name: "Maplewood Pharmacy",
            pharmacy_address: "123 Maple Street, Springfield",
        }],
    }))
    const storedHabits = useMemo(() => readStoredHabits(backend.user?.id), [backend.user?.id])
    const demoUserData = {
        id: 1,
        first_name: "Rollie",
        last_name: "Pollie",
        email: "demo@pillbug.com",
        d_o_b: "2026-09-26", // the day the project started
    }

    const demoUser = demoMode ? {...demoUserData, ...demoUserEdits} : backend.user

    const demoMedicationData = [
    {
        id: 1,
        user_id: 1,
        label_set_id: "demo-ibuprofen",
        med_name: "Ibuprofen",
        med_type: "Medication",
        dosage: "200 mg",
        route: "oral",
        is_otc: true,
        pills_per_dose: 1,
        recurrence: "Once daily",
        reminder_times: ["08:00"],
        schedule_type: "fixed",
        interval_hours: null,
        interval_days: null,
        first_dose_time: null,
        weekly_day: null,
        custom_days: [],
        custom_times: [],
        start_date: "2026-10-01",
        end_date: null,
        is_refillable: true,
        pill_qty: 30,
        refill_reminder: 5,
        requirements: "",
        avoid_notes: "",
        storage_notes: "",
        created_at: "2026-10-01T00:00:00Z",
    },
    {
        id: 2,
        user_id: 1,
        label_set_id: null,
        med_name: "Vitamin D",
        med_type: "Supplement",
        dosage: "1000 IU",
        route: "oral",
        is_otc: true,
        pills_per_dose: 1,
        recurrence: "Once daily",
        reminder_times: ["23:59"],
        schedule_type: "fixed",
        interval_hours: null,
        interval_days: null,
        first_dose_time: null,
        weekly_day: null,
        custom_days: [],
        custom_times: [],
        start_date: "2026-10-01",
        end_date: null,
        is_refillable: false,
        pill_qty: null,
        refill_reminder: null,
        requirements: "",
        avoid_notes: "",
        storage_notes: "",
    }
]

// Sample pharmacies for the map page, only shown in demo mode. opens / closes are 24-hour
// "HH:MM" times; open status is worked out from the current time on the map page.
// x / y only place the pins on the placeholder map (percent of the map area).
const demoPharmacyData = [
    {
        id: 1,
        name: "Maplewood Pharmacy",
        address: "123 Maple Street, Springfield",
        distance: "0.4 mi",
        opens: "08:00",
        closes: "21:00",
        phone: "555-0101",
        is24Hours: false,
        latitude: 39.8035,
        longitude: -89.6395,
        x: 62,
        y: 38,
    },
    {
        id: 2,
        name: "CareFirst Pharmacy",
        address: "88 Oak Avenue, Springfield",
        distance: "0.9 mi",
        opens: null,
        closes: null,
        phone: "555-0102",
        is24Hours: true,
        latitude: 39.795,
        longitude: -89.654,
        x: 28,
        y: 52,
    },
    {
        id: 3,
        name: "Riverside Drugs",
        address: "410 River Road, Springfield",
        distance: "1.6 mi",
        opens: "08:00",
        closes: "17:00",
        phone: "555-0103",
        is24Hours: false,
        latitude: 39.789,
        longitude: -89.633,
        x: 74,
        y: 72,
    },
]

const demoPharmacies = demoMode ? demoPharmacyData : []

// User-added medications are always kept; the sample medications only appear in demo mode.
const [medications, setMedications] = useState([])
// Demo mode starts with the past six days of doses already logged, so the Insights page has
// a week of history to work with. Ibuprofen (08:00) was skipped 2 and 5 days ago, and
// Vitamin D (23:59) 3 days ago. Today's doses are left for the Home page.
const [demoDoseLogs, setDoseLogs] = useState(() => {
    const skipped = {1: [2, 5], 2: [3]}
    const logs = {}

    for (let daysAgo = 1; daysAgo <= 6; daysAgo++) {
        const date = new Date()
        date.setDate(date.getDate() - daysAgo)

        demoMedicationData.forEach((medication) => {
            if (skipped[medication.id]?.includes(daysAgo)) {
                return
            }

            const time = medication.reminder_times[0]

            logs[getDoseKey(medication.id, time, date)] = new Date(`${getDemoDateKey(daysAgo)}T${time}`).toISOString()
        })
    }

    return logs
})
// Suggestions for the symptom field. The backend stores the name as typed on each entry.
const symptoms = [
    "Headache",
    "Nausea",
    "Dizziness",
    "Fatigue",
    "Fever",
    "Cough",
    "Stomach pain",
    "Rash",
    "Shortness of breath",
].map((name, index) => ({id: index + 1, name}))

// Matches the backend's symptom log: symptom, date, time, severity, duration, notes, logged_at.
const [userSymptomLogs, setUserSymptomLogs] = useState([])

// Edits and deletes are stored by id so they apply to both sample and user-added logs.
const [symptomEdits, setSymptomEdits] = useState({})
const [deletedSymptomIds, setDeletedSymptomIds] = useState([])

function getDemoDateKey(daysAgo) {
    const date = new Date()
    date.setDate(date.getDate() - daysAgo)

    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")

    return `${date.getFullYear()}-${month}-${day}`
}

// Sample symptom logs (dates are relative to today), only shown in demo mode.
const demoSymptomLogData = [
    {
        id: 1,
        symptom: "Headache",
        date: getDemoDateKey(0),
        time: "08:30",
        severity: "Mild",
        duration: "30 minutes",
        notes: "Felt it after skipping breakfast.",
        logged_at: new Date(`${getDemoDateKey(0)}T08:30`).toISOString(),
    },
    {
        id: 3,
        symptom: "Fatigue",
        date: getDemoDateKey(1),
        time: "15:00",
        severity: "Mild",
        duration: "2 hours",
        notes: "Slept badly the night before.",
        logged_at: new Date(`${getDemoDateKey(1)}T15:00`).toISOString(),
    },
    {
        id: 4,
        symptom: "Headache",
        date: getDemoDateKey(2),
        time: "17:45",
        severity: "Moderate",
        duration: "1 hour",
        notes: "Came on in the afternoon. Missed my morning dose.",
        logged_at: new Date(`${getDemoDateKey(2)}T17:45`).toISOString(),
    },
    {
        id: 5,
        symptom: "Fatigue",
        date: getDemoDateKey(4),
        time: "14:20",
        severity: "Mild",
        duration: "3 hours",
        notes: "",
        logged_at: new Date(`${getDemoDateKey(4)}T14:20`).toISOString(),
    },
    {
        id: 6,
        symptom: "Headache",
        date: getDemoDateKey(5),
        time: "09:10",
        severity: "Mild",
        duration: "45 minutes",
        notes: "Missed my morning dose.",
        logged_at: new Date(`${getDemoDateKey(5)}T09:10`).toISOString(),
    },
    {
        id: 2,
        symptom: "Nausea",
        date: getDemoDateKey(7),
        time: "19:15",
        severity: "Moderate",
        duration: "20 minutes",
        notes: "Felt queasy after dinner.",
        logged_at: new Date(`${getDemoDateKey(7)}T19:15`).toISOString(),
    },
]

const demoSymptomLogs = (
    demoMode
        ? [...userSymptomLogs, ...demoSymptomLogData]
        : userSymptomLogs
)
    .filter((log) => !deletedSymptomIds.includes(log.id))
    .map((log) => ({
        ...log,
        ...symptomEdits[log.id],
    }))
    .sort((a, b) => `${b.date}T${b.time}`.localeCompare(`${a.date}T${a.time}`))

// Edits are stored by id so they apply to both sample and user-added medications.
const [medicationEdits, setMedicationEdits] = useState({})

const sampleMedications = (
    demoMode
        ? [...demoMedicationData, ...medications]
        : medications
).filter((medication) => !deletedMedicationIds.includes(medication.id)).map((medication) => ({
    ...medication,
    ...medicationEdits[medication.id],
}))

function toggleDemoDoseTaken(doseKey) {
    // Like the backend, checking a dose takes the pills off the count and unchecking puts them back.
    const [medicationId] = doseKey.split("|")
    const medication = sampleMedications.find((item) => String(item.id) === medicationId)

    if (medication && medication.pill_qty != null) {
        const change = demoDoseLogs[doseKey] ? 1 : -1
        const pills = Math.round((medication.pill_qty + change * medication.pills_per_dose) * 100) / 100

        setMedicationEdits((currentEdits) => ({
            ...currentEdits,
            [medication.id]: {...currentEdits[medication.id], pill_qty: pills},
        }))
    }

    setDoseLogs((currentLogs) => {
        const updatedLogs = {...currentLogs}

        if (updatedLogs[doseKey]) {
            delete updatedLogs[doseKey]
        } else {
            updatedLogs[doseKey] = new Date().toISOString()
        }

        return updatedLogs
    })
}

function addDemoMedication(medication) {
    setMedications((currentMedications) => [
        ...currentMedications,
        {
            ...medication,
            id: Date.now(),
            user_id: 1,
            created_at: new Date().toISOString(),
        },
    ])
}

function addDemoSymptomEntry(entry) {
    setUserSymptomLogs((currentLogs) => [
        ...currentLogs,
        {
            ...entry,
            id: Date.now(),
            logged_at: new Date().toISOString(),
        },
    ])
}

function updateDemoSymptomEntry(entryId, changes) {
    setSymptomEdits((currentEdits) => ({
        ...currentEdits,
        [entryId]: {
            ...currentEdits[entryId],
            ...changes,
        },
    }))
}

function deleteDemoSymptomEntry(entryId) {
    setDeletedSymptomIds((currentIds) => [...currentIds, entryId])
}

function updateDemoMedication(medicationId, changes) {
    setMedicationEdits((currentEdits) => ({
        ...currentEdits,
        [medicationId]: {
            ...currentEdits[medicationId],
            ...changes,
        },
    }))
}

// The pages use these. With demo mode on they work on the sample data above;
// with it off they call the backend, and the page shows any error it throws.
async function toggleDoseTaken(doseKey) {
    if (demoMode) {
        toggleDemoDoseTaken(doseKey)
        return
    }

    try {
        await backend.toggleDoseTaken(doseKey)
    } catch (error) {
        alert(error.message)
    }
}

const addMedication = (medication) =>
    demoMode ? addDemoMedication(medication) : backend.addMedication(medication)

const updateMedication = (medicationId, changes) =>
    demoMode ? updateDemoMedication(medicationId, changes) : backend.updateMedication(medicationId, changes)

const addSymptomEntry = async (entry) =>
    demoMode ? addDemoSymptomEntry(entry) : backend.addSymptomEntry(entry)

const updateSymptomEntry = async (entryId, changes) =>
    demoMode ? updateDemoSymptomEntry(entryId, changes) : backend.updateSymptomEntry(entryId, changes)

const deleteSymptomEntry = async (entryId) =>
    demoMode ? deleteDemoSymptomEntry(entryId) : backend.deleteSymptomEntry(entryId)

// TODO: The backend can't save profile changes or passwords yet (PATCH /api/users/me and a
// change-password route are listed as future work). Once they exist, call them in the
// non-demo branch below.
const NOT_AVAILABLE = "This isn't available yet. The backend doesn't support it."

function deleteDemoMedication(medicationId) {
    setDeletedMedicationIds((currentIds) => [...currentIds, medicationId])
}

// Logging a refill adds its quantity to the pill count, like the backend does.
function addDemoRefill(medicationId, refill) {
    const created = {
        ...refill,
        id: Date.now(),
        med_id: medicationId,
        refilled_at: new Date().toISOString(),
    }

    setDemoRefills((current) => ({
        ...current,
        [medicationId]: [created, ...(current[medicationId] || [])],
    }))

    const medication = sampleMedications.find((item) => item.id === medicationId)

    setMedicationEdits((currentEdits) => ({
        ...currentEdits,
        [medicationId]: {
            ...currentEdits[medicationId],
            pill_qty: (medication?.pill_qty || 0) + refill.qty_added,
        },
    }))
}

const deleteMedication = async (medicationId) =>
    demoMode ? deleteDemoMedication(medicationId) : backend.deleteMedication(medicationId)

const addRefill = async (medicationId, refill) =>
    demoMode ? addDemoRefill(medicationId, refill) : backend.addRefill(medicationId, refill)

async function updateProfile(changes) {
    if (!demoMode) {
        throw new Error(NOT_AVAILABLE)
    }

    setDemoUserEdits((current) => ({...current, ...changes}))
}

async function changePassword() {
    if (!demoMode) {
        throw new Error(NOT_AVAILABLE)
    }

    // Demo mode has no password to change.
}

const healthHabits = savedHabits || storedHabits

async function updateHealthHabits(habits) {
    const next = {...emptyHabits, ...habits}

    setSavedHabits(next)

    if (!demoMode && backend.user) {
        try {
            localStorage.setItem(habitsKey(backend.user.id), JSON.stringify(next))
        } catch {
            throw new Error("Couldn't save on this device. Please check your browser settings.")
        }
    }
}

function signOut() {
    if (!demoMode) {
        backend.signOut()
    }
}

    return (
        <DemoContext.Provider
            value={{
                demoMode,
                setDemoMode,
                demoUser,
                isAuthenticated: demoMode || Boolean(backend.user),
                authLoading: !demoMode && backend.authLoading,
                signIn: backend.signIn,
                signUp: backend.signUp,
                signOut,
                healthHabits,
                demoDrugLabels,
                refills: demoMode ? demoRefills : backend.refills,
                loadRefills: demoMode ? noopLoadRefills : backend.loadRefills,
                addRefill,
                deleteMedication,
                updateHealthHabits,
                updateProfile,
                changePassword,
                demoMedications: demoMode ? sampleMedications : backend.medications,
                pharmacies: demoMode ? demoPharmacies : backend.pharmacies,
                pharmacyStatus: demoMode ? "ready" : backend.pharmacyStatus,
                pharmacyMessage: backend.pharmacyMessage,
                pharmacyOrigin: demoMode ? demoOrigin : backend.pharmacyOrigin,
                loadPharmacies: backend.loadPharmacies,
                retryPharmacies: backend.retryPharmacies,
                doseLogs: demoMode ? demoDoseLogs : backend.doseLogs,
                symptoms,
                symptomLogs: demoMode ? demoSymptomLogs : backend.symptomLogs,
                addSymptomEntry,
                updateSymptomEntry,
                deleteSymptomEntry,
                getDoseKey,
                toggleDoseTaken,
                addMedication,
                updateMedication,
            }}
        >
            {children}
        </DemoContext.Provider>
    )
}

export function useDemo() {
    return useContext(DemoContext)
}