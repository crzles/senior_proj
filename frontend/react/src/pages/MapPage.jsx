import {useCallback, useEffect, useState} from "react"
import ProfileMenu from "../components/ProfileMenu"
import {useDemo} from "../context/DemoContext"
import {useTheme} from "../context/ThemeContext"
import {Plus, Search} from "lucide-react"
import BottomNav from "../components/BottomNav"
import GoogleMap from "../components/GoogleMap"

const filters = ["All", "Open now", "24 hours"]

const MAP_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

function toMinutes(time) {
    const [hour, minute] = time.split(":")
    return Number(hour) * 60 + Number(minute)
}

function formatTime(time) {
    const [hour, minute] = time.split(":")
    const date = new Date()
    date.setHours(Number(hour), Number(minute))

    return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit"
    })
}

// Works out open status and the hours label from the current time.
// opens / closes are today's hours as "HH:MM"; both are empty when the pharmacy is closed
// today or its hours are unknown.
function getHoursInfo(pharmacy, now) {
    if (pharmacy.is24Hours) {
        return {isOpen: true, label: "Open 24 hours"}
    }

    if (!pharmacy.opens || !pharmacy.closes) {
        return {isOpen: false, label: "Closed today or hours unavailable"}
    }

    const currentMinutes = now.getHours() * 60 + now.getMinutes()
    const opens = toMinutes(pharmacy.opens)
    const closes = toMinutes(pharmacy.closes)

    // A pharmacy that closes after midnight has a closing time earlier than its opening time.
    const isOpen = opens <= closes
        ? currentMinutes >= opens && currentMinutes < closes
        : currentMinutes >= opens || currentMinutes < closes

    if (isOpen) {
        return {isOpen, label: `Open until ${formatTime(pharmacy.closes)}`}
    }

    return {
        isOpen,
        label: currentMinutes < opens ? `Closed · Opens ${formatTime(pharmacy.opens)}` : "Closed for today",
    }
}

// The placeholder map needs x / y percentages. Demo pharmacies have them; real ones only have
// coordinates, so spread those across the area.
function addPinPositions(pharmacies) {
    const located = pharmacies.filter((pharmacy) => pharmacy.latitude != null)

    if (located.length === 0) {
        return pharmacies
    }

    const lats = located.map((pharmacy) => pharmacy.latitude)
    const lngs = located.map((pharmacy) => pharmacy.longitude)
    const [minLat, maxLat] = [Math.min(...lats), Math.max(...lats)]
    const [minLng, maxLng] = [Math.min(...lngs), Math.max(...lngs)]

    const spread = (value, min, max) => (max === min ? 50 : 15 + ((value - min) / (max - min)) * 70)

    return pharmacies.map((pharmacy) =>
        pharmacy.x != null || pharmacy.latitude == null
            ? pharmacy
            : {
                ...pharmacy,
                x: spread(pharmacy.longitude, minLng, maxLng),
                y: 100 - spread(pharmacy.latitude, minLat, maxLat),
            }
    )
}

