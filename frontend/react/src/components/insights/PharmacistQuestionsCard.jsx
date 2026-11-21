import {useState} from "react"
import {ArrowRight, MessageCircle, Send, X} from "lucide-react"
import {useDemo} from "../../context/DemoContext"
import {useTheme} from "../../context/ThemeContext"
import pillbugLogo from "../../assets/pillbug-logo.png"
import InsightCard from "./InsightCard"
import {useInsightsData} from "./useInsightsData"

// "Make your next conversation easier": a call to action that opens a chat with Rollie,
// right under the button, to help build questions for a pharmacist or doctor.
// OWNER: Partner B
// TODO: send the conversation to a backend chat route (it should rebuild the user's medication
//       and symptom summary for the last {days} days, like POST /api/insights/ does) and add
//       Rollie's reply to `messages`. For now Rollie only introduces itself.
const introMessage = {
    id: "intro",
    from: "rollie",
    text: "Hi, I'm Rollie! I can help you get ready for your next conversation with a pharmacist or doctor. Ask me about your medications or symptoms, and I'll help you turn them into questions to bring along. I'm an AI, so I can't give medical advice.",
}

// Tappable starter prompts. A few are filled in from the user's own logs.
function getSuggestedPrompts(symptoms, medications) {
    const prompts = ["Generate me questions to ask my doctor"]

    if (symptoms.list[0]) {
        prompts.push(`Why might I be feeling ${symptoms.list[0].name.toLowerCase()}?`)
    }

    if (medications[0]) {
        prompts.push(`What should I ask my pharmacist about ${medications[0].med_name}?`)
    }

    if (medications.some((medication) => medication.is_refillable && medication.pill_qty != null)) {
        prompts.push("When will I need a refill?")
    }

    prompts.push("Summarize my week for my doctor")

    return prompts
}

function PharmacistQuestionsCard({days}) {
    const [open, setOpen] = useState(false)
    const [messages, setMessages] = useState([introMessage])
    const [draft, setDraft] = useState("")

    const {currentTheme} = useTheme()
    const {demoMedications} = useDemo()
    const {symptoms} = useInsightsData(days)

    const suggestedPrompts = getSuggestedPrompts(symptoms, demoMedications)

    function sendMessage(text) {
        const trimmed = text.trim()

        if (!trimmed) {
            return
        }

        setMessages((current) => [...current, {id: Date.now(), from: "user", text: trimmed}])
        setDraft("")
    }

    function handleSend(event) {
        event.preventDefault()
        sendMessage(draft)
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
                onClick={() => setOpen((current) => !current)}
                aria-expanded={open}
                className={`w-full py-3 ${currentTheme.primary} text-white font-semibold rounded-xl hover:opacity-90`}
            >
                {open ? (
                    <>
                        Close chat
                        <X className="ml-1 inline h-4 w-4" aria-hidden="true" />
                    </>
                ) : (
                    <>
                        Prepare pharmacist questions
                        <ArrowRight className="ml-1 inline h-4 w-4" aria-hidden="true" />
                    </>
                )}
            </button>

            {open && (
                <div className="mt-3">
                    <div
                        role="log"
                        aria-live="polite"
                        className={`${currentTheme.inset} flex max-h-72 flex-col gap-2 overflow-y-auto rounded-xl p-3`}
                    >
                        {messages.map((message) =>
                            message.from === "user" ? (
                                <div
                                    key={message.id}
                                    className={`${currentTheme.primary} ml-10 self-end rounded-2xl rounded-br-sm px-3 py-2 text-sm text-white`}
                                >
                                    {message.text}
                                </div>
                            ) : (
                                <div key={message.id} className="mr-10 flex items-end gap-2 self-start">
                                    {/* Rollie's picture, like a contact photo in a text thread */}
                                    <div className={`${currentTheme.card} relative h-8 w-8 shrink-0 overflow-hidden rounded-full`}>
                                        {/* Zoomed in on the head (about 40% across, 70% down the picture),
                                            with some antenna and body in view, and flipped so Rollie
                                            faces the message. */}
                                        <img
                                            src={pillbugLogo}
                                            alt="Rollie"
                                            className="absolute max-w-none"
                                            style={{
                                                width: "170%",
                                                left: "-18%",
                                                top: "-69%",
                                                transform: "scaleX(-1)",
                                                transformOrigin: "40% 70%",
                                            }}
                                        />
                                    </div>
                                    <div className={`${currentTheme.card} ${currentTheme.text} rounded-2xl rounded-bl-sm px-3 py-2 text-sm`}>
                                        <p className={`${currentTheme.accentText} mb-0.5 text-xs font-semibold`}>Rollie</p>
                                        {message.text}
                                    </div>
                                </div>
                            )
                        )}
                    </div>

                    {/* Suggested prompts */}
                    <div className="mt-2 flex flex-wrap gap-2">
                        {suggestedPrompts.map((prompt) => (
                            <button
                                key={prompt}
                                type="button"
                                onClick={() => sendMessage(prompt)}
                                className={`${currentTheme.accentSoft} rounded-full px-3 py-1.5 text-xs font-medium hover:opacity-80`}
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSend} className="mt-2 flex gap-2">
                        <input
                            type="text"
                            value={draft}
                            onChange={(event) => setDraft(event.target.value)}
                            placeholder="Message Rollie"
                            aria-label="Message Rollie"
                            className={`min-w-0 flex-1 rounded-lg border ${currentTheme.border} bg-transparent px-3 py-2 text-sm outline-none ${currentTheme.text}`}
                        />
                        <button
                            type="submit"
                            aria-label="Send"
                            className={`${currentTheme.primary} rounded-lg px-3 text-white hover:opacity-90`}
                        >
                            <Send className="h-4 w-4" aria-hidden="true" />
                        </button>
                    </form>
                </div>
            )}
        </InsightCard>
    )
}

export default PharmacistQuestionsCard
