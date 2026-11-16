import {apiFetch} from "./client"

// /api/symptoms  (the shared list of symptom names)
export const listSymptoms = () => apiFetch("/symptoms/")

export const createSymptom = (name) =>
    apiFetch("/symptoms/", {method: "POST", json: {name}})

// /api/symptoms/logs  (the user's own entries)
export const listSymptomLogs = () => apiFetch("/symptoms/logs")

export const createSymptomLog = (log) =>
    apiFetch("/symptoms/logs", {method: "POST", json: log})

export const deleteSymptomLog = (logId) =>
    apiFetch(`/symptoms/logs/${logId}`, {method: "DELETE"})
