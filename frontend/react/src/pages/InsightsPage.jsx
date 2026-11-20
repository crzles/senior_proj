import {useState} from "react"
import {Info} from "lucide-react"
import BottomNav from "../components/BottomNav"
import ProfileMenu from "../components/ProfileMenu"
import {useTheme} from "../context/ThemeContext"
import {RANGES, formatRangeLabel} from "../components/insights/insightsRange"
import AiSummaryCard from "../components/insights/AiSummaryCard"
import MedicationLoggingCard from "../components/insights/MedicationLoggingCard"
import SymptomTrendsCard from "../components/insights/SymptomTrendsCard"
import PharmacistQuestionsCard from "../components/insights/PharmacistQuestionsCard"

// Rollie's insights page. This file only holds the header and the shared time range;
// each card lives in components/insights/ so two people can build them side by side.
//   Partner A: AiSummaryCard, MedicationLoggingCard
//   Partner B: SymptomTrendsCard, PharmacistQuestionsCard
// Every card gets `days` (7, 14 or 30) and should show data for that many days ending today.
function InsightsPage() {
    const [days, setDays] = useState(RANGES[0].days)

    const {currentTheme} = useTheme()

    return (
        <div className={`min-h-screen ${currentTheme.background} p-4 pb-24 flex flex-col`}>

            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h1 className={`${currentTheme.text} text-xl font-bold`}>
                        Rollie's Health Insights
                    </h1>
                    <p className={`${currentTheme.secondaryText} text-sm`}>
                        Patterns from your logs.
                    </p>
                </div>

                <ProfileMenu />
            </div>

            {/* Time range */}
            <div className="mb-4 flex items-center justify-between">
                <select
                    aria-label="Time range"
                    value={days}
                    onChange={(event) => setDays(Number(event.target.value))}
                    className={`rounded-lg border ${currentTheme.border} ${currentTheme.card} px-3 py-1.5 text-sm ${currentTheme.text}`}
                >
                    {RANGES.map((range) => (
                        <option key={range.days} value={range.days}>{range.label}</option>
                    ))}
                </select>
                <span className={`${currentTheme.secondaryText} text-sm`}>{formatRangeLabel(days)}</span>
            </div>

            {/* Cards */}
            <AiSummaryCard days={days} />
            <MedicationLoggingCard days={days} />
            <SymptomTrendsCard days={days} />
            <PharmacistQuestionsCard days={days} />

            {/* Disclaimer */}
            <p className={`${currentTheme.secondaryText} flex gap-2 text-xs`}>
                <Info className="h-4 w-4 shrink-0" aria-hidden="true" />
                Based on logged entries only. AI can make mistakes. These insights are not medical advice.
            </p>

            <BottomNav />
        </div>
    )
}

export default InsightsPage
