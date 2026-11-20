import {useNavigate} from "react-router-dom"
import {useTheme} from "../../context/ThemeContext"
import InsightCard from "./InsightCard"

// "Medication logging": how many scheduled doses were logged as taken vs. not, plus a
// bar per day.
// OWNER: Partner A
// TODO: work out the real numbers for the last {days} days. The backend has
//       GET /api/doses?dose_date=YYYY-MM-DD (one day at a time); the scheduled count comes from
//       each medication's reminder_times. Consider a range endpoint if that's too many calls.
// TODO: draw the day-by-day bars (accent = logged, inset = unlogged) from real data.
// eslint-disable-next-line no-unused-vars -- `days` is unused until the real data is wired in
function MedicationLoggingCard({days}) {
    const navigate = useNavigate()
    const {currentTheme} = useTheme()

    return (
        <InsightCard
            title="Medication logging"
            subtitle="Dose logs"
            linkLabel="Review dose logs"
            onLinkClick={() => navigate("/home")}
        >
            {/* Big numbers (TODO: real counts) */}
            <div className="flex gap-8 mb-3">
                <div>
                    <p className={`${currentTheme.accentText} text-3xl font-bold`}>0</p>
                    <p className={`${currentTheme.secondaryText} text-xs`}>Logged as taken</p>
                </div>
                <div>
                    <p className={`${currentTheme.text} text-3xl font-bold`}>0</p>
                    <p className={`${currentTheme.secondaryText} text-xs`}>Unlogged</p>
                </div>
            </div>

            {/* TODO: per-day bars go here */}

            <p className={`${currentTheme.secondaryText} text-xs`}>
                Self-reported entries, not proof of doses taken. Unlogged does not mean missed.
            </p>
        </InsightCard>
    )
}

export default MedicationLoggingCard
