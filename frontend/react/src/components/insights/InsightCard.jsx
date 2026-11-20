import {ChevronRight} from "lucide-react"
import {useTheme} from "../../context/ThemeContext"

// The card every section on the Insights page sits in: a title, an optional subtitle,
// the section's content, and an optional "Review ... >" link at the bottom.
function InsightCard({title, subtitle, linkLabel, onLinkClick, children}) {
    const {currentTheme} = useTheme()

    return (
        <section className={`${currentTheme.card} rounded-2xl p-4 shadow-sm mb-4`}>
            <h2 className={`${currentTheme.text} font-bold`}>{title}</h2>

            {subtitle && (
                <p className={`${currentTheme.secondaryText} text-xs mb-3`}>{subtitle}</p>
            )}

            {children}

            {linkLabel && (
                <button
                    type="button"
                    onClick={onLinkClick}
                    className={`mt-3 flex w-full items-center justify-between text-sm font-semibold ${currentTheme.accentText}`}
                >
                    {linkLabel}
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
            )}
        </section>
    )
}

export default InsightCard
