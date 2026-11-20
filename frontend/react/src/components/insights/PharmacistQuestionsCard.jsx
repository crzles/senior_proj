import {ArrowRight, MessageCircle} from "lucide-react"
import {useTheme} from "../../context/ThemeContext"
import InsightCard from "./InsightCard"

// "Make your next conversation easier": a call to action that builds a list of questions
// to bring to a pharmacist or doctor.
// OWNER: Partner B
// TODO: on click, open a screen/modal with suggested questions based on the user's
//       medications and symptoms (could be a second call to the Rollie backend route).
function PharmacistQuestionsCard({days}) {
    const {currentTheme} = useTheme()

    function handleClick() {
        // TODO: open the pharmacist questions view for the last {days} days
        console.log("Prepare pharmacist questions", days)
    }

    return (
        <InsightCard
            title={
                <span className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    Make your next conversation easier
                </span>
            }
        >
            <p className={`${currentTheme.secondaryText} text-sm mb-3`}>
                If symptoms persist or concern you, discuss your logs with a health professional.
            </p>

            <button
                type="button"
                onClick={handleClick}
                className={`w-full py-3 ${currentTheme.primary} text-white font-semibold rounded-xl hover:opacity-90`}
            >
                Prepare pharmacist questions
                <ArrowRight className="ml-1 inline h-4 w-4" aria-hidden="true" />
            </button>
        </InsightCard>
    )
}

export default PharmacistQuestionsCard
