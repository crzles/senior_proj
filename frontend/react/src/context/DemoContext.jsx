import {createContext, useContext, useState} from "react"

const DemoContext = createContext()

export function DemoProvider({children}) {
    const [demoMode, setDemoMode] = useState(true)
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
        taken: false,
        taken_at: null,
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
        taken: false,
        taken_at: null,
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

const [medications, setMedications] = useState(demoMedicationData)

const demoMedications = demoMode ? medications : []

function toggleMedicationTakenStatus(medicationName) {
    setMedications((currentMedications) =>
        currentMedications.map((medication) =>
            medication.med_name === medicationName
                ? {
                    ...medication,
                    taken: !medication.taken,
                    taken_at: medication.taken
                        ? null
                        : new Date().toISOString(),
                }
                : medication
        )
    )
}

function addMedication(medication) {
    setMedications((currentMedications) => [
        ...currentMedications,
        {
            ...medication,
            id: Date.now(),
        },
    ])
}

    return (
        <DemoContext.Provider
            value={{
                demoMode,
                setDemoMode,
                demoUser,
                demoMedications,
                toggleMedicationTakenStatus,
                addMedication,
            }}
        >
            {children}
        </DemoContext.Provider>
    )
}

export function useDemo() {
    return useContext(DemoContext)
}