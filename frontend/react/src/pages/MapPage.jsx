import {useState} from "react"
import ProfileMenu from "../components/ProfileMenu"
import {useDemo} from "../context/DemoContext"
import {useTheme} from "../context/ThemeContext"
import {Plus, Search} from "lucide-react"
import BottomNav from "../components/BottomNav"

const filters = ["All", "Open now", "24 hours"]

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
function getHoursInfo(pharmacy, now) {
    if (pharmacy.is24Hours) {
        return {isOpen: true, label: "Open 24 hours"}
    }

    const currentMinutes = now.getHours() * 60 + now.getMinutes()
    const isOpen =
        currentMinutes >= toMinutes(pharmacy.opens) &&
        currentMinutes < toMinutes(pharmacy.closes)

    return isOpen
        ? {isOpen, label: `Open until ${formatTime(pharmacy.closes)}`}
        : {isOpen, label: `Closed · Opens ${formatTime(pharmacy.opens)}`}
}

function MapPage() {
    const [search, setSearch] = useState("")
    const [activeFilter, setActiveFilter] = useState("All")
    const [selectedId, setSelectedId] = useState(null)

    // TODO: Replace demoPharmacies with pharmacies from the backend once the endpoint exists.
    const {demoPharmacies} = useDemo()
    const {theme, currentTheme} = useTheme()

    const now = new Date()

    const visiblePharmacies = demoPharmacies
        .map((pharmacy) => ({...pharmacy, ...getHoursInfo(pharmacy, now)}))
        .filter((pharmacy) => {
        const query = search.trim().toLowerCase()
        const matchesSearch =
            query === "" ||
            pharmacy.name.toLowerCase().includes(query) ||
            pharmacy.address.toLowerCase().includes(query)

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

    function openDirections(pharmacy) {
        const destination = encodeURIComponent(pharmacy.address)
        window.open(
            `https://www.google.com/maps/dir/?api=1&destination=${destination}`,
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
            {/* TODO: Swap this placeholder for the real map once the map API is wired up.
                Pins use the same `visiblePharmacies` / `selectedPharmacy` state. */}
            <div
                className={`relative flex-1 min-h-64 rounded-2xl overflow-hidden mb-3 shadow-sm ${
                    theme === "dark" ? "bg-slate-700" : "bg-blue-50"
                }`}
            >
                <div
                    className="absolute inset-0 opacity-40"
                    style={{
                        backgroundImage:
                            "linear-gradient(to right, rgba(100,116,139,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(100,116,139,0.35) 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                    }}
                />

                <p className={`${currentTheme.secondaryText} absolute left-3 top-3 text-xs`}>
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

                {visiblePharmacies.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <p className={`${currentTheme.secondaryText} text-sm`}>
                            No pharmacies match your search
                        </p>
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
                                {selectedPharmacy.address}
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

                        <a
                            href={`tel:${selectedPharmacy.phone}`}
                            className={`flex-1 py-3 text-center ${currentTheme.border} ${currentTheme.text} border font-semibold rounded-xl`}
                        >
                            Call
                        </a>
                    </div>
                </div>
            )}

            {/* Bottom Navigation */}
            <BottomNav />

        </div>
    )
}

export default MapPage