function MapPage() {
    const [search, setSearch] = useState("")
    const [activeFilter, setActiveFilter] = useState("All")
    const [selectedId, setSelectedId] = useState(null)
    const [mapFailed, setMapFailed] = useState(false)

    const {
        demoMode, pharmacies, pharmacyStatus, pharmacyMessage, pharmacyOrigin,
        loadPharmacies, retryPharmacies,
    } = useDemo()
    const {theme, currentTheme} = useTheme()

    // Real pharmacies come from the backend, near the user's location.
    useEffect(() => {
        if (!demoMode) {
            loadPharmacies()
        }
    }, [demoMode, loadPharmacies])

    const handleMapError = useCallback(() => setMapFailed(true), [])

    const now = new Date()

    const visiblePharmacies = addPinPositions(pharmacies)
        .map((pharmacy) => ({...pharmacy, ...getHoursInfo(pharmacy, now)}))
        .filter((pharmacy) => {
            const query = search.trim().toLowerCase()
            const matchesSearch =
                query === "" ||
                pharmacy.name.toLowerCase().includes(query) ||
                (pharmacy.address || "").toLowerCase().includes(query)

            const matchesFilter =
                activeFilter === "All" ||
                (activeFilter === "Open now" && pharmacy.isOpen) ||
                (activeFilter === "24 hours" && pharmacy.is24Hours)

            return matchesSearch && matchesFilter
        })

    // Fall back to the first visible result if the selected pharmacy was filtered out.
    const selectedPharmacy =
        visiblePharmacies.find((pharmacy) => pharmacy.id === selectedId) ||
        visiblePharmacies[0]

    // The real map needs a key. Without one (or if it fails to load) the placeholder is shown.
    const useRealMap = Boolean(MAP_KEY) && !mapFailed

    const isLoading = !demoMode && pharmacyStatus === "idle"
    const hasProblem = !demoMode && (pharmacyStatus === "denied" || pharmacyStatus === "error")

    let overlayMessage = ""

    if (isLoading) {
        overlayMessage = "Finding pharmacies near you..."
    } else if (hasProblem) {
        overlayMessage = pharmacyMessage
    } else if (visiblePharmacies.length === 0) {
        overlayMessage = pharmacies.length === 0
            ? "No pharmacies found nearby."
            : "No pharmacies match your search."
    }

    function openDirections(pharmacy) {
        const destination = pharmacy.address
            ? pharmacy.address
            : `${pharmacy.latitude},${pharmacy.longitude}`

        window.open(
            `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`,
            "_blank",
            "noopener,noreferrer"
        )
    }

    return (
        <div className={`min-h-screen ${currentTheme.background} p-4 pb-24 flex flex-col`}>

            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <p className={`${currentTheme.secondaryText} text-sm`}>
                        Find your nearest
                    </p>
                    <h1 className={`${currentTheme.text} text-xl font-bold`}>
                        Pharmacies nearby
                    </h1>
                </div>

                <ProfileMenu />
            </div>

            {/* Search */}
            <div className={`${currentTheme.card} ${currentTheme.border} border rounded-xl px-3 py-2 mb-3 flex items-center gap-2 shadow-sm`}>
                <Search className={`h-4 w-4 ${currentTheme.secondaryText}`} aria-hidden="true" />
                <input
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search pharmacy or address"
                    aria-label="Search pharmacy or address"
                    className={`flex-1 bg-transparent text-sm outline-none ${currentTheme.text}`}
                />
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-3 overflow-x-auto">
                {filters.map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`px-4 py-2 whitespace-nowrap ${
                            activeFilter === filter
                                ? `${currentTheme.primary} text-white`
                                : `${currentTheme.card} ${currentTheme.secondaryText}`
                        } rounded-lg text-sm font-medium`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {/* Map Area */}
            {/* The map stays light in dark mode too, like Google's own map. */}
            <div className="relative flex-1 min-h-64 rounded-2xl overflow-hidden mb-3 shadow-sm bg-blue-50">
                {useRealMap ? (
                    <GoogleMap
                        pharmacies={visiblePharmacies}
                        selectedId={selectedPharmacy?.id}
                        origin={pharmacyOrigin}
                        onSelect={setSelectedId}
                        onError={handleMapError}
                    />
                ) : (
                    <>
                        <div
                            className="absolute inset-0 opacity-40"
                            style={{
                                backgroundImage:
                                    "linear-gradient(to right, rgba(100,116,139,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(100,116,139,0.35) 1px, transparent 1px)",
                                backgroundSize: "40px 40px",
                            }}
                        />

                        <p className="absolute left-3 top-3 text-xs text-gray-600">
                            Map preview
                        </p>

                        {visiblePharmacies.map((pharmacy) => {
                            const isSelected = pharmacy.id === selectedPharmacy?.id

                            return (
                                <button
                                    key={pharmacy.id}
                                    onClick={() => setSelectedId(pharmacy.id)}
                                    aria-label={`Select ${pharmacy.name}`}
                                    style={{left: `${pharmacy.x}%`, top: `${pharmacy.y}%`}}
                                    className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center text-white shadow-md ${
                                        isSelected
                                            ? "w-10 h-10 bg-red-500 ring-4 ring-white/70 z-10"
                                            : `w-8 h-8 ${currentTheme.primary}`
                                    }`}
                                >
                                    <Plus className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
                                </button>
                            )
                        })}
                    </>
                )}

                {overlayMessage && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 p-4">
                        <div className={`${currentTheme.card} max-w-xs rounded-xl p-4 text-center shadow-md`}>
                            <p className={`${currentTheme.text} text-sm`}>
                                {overlayMessage}
                            </p>

                            {hasProblem && (
                                <button
                                    onClick={retryPharmacies}
                                    className={`mt-3 rounded-lg px-4 py-2 text-sm font-semibold text-white ${currentTheme.primary}`}
                                >
                                    Try again
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Selected Pharmacy Card */}
            {selectedPharmacy && (
                <div className={`${currentTheme.card} rounded-2xl p-4 shadow-sm`}>
                    <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="min-w-0">
                            <h2 className={`${currentTheme.text} font-bold`}>
                                {selectedPharmacy.name}
                            </h2>
                            <p className={`${currentTheme.secondaryText} text-sm`}>
                                {selectedPharmacy.address || "Address unavailable"}
                            </p>
                            <p className={`text-xs mt-1 ${
                                selectedPharmacy.isOpen
                                    ? theme === "dark" ? "text-green-300" : "text-green-700"
                                    : theme === "dark" ? "text-red-300" : "text-red-500"
                            }`}>
                                {selectedPharmacy.label}
                            </p>
                        </div>

                        <span className={`${currentTheme.secondaryText} text-sm whitespace-nowrap`}>
                            {selectedPharmacy.distance}
                        </span>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => openDirections(selectedPharmacy)}
                            className={`flex-1 py-3 ${currentTheme.primary} text-white font-semibold rounded-xl hover:opacity-90`}
                        >
                            Directions
                        </button>

                        {selectedPharmacy.phone && (
                            <a
                                href={`tel:${selectedPharmacy.phone.replace(/[^\d+]/g, "")}`}
                                className={`flex-1 py-3 text-center ${currentTheme.border} ${currentTheme.text} border font-semibold rounded-xl`}
                            >
                                Call
                            </a>
                        )}
                    </div>
                </div>
            )}

            {/* Bottom Navigation */}
            <BottomNav />

        </div>
    )
}

export default MapPage
