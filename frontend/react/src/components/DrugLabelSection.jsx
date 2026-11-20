import {useEffect, useState} from "react"
import {getDrugLabel} from "../api/drugs"
import {useDemo} from "../context/DemoContext"
import {useTheme} from "../context/ThemeContext"

const PREVIEW_LENGTH = 240

// Drug label text can be very long, so show the start and let the user expand it.
function ExpandableText({text}) {
    const [expanded, setExpanded] = useState(false)
    const {currentTheme} = useTheme()

    const isLong = text.length > PREVIEW_LENGTH

    return (
        <p className={`text-sm ${currentTheme.secondaryText}`}>
            {expanded || !isLong ? text : `${text.slice(0, PREVIEW_LENGTH).trimEnd()}...`}

            {isLong && (
                <button
                    type="button"
                    onClick={() => setExpanded((open) => !open)}
                    className={`ml-1 font-semibold ${currentTheme.accentText}`}
                >
                    {expanded ? "Show less" : "Show more"}
                </button>
            )}
        </p>
    )
}

// "About this medication": what the linked FDA drug label says. It only appears for
// medications that were linked to a label when they were added.
function DrugLabelSection({medication}) {
    const {demoMode, demoDrugLabels} = useDemo()
    const {currentTheme} = useTheme()

    const setId = medication.label_set_id
    const [fetched, setFetched] = useState({setId: null, label: null, failed: false})

    // With demo mode off, load the label from the backend.
    useEffect(() => {
        if (demoMode || !setId) {
            return
        }

        let cancelled = false

        getDrugLabel(setId)
            .then((label) => {
                if (!cancelled) {
                    setFetched({setId, label, failed: false})
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setFetched({setId, label: null, failed: true})
                }
            })

        return () => {
            cancelled = true
        }
    }, [demoMode, setId])

    if (!setId) {
        return null
    }

    const isCurrent = fetched.setId === setId
    const label = demoMode ? demoDrugLabels[setId] : isCurrent ? fetched.label : null
    const loading = !demoMode && !isCurrent
    const failed = !demoMode && isCurrent && fetched.failed

    const sections = label
        ? [
            ["Purpose", label.purpose],
            ["Used for", label.indications],
            ["Label dosage", label.dosage],
            ["Warnings", label.warnings],
        ].filter(([, text]) => text)
        : []

    return (
        <section className={`${currentTheme.card} rounded-xl p-4 shadow-sm mb-4`}>
            <h3 className={`text-sm font-semibold ${currentTheme.text} mb-3`}>
                About this medication
            </h3>

            {loading && (
                <p className={`text-sm ${currentTheme.secondaryText}`}>Loading drug label...</p>
            )}

            {failed && (
                <p className={`text-sm ${currentTheme.secondaryText}`}>
                    Couldn't load the drug label right now.
                </p>
            )}

            {!loading && !failed && !label && (
                <p className={`text-sm ${currentTheme.secondaryText}`}>
                    No drug label is saved for this medication.
                </p>
            )}

            {label && (
                <div className="space-y-3">
                    {label.generic_name && label.generic_name !== label.med_name && (
                        <p className={`text-xs ${currentTheme.secondaryText}`}>
                            Generic name: {label.generic_name}
                        </p>
                    )}

                    {label.boxed_warning && (
                        <div className={`rounded-lg p-3 ${currentTheme.dangerSoft}`}>
                            <p className="mb-1 text-xs font-bold">Boxed warning</p>
                            <ExpandableText text={label.boxed_warning} />
                        </div>
                    )}

                    {sections.map(([title, text]) => (
                        <div key={title}>
                            <p className={`text-xs font-semibold ${currentTheme.text} mb-1`}>{title}</p>
                            <ExpandableText text={text} />
                        </div>
                    ))}

                    <p className={`text-xs ${currentTheme.secondaryText}`}>
                        Source: FDA drug label
                        {label.last_updated
                            ? `, updated ${new Date(label.last_updated).toLocaleDateString("en-US", {month: "short", day: "numeric", year: "numeric"})}`
                            : ""}
                        . This is general information, not medical advice.
                    </p>
                </div>
            )}
        </section>
    )
}

export default DrugLabelSection
