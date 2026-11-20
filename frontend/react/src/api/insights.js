import {apiFetch} from "./client"

// /api/insights  ->  {insights: [{kind, title, detail}], empty}
export const getInsights = () => apiFetch("/insights/", {method: "POST"})
