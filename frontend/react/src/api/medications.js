import {apiFetch} from "./client"

// /api/medications
export const listMedications = () => apiFetch("/medications/")

export const createMedication = (medication) =>
    apiFetch("/medications/", {method: "POST", json: medication})

export const updateMedication = (medicationId, changes) =>
    apiFetch(`/medications/${medicationId}`, {method: "PATCH", json: changes})

// /api/medications/{id}/reminders
export const listReminders = (medicationId) =>
    apiFetch(`/medications/${medicationId}/reminders/`)

export const createReminder = (medicationId, doseTime) =>
    apiFetch(`/medications/${medicationId}/reminders/`, {
        method: "POST",
        json: {dose_time: doseTime},
    })

export const deleteReminder = (medicationId, reminderId) =>
    apiFetch(`/medications/${medicationId}/reminders/${reminderId}`, {method: "DELETE"})

// /api/doses
export const listTodayDoses = () => apiFetch("/doses/today")

export const markDoseTaken = (doseId) =>
    apiFetch(`/doses/${doseId}/taken`, {method: "POST"})
