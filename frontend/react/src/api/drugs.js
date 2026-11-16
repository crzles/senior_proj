import {apiFetch} from "./client"

// GET /api/drugs/search?q=  (openFDA labels by brand or generic name, up to 10)
// Each result: {set_id, med_name, generic_name, purpose, indications, dosage, storage, ...}
export async function searchDrugs(query) {
    // The backend puts the text inside a quoted search, so quotes would break it.
    const cleaned = query.replace(/"/g, "").trim()

    try {
        return await apiFetch(`/drugs/search?q=${encodeURIComponent(cleaned)}`)
    } catch (error) {
        // The backend answers 404 when nothing matches, which is just an empty list here.
        if (error.status === 404) {
            return []
        }

        throw error
    }
}

// GET /api/drugs/{set_id}  (a label the backend has already saved)
export async function getDrugLabel(setId) {
    try {
        return await apiFetch(`/drugs/${encodeURIComponent(setId)}`)
    } catch (error) {
        if (error.status === 404) {
            return null
        }

        throw error
    }
}
