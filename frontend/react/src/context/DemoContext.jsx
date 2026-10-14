import {createContext, useContext, useState} from "react"

const DemoContext = createContext()

export function DemoProvider({children}) {
    const [demoMode, setDemoMode] = useState(false)
    const demoUserData = {
        firstName: "Rollie",
        lastName: "Pollie",
        email: "demo@pillbug.com",
    }

    const demoUser = demoMode ? demoUserData : null

    const demoMedicationData = [
    {
        id: 1,
        med_name: "Ibuprofen",
        med_type: "Medication",
        dosage: "200 mg",
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
        is_refillable: false,
        pill_qty: null,
        refill_reminder: null,
        requirements: "",
        avoid_notes: "",
        storage_notes: "",
    },
    {
        id: 2,
        med_name: "Vitamin D",
        med_type: "Supplement",
        dosage: "1000 IU",
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

// User-added medications are always kept; the sample medications only appear in demo mode.
const [medications, setMedications] = useState([])
const [doseLogs, setDoseLogs] = useState({})

// Edits are stored by id so they apply to both sample and user-added medications.
const [medicationEdits, setMedicationEdits] = useState({})

const demoMedications = (
    demoMode
        ? [...demoMedicationData, ...medications]
        : medications
).map((medication) => ({
    ...medication,
    ...medicationEdits[medication.id],
}))

function getDoseKey(medicationId, time, date = new Date()) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")

    const dateKey = `${year}-${month}-${day}`

    return `${medicationId}|${dateKey}|${time}`
}

function toggleDoseTaken(doseKey) {
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

function addMedication(medication) {
    setMedications((currentMedications) => [
        ...currentMedications,
        {
            ...medication,
            id: Date.now(),
            added_at: new Date().toISOString(),
        },
    ])
}

function updateMedication(medicationId, changes) {
    setMedicationEdits((currentEdits) => ({
        ...currentEdits,
        [medicationId]: {
            ...currentEdits[medicationId],
            ...changes,
        },
    }))
}

    return (
        <DemoContext.Provider
            value={{
                demoMode,
                setDemoMode,
                demoUser,
                demoMedications,
                doseLogs,
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