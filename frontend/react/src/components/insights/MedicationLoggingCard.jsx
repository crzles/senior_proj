import {useNavigate} from "react-router-dom"
import {useTheme} from "../../context/ThemeContext"
import InsightCard from "./InsightCard"
import {formatRangeLabel} from "./insightsRange"
import {useInsightsData} from "./useInsightsData"

// "Medication logging": how many scheduled doses were logged as taken vs. not, plus a
// bar per day. The numbers come from useInsightsData (demo data now, the database later).
// OWNER: Partner A
function MedicationLoggingCard({days}) {
    const navigate = useNavigate()
    const {currentTheme} = useTheme()
    const {doses, hasDoseHistory} = useInsightsData(days)

    return (
        <InsightCard
            title="Medication logging"
            subtitle={`Dose logs · ${formatRangeLabel(days)} · ${doses.scheduled} scheduled doses`}
            linkLabel="Review dose logs"
            onLinkClick={() => navigate("/home")}
        >
            {/* Big numbers */}
            <div className="flex gap-8 mb-3">
                <div>
                    <p className={`${currentTheme.accentText} text-3xl font-bold`}>{doses.taken}</p>
                    <p className={`${currentTheme.secondaryText} text-xs`}>Logged as taken</p>
                </div>
                <div>
                    <p className={`${currentTheme.text} text-3xl font-bold`}>{doses.unlogged}</p>
                    <p className={`${currentTheme.secondaryText} text-xs`}>Unlogged</p>
                </div>
            </div>

            {/* One bar per day: the filled part is the share of that day's doses logged as taken */}
            <div className="mb-2 grid auto-cols-fr grid-flow-col gap-1">
                {doses.perDay.map((day) => (
                    <div key={day.key} className="flex flex-col items-center gap-1">
                        <div
                            className={`${currentTheme.inset} h-3 w-full overflow-hidden rounded`}
                            title={`${day.taken} of ${day.scheduled} logged`}
                        >
                            <div
                                className={`${currentTheme.primary} h-full`}
                                style={{width: day.scheduled ? `${(day.taken / day.scheduled) * 100}%` : "0%"}}
                            />
                        </div>
                        {days <= 14 && (
                            <span className={`${currentTheme.secondaryText} text-xs`}>{day.label}</span>
                        )}
                    </div>
                ))}
            </div>

            {!hasDoseHistory && (
                <p className={`${currentTheme.secondaryText} text-xs mb-1`}>
                    Dose history for past days isn't available yet, so only today's doses are counted.
                </p>
            )}

            <p className={`${currentTheme.secondaryText} text-xs`}>
                Self-reported entries, not proof of doses taken. Unlogged does not mean missed.
            </p>
        </InsightCard>
    )
}

export default MedicationLoggingCard
