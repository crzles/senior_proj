import {apiFetch} from "./client"

// GET /api/pharmacies/nearby?lat=&lng=  (closest first, up to 10, from Google Places)
// Each result: {id, name, address, distance, phone, opens, closes, is24Hours, latitude, longitude}
export const listNearbyPharmacies = (lat, lng) =>
    apiFetch(`/pharmacies/nearby?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}`)
