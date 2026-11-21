import {apiFetch} from "./client"

// /api/insights?days=7  ->  {insights: [{kind, title, detail}], empty}
// `days` is how far back to look (the Insights page offers 7, 14 or 30).
export const getInsights = (days = 7) => apiFetch(`/insights/?days=${days}`, {method: "POST"})
