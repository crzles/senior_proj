import {useNavigate} from "react-router-dom"
import {useTheme} from "../../context/ThemeContext"
import InsightCard from "./InsightCard"
import {formatRangeLabel} from "./insightsRange"
import {useInsightsData} from "./useInsightsData"

// "Symptom log trends": the most frequent symptoms with their severity, plus entries per day.
// The numbers come from useInsightsData (demo data now, the database later).
// OWNER: Partner B
function SymptomTrendsCard({days}) {
    const navigate = useNavigate()
    const {currentTheme} = useTheme()
    const {symptoms} = useInsightsData(days)

    const mostEntries = symptoms.list[0]?.count || 1

    return (
        <InsightCard
            title="Symptom log trends"
            subtitle={`Symptom logs · ${formatRangeLabel(days)} · ${symptoms.total} ${symptoms.total === 1 ? "entry" : "entries"}`}
            linkLabel="Review symptom logs"
            onLinkClick={() => navigate("/profile")}
        >
            {symptoms.total === 0 ? (
                <p className={`${currentTheme.secondaryText} text-sm`}>
                    No symptom entries in this range.
                </p>
            ) : (
                <>
                    <p className={`${currentTheme.text} text-sm mb-3`}>{symptoms.headline}</p>

                    {symptoms.list.map((symptom) => (
                        <div key={symptom.name} className="mb-3">
                            <div className="flex justify-between text-sm">
                                <span className={`${currentTheme.text} font-semibold`}>{symptom.name}</span>
                                <span className={currentTheme.secondaryText}>
                                    {symptom.count} {symptom.count === 1 ? "entry" : "entries"}
                                </span>
                            </div>
                            <div className={`${currentTheme.inset} my-1 h-2 overflow-hidden rounded`}>
                                <div
                                    className={`${currentTheme.primary} h-full`}
                                    style={{width: `${(symptom.count / mostEntries) * 100}%`}}
                                />
                            </div>
                            <p className={`${currentTheme.secondaryText} text-xs`}>Severity: {symptom.severityText}</p>
                        </div>
                    ))}

                    <p className={`${currentTheme.secondaryText} text-xs mb-1`}>
                        Entries by day · counts, not severity
                    </p>
                    <div className="grid auto-cols-fr grid-flow-col gap-1">
                        {symptoms.perDay.map(({key, label, count}) => (
                            <div key={key} className="flex flex-col items-center gap-1">
                                <span className={`${currentTheme.text} text-xs`}>{count}</span>
                                {days <= 14 && (
                                    <span className={`${currentTheme.secondaryText} text-xs`}>{label}</span>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </InsightCard>
    )
}

export default SymptomTrendsCard
