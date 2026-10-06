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
        med_name: "Ibuprofen",
        med_type: "Medication",
        dosage: "200 mg",
        pills_per_dose: 1,
        recurrence: "Once daily",
        reminder_times: ["08:00"],
        taken: false,
        start_date: "2026-10-01",
        end_date: null,
        is_refillable: false,
        pill_qty: null,
        refill_reminder: null,
        requirements: "",
        avoid_notes: "",
        storage_notes: "",
    },
]

const demoMedications = demoMode ? demoMedicationData : []

    return (
        <DemoContext.Provider
            value={{
                demoMode,
                setDemoMode,
                demoUser,
                demoMedications,
            }}
        >
            {children}
        </DemoContext.Provider>
    )
}

export function useDemo() {
    return useContext(DemoContext)
}