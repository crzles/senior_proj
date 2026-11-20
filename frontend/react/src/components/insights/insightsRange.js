// Shared by every card on the Insights page: the time range the user picked.

export const RANGES = [
    {days: 7, label: "Last 7 days"},
    {days: 14, label: "Last 14 days"},
    {days: 30, label: "Last 30 days"},
]

// The first and last day of the range, ending today.
export function getRangeDates(days) {
    const end = new Date()
    const start = new Date()

    start.setDate(end.getDate() - (days - 1))

    return {start, end}
}

// "13-19 Mar 2026" (or "28 Feb-6 Mar 2026" when the range crosses a month).
export function formatRangeLabel(days) {
    const {start, end} = getRangeDates(days)
    const month = (date) => date.toLocaleString("en-US", {month: "short"})

    const startPart = start.getMonth() === end.getMonth()
        ? `${start.getDate()}`
        : `${start.getDate()} ${month(start)}`

    return `${startPart}-${end.getDate()} ${month(end)} ${end.getFullYear()}`
}
