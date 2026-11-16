import {apiFetch, setToken} from "./client"

// POST /api/auth/signup  (JSON)
export function signUp({first_name, last_name, email, password, d_o_b}) {
    return apiFetch("/auth/signup", {
        method: "POST",
        auth: false,
        json: {
            first_name,
            last_name,
            email,
            password,
            d_o_b,
            terms_accepted_at: new Date().toISOString(),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
        },
    })
}

// POST /api/auth/login  (form data - FastAPI's OAuth2 form expects "username")
// Saves the returned token so later requests are signed in.
export async function logIn(email, password) {
    const {access_token} = await apiFetch("/auth/login", {
        method: "POST",
        auth: false,
        form: {username: email, password},
    })

    setToken(access_token)
}

// GET /api/users/me  (needs the token; returns the logged-in user)
export function getMe() {
    return apiFetch("/users/me")
}
