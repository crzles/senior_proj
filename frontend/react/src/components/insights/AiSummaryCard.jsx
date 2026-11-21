import {useNavigate} from "react-router-dom"
import {Sparkles} from "lucide-react"
import {useTheme} from "../../context/ThemeContext"
import InsightCard from "./InsightCard"

// "Your AI summary": a short paragraph from Rollie about the selected range.
// OWNER: Partner A
// TODO: call getInsights() from ../../api/insights (POST /api/insights/, backed by Gemini) and
//       show its result here: getInsights(days). The route already reads the user's data from the
//       database for that range. (Demo mode has no backend user, so show sample text there.)
// TODO: add a loading state and show any error message from the request.
// eslint-disable-next-line no-unused-vars -- `days` is unused until the real data is wired in
function AiSummaryCard({days}) {
    const navigate = useNavigate()
    const {currentTheme} = useTheme()

    return (
        <InsightCard
            title={
                <span className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                    Your AI summary
                </span>
            }
            linkLabel="Review this week's logs"
            onLinkClick={() => navigate("/profile")}
        >
            <p className={`${currentTheme.secondaryText} text-sm`}>
                Your summary will show up here.
            </p>
        </InsightCard>
    )
}

export default AiSummaryCard
