import {useMemo} from "react"
import {useDemo} from "../../context/DemoContext"
import {getRangeDates} from "./insightsRange"

// The one place the Insights cards get their numbers from.
//
// It reads medications, dose logs and symptom logs from useDemo(). With demo mode on that is
// the sample week in DemoContext; with it off it is whatever was loaded from the backend.
//
// TODO (database): the backend only loads TODAY's doses into `doseLogs` (see loadTakenDoses in
// useBackendData.js), so past days count as "unlogged" until there is a way to fetch dose
// history for a range, for example GET /api/doses/history?start=...&end=... Once that exists,
// load it into `doseLogs` (same "medId|YYYY-MM-DD|HH:MM" keys) and set hasDoseHistory to true.
// Medications and symptom logs already come from the database, so they work now.

function toDateKey(date) {
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")

    return `${date.getFullYear()}-${month}-${day}`
}

const severityOrder = ["Mild", "Moderate", "Severe"]

export function useInsightsData(days) {
    const {demoMode, demoMedications, doseLogs, symptomLogs} = useDemo()

    return useMemo(() => {
        const {start} = getRangeDates(days)
        const dayDates = Array.from({length: days}, (_, index) => {
            const date = new Date(start)

            date.setDate(start.getDate() + index)

            return date
        })
        const startKey = toDateKey(dayDates[0])
        const endKey = toDateKey(dayDates[dayDates.length - 1])

        // Doses: scheduled comes from each medication's reminder times, taken from the dose logs.
        const dosesPerDay = dayDates.map((date) => {
            const key = toDateKey(date)
            let scheduled = 0
            let taken = 0

            demoMedications.forEach((medication) => {
                if ((medication.start_date && key < medication.start_date)
                    || (medication.end_date && key > medication.end_date)) {
                    return
                }

                const times = medication.reminder_times || []

                scheduled += times.length
                times.forEach((time) => {
                    if (doseLogs[`${medication.id}|${key}|${time}`]) {
                        taken += 1
                    }
                })
            })

            return {key, label: String(date.getDate()), scheduled, taken}
        })

        const scheduled = dosesPerDay.reduce((sum, day) => sum + day.scheduled, 0)
        const taken = dosesPerDay.reduce((sum, day) => sum + day.taken, 0)

        // Symptoms: only entries inside the range, grouped by symptom name.
        const entries = symptomLogs.filter((log) => log.date >= startKey && log.date <= endKey)
        const groups = new Map()

        entries.forEach((log) => {
            const group = groups.get(log.symptom) || {name: log.symptom, count: 0, severities: {}}

            group.count += 1
            group.severities[log.severity] = (group.severities[log.severity] || 0) + 1
            groups.set(log.symptom, group)
        })

        const list = [...groups.values()]
            .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
            .map((group) => ({
                ...group,
                severityText: severityOrder
                    .filter((severity) => group.severities[severity])
                    .map((severity) => `${group.severities[severity]} ${severity.toLowerCase()}`)
                    .join(" · "),
            }))

        const symptomsPerDay = dayDates.map((date) => {
            const key = toDateKey(date)

            return {
                key,
                label: String(date.getDate()),
                count: entries.filter((log) => log.date === key).length,
            }
        })

        return {
            demoMode,
            hasDoseHistory: demoMode,
            doses: {taken, scheduled, unlogged: scheduled - taken, perDay: dosesPerDay},
            symptoms: {
                total: entries.length,
                list,
                perDay: symptomsPerDay,
                headline: list.length
                    ? `${list[0].name} was the most frequently logged symptom, with ${list[0].count} of ${entries.length} entries.`
                    : "",
            },
        }
    }, [days, demoMode, demoMedications, doseLogs, symptomLogs])
}
