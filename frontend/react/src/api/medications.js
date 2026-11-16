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

// /api/doses  (only doses that were marked as taken are stored)
export const listTakenDoses = (doseDate) => apiFetch(`/doses/?dose_date=${doseDate}`)

// Checks or unchecks one dose and returns {taken, taken_at}.
export const toggleDose = ({med_id, dose_date, dose_time}) =>
    apiFetch("/doses/toggle", {method: "POST", json: {med_id, dose_date, dose_time}})

export const deleteMedication = (medicationId) =>
    apiFetch(`/medications/${medicationId}`, {method: "DELETE"})

// /api/medications/{id}/refills  (newest first). Logging a refill also adds its quantity
// to the medication's pill count on the backend.
export const listRefills = (medicationId) =>
    apiFetch(`/medications/${medicationId}/refills/`)

// {qty_added, pharmacy_name?, pharmacy_address?, dosage?}
export const createRefill = (medicationId, refill) =>
    apiFetch(`/medications/${medicationId}/refills/`, {method: "POST", json: refill})
