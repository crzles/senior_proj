// Fetch wrapper for the FastAPI backend.
// It adds the /api prefix, the JSON header, and the login token.
// In development, Vite proxies /api to the backend (see vite.config.js).

const TOKEN_KEY = "pillbug-token"

export function getToken() {
    try {
        return localStorage.getItem(TOKEN_KEY)
    } catch {
        return null
    }
}

export function setToken(token) {
    try {
        localStorage.setItem(TOKEN_KEY, token)
    } catch {
        // Storage is blocked; the user will need to sign in again after a refresh.
    }
}

export function clearToken() {
    try {
        localStorage.removeItem(TOKEN_KEY)
    } catch {
        // Nothing to clear.
    }
}

export class ApiError extends Error {
    constructor(message, status) {
        super(message)
        this.status = status
    }
}

// Called when the backend rejects the token (expired or invalid) so the app can sign out.
let unauthorizedHandler = null

export function onUnauthorized(handler) {
    unauthorizedHandler = handler
}

// FastAPI sends `detail` as a string for most errors and as a list for validation errors.
function getErrorMessage(data, status) {
    if (typeof data?.detail === "string") {
        return data.detail
    }

    if (Array.isArray(data?.detail)) {
        return data.detail
            .map((item) => item.msg?.replace(/^Value error, /, ""))
            .filter(Boolean)
            .join(" ")
    }

    return `Something went wrong (${status}).`
}

// `json` sends a JSON body, `form` sends form data (the login route needs this),
// and `auth: false` skips the token (login and sign-up).
export async function apiFetch(path, {method = "GET", json, form, auth = true} = {}) {
    const headers = {}
    const token = getToken()

    if (auth && token) {
        headers.Authorization = `Bearer ${token}`
    }

    let body

    if (json !== undefined) {
        headers["Content-Type"] = "application/json"
        body = JSON.stringify(json)
    } else if (form) {
        body = new URLSearchParams(form)
    }

    let response

    try {
        response = await fetch(`/api${path}`, {method, headers, body})
    } catch {
        throw new ApiError("Can't reach the server. Please try again.", 0)
    }

    if (response.status === 204) {
        return null
    }

    const data = await response.json().catch(() => null)

    if (!response.ok) {
        if (response.status === 401 && auth && unauthorizedHandler) {
            unauthorizedHandler()
        }

        throw new ApiError(getErrorMessage(data, response.status), response.status)
    }

    return data
}
