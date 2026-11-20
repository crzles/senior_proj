import {useNavigate} from "react-router-dom"
import {useDemo} from "../../context/DemoContext"
import {useTheme} from "../../context/ThemeContext"
import InsightCard from "./InsightCard"

// "Symptom log trends": the most frequent symptoms with their severity, plus entries per day.
// OWNER: Partner B
// `symptomLogs` from useDemo() already has every entry ({symptom, date, severity, ...}), so
// this card can be built entirely on the frontend.
// TODO: filter symptomLogs to the last {days} days, group by symptom, and sort by count.
// TODO: headline ("Headache was the most frequently logged symptom, with 3 of 5 entries.").
// TODO: a bar and a severity line ("Severity: 2 mild · 1 moderate") per symptom.
// TODO: entries per day under the bars (counts only, not severity).
// eslint-disable-next-line no-unused-vars -- `days` is unused until the real data is wired in
function SymptomTrendsCard({days}) {
    const navigate = useNavigate()
    const {symptomLogs} = useDemo() // eslint-disable-line no-unused-vars -- used once this is built
    const {currentTheme} = useTheme()

    return (
        <InsightCard
            title="Symptom log trends"
            subtitle="Symptom logs"
            linkLabel="Review symptom logs"
            onLinkClick={() => navigate("/profile")}
        >
            <p className={`${currentTheme.secondaryText} text-sm`}>
                No symptom entries to show yet.
            </p>
        </InsightCard>
    )
}

export default SymptomTrendsCard
