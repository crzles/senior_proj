import {apiFetch} from "./client"

// /api/symptoms  (the user's own symptom log entries)
export const listSymptomLogs = () => apiFetch("/symptoms/")

// {symptom, date, time, severity, duration, notes}
export const createSymptomLog = (log) =>
    apiFetch("/symptoms/", {method: "POST", json: log})

// Only symptom, severity, duration and notes can be edited.
export const updateSymptomLog = (logId, changes) =>
    apiFetch(`/symptoms/${logId}`, {method: "PATCH", json: changes})

export const deleteSymptomLog = (logId) =>
    apiFetch(`/symptoms/${logId}`, {method: "DELETE"})
