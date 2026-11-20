import {useEffect, useState} from "react"
import {useLocation} from "react-router-dom"
import {useDemo} from "../context/DemoContext"
import {useTheme} from "../context/ThemeContext"
import {Pill} from "lucide-react"

// A dose counts as due from its scheduled time until this many minutes later,
// the same window Home uses before it marks a dose as missed.
const DUE_WINDOW_MINUTES = 60
const SNOOZE_MINUTES = 10
const CHECK_INTERVAL_MS = 30 * 1000

function formatTime(time) {
    const [hour, minute] = time.split(":")
    const date = new Date()
    date.setHours(Number(hour), Number(minute))

    return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit"
    })
}

// Short two-tone chime made with the Web Audio API, so there is no audio file to ship.
// Browsers keep sound blocked until the user has clicked or tapped the page once.
function playChime() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)()
        const startTime = audioContext.currentTime

        ;[880, 1175].forEach((frequency, index) => {
            const oscillator = audioContext.createOscillator()
            const gain = audioContext.createGain()
            const noteStart = startTime + index * 0.2

            oscillator.type = "sine"
            oscillator.frequency.value = frequency

            gain.gain.setValueAtTime(0.0001, noteStart)
            gain.gain.exponentialRampToValueAtTime(0.25, noteStart + 0.02)
            gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.35)

            oscillator.connect(gain)
            gain.connect(audioContext.destination)
            oscillator.start(noteStart)
            oscillator.stop(noteStart + 0.4)
        })

        setTimeout(() => audioContext.close(), 1000)
    } catch {
        // No audio support or sound is blocked; the banner still shows.
    }
}

// In-app version of the "Time for your medication" reminder. It only shows while the app
// is open; a reminder when the app is closed needs push notifications from the backend.
function DoseReminder() {
    const [now, setNow] = useState(() => Date.now())
    // doseKey -> time (ms) the reminder may show again after "Remind in 10 min"
    const [snoozedUntil, setSnoozedUntil] = useState({})

    const location = useLocation()
    const {demoMedications, doseLogs, getDoseKey, toggleDoseTaken} = useDemo()
    const {currentTheme} = useTheme()

    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), CHECK_INTERVAL_MS)

        return () => clearInterval(timer)
    }, [])

    // No reminders on the sign-in page.
    const dueDose = location.pathname === "/" ? undefined : demoMedications
        .flatMap((medication) =>
            (medication.reminder_times || []).map((time) => {
                const [hour, minute] = time.split(":")

                const scheduledTime = new Date(now)
                scheduledTime.setHours(Number(hour), Number(minute), 0, 0)

                return {
                    key: getDoseKey(medication.id, time),
                    medication,
                    time,
                    scheduledTime: scheduledTime.getTime(),
                }
            })
        )
        .filter((dose) => {
            const addedAt = dose.medication.created_at
                ? new Date(dose.medication.created_at).getTime()
                : null

            return (
                !doseLogs[dose.key] &&
                dose.scheduledTime <= now &&
                now < dose.scheduledTime + DUE_WINDOW_MINUTES * 60 * 1000 &&
                !(addedAt && dose.scheduledTime < addedAt) &&
                !(snoozedUntil[dose.key] > now)
            )
        })
        .sort((a, b) => a.scheduledTime - b.scheduledTime)[0]

    // Plays when a reminder appears, and again if it comes back after "Remind in 10 min".
    const dueKey = dueDose?.key

    useEffect(() => {
        if (dueKey) {
            playChime()
        }
    }, [dueKey])

    if (!dueDose) {
        return null
    }

    const minutesAgo = Math.floor((now - dueDose.scheduledTime) / 60000)

    return (
        <div className="fixed left-0 right-0 top-3 z-50 flex justify-center px-4">
            <div
                role="alert"
                className={`${currentTheme.card} ${currentTheme.border} w-full max-w-sm rounded-2xl border p-4 shadow-xl`}
            >
                <div className="mb-2 flex items-center justify-between text-xs">
                    <span className={`font-semibold ${currentTheme.accentText}`}>PillBug</span>
                    <span className={currentTheme.secondaryText}>
                        {minutesAgo < 1 ? "now" : `${minutesAgo} min ago`}
                    </span>
                </div>

                <h2 className={`${currentTheme.text} mb-3 text-lg font-bold`}>
                    Time for your medication
                </h2>

                <div className="mb-4 flex items-center gap-3">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${currentTheme.accentSoft}`}>
                        <Pill className="h-6 w-6" aria-hidden="true" />
                    </div>

                    <div className="min-w-0">
                        <p className={`${currentTheme.text} truncate font-semibold`}>
                            {dueDose.medication.med_name}
                        </p>
                        <p className={`${currentTheme.secondaryText} text-sm`}>
                            {dueDose.medication.dosage} · Due {formatTime(dueDose.time)}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        onClick={() =>
                            setSnoozedUntil((current) => ({
                                ...current,
                                [dueDose.key]: Date.now() + SNOOZE_MINUTES * 60 * 1000,
                            }))
                        }
                        className={`rounded-xl ${currentTheme.accentSoft} py-3 text-sm font-semibold hover:opacity-80`}
                    >
                        Remind in {SNOOZE_MINUTES} min
                    </button>

                    <button
                        type="button"
                        onClick={() => toggleDoseTaken(dueDose.key)}
                        className={`${currentTheme.primary} rounded-xl py-3 text-sm font-semibold text-white hover:opacity-90`}
                    >
                        Taken
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DoseReminder
