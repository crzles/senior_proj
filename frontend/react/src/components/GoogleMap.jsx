import {useEffect, useRef, useState} from "react"

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

let googleMapsPromise = null

// Loads the Google Maps script once, no matter how many times the map is shown.
function loadGoogleMaps() {
    if (window.google?.maps) {
        return Promise.resolve()
    }

    if (!googleMapsPromise) {
        googleMapsPromise = new Promise((resolve, reject) => {
            const script = document.createElement("script")

            script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(API_KEY)}&v=weekly`
            script.async = true
            script.onload = resolve
            script.onerror = () => {
                googleMapsPromise = null
                reject(new Error("Couldn't load Google Maps."))
            }

            document.head.appendChild(script)
        })
    }

    return googleMapsPromise
}

function pinIcon({scale, color}) {
    return {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale,
        fillColor: color,
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 3,
    }
}

// The real map for the Map page. It shows a pin for each pharmacy (the selected one in red)
// and a dot for where the user is. `onError` is called if the map can't load, so the page
// can fall back to its placeholder.
function GoogleMap({pharmacies, selectedId, origin, onSelect, onError}) {
    const containerRef = useRef(null)
    const mapRef = useRef(null)
    const markersRef = useRef([])
    const fittedRef = useRef("")
    const [ready, setReady] = useState(false)

    // Create the map once.
    useEffect(() => {
        let cancelled = false

        // Google calls this when the key is wrong or not allowed for this site.
        window.gm_authFailure = onError

        loadGoogleMaps()
            .then(() => {
                if (cancelled || !containerRef.current) {
                    return
                }

                mapRef.current = new window.google.maps.Map(containerRef.current, {
                    center: {lat: 39.8, lng: -98.6},
                    zoom: 4,
                    disableDefaultUI: true,
                    zoomControl: true,
                    clickableIcons: false,
                })

                setReady(true)
            })
            .catch(onError)

        return () => {
            cancelled = true
            markersRef.current.forEach((marker) => marker.setMap(null))
            markersRef.current = []
            mapRef.current = null
        }
    }, [onError])

    // Draw the pins whenever the pharmacies, the selection, or the user's position change.
    useEffect(() => {
        if (!ready) {
            return
        }

        const map = mapRef.current
        const {maps} = window.google

        markersRef.current.forEach((marker) => marker.setMap(null))
        markersRef.current = []

        const bounds = new maps.LatLngBounds()

        pharmacies.forEach((pharmacy) => {
            if (pharmacy.latitude == null || pharmacy.longitude == null) {
                return
            }

            const position = {lat: pharmacy.latitude, lng: pharmacy.longitude}
            const isSelected = pharmacy.id === selectedId

            const marker = new maps.Marker({
                map,
                position,
                title: pharmacy.name,
                icon: pinIcon({scale: isSelected ? 11 : 8, color: isSelected ? "#ef4444" : "#2563eb"}),
                zIndex: isSelected ? 2 : 1,
            })

            marker.addListener("click", () => onSelect(pharmacy.id))

            markersRef.current.push(marker)
            bounds.extend(position)
        })

        if (origin) {
            markersRef.current.push(new maps.Marker({
                map,
                position: origin,
                title: "You are here",
                icon: pinIcon({scale: 6, color: "#10b981"}),
                zIndex: 0,
            }))

            bounds.extend(origin)
        }

        // Zoom to fit everything, but only when the set of results changes (not on every click).
        const fitKey = pharmacies.map((pharmacy) => pharmacy.id).join(",")

        if (fitKey !== fittedRef.current && !bounds.isEmpty()) {
            fittedRef.current = fitKey
            map.fitBounds(bounds, 48)

            if (pharmacies.length <= 1) {
                map.setZoom(15)
            }
        }
    }, [ready, pharmacies, selectedId, origin, onSelect])

    return (
        <div className="absolute inset-0">
            <div ref={containerRef} className="h-full w-full" />

            {!ready && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-sm text-gray-500">Loading map...</p>
                </div>
            )}
        </div>
    )
}

export default GoogleMap
