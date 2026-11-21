
import {apiFetch} from "./client"

// /api/allergies
export const listAllergies = () => apiFetch("/allergies/")

export const createAllergy = (allergy) =>
    apiFetch("/allergies/", {method: "POST", json: allergy})

export const updateAllergy = (allergyId, changes) =>
    apiFetch(`/allergies/${allergyId}`, {method: "PUT", json: changes})

export const deleteAllergy = (allergyId) =>
    apiFetch(`/allergies/${allergyId}`, {method: "DELETE"})
