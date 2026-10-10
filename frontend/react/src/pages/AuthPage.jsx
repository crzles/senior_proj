import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTheme } from "../context/ThemeContext"
import pillbugLogo from "../assets/pillbug-logo.png"

function AuthPage() {
    const navigate = useNavigate()
    const {currentTheme} = useTheme()

    const [isSignUp, setIsSignUp] = useState(false)
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [dateOfBirth, setDateOfBirth] = useState("")
    const [termsAccepted, setTermsAccepted] = useState(false)

    const handleSignUp = () => {
        if(!firstName || !lastName || !email || !password || !dateOfBirth) {
            alert("Please fill out all required fields.")
            return
        }

        if(!termsAccepted) {
            alert("Please agree to the Terms of Service.")
            return
        }

        navigate("/home")
    }

    const handleSignIn = () => {
        if(!email || !password) {
            alert("Please enter your email and password.")
            return
        }

        navigate("/home")
    }

    const inputClass =
        `w-full px-4 py-3 border ${currentTheme.border} rounded-xl ${currentTheme.card} ${currentTheme.text} text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`

    const labelClass =
        `block text-sm font-semibold ${currentTheme.text} mb-2`

    return (
        <div className={`min-h-screen ${currentTheme.background} flex items-center justify-center p-4`}>

            {/* Authentication Box */}
            <div className={`w-full max-w-md ${currentTheme.card} rounded-xl shadow-lg overflow-hidden`}>

                {/* PillBug Header */}
                <div className="flex items-center px-5 py-3">
                    <div className="flex items-center gap-2">
                        <img
                            src={pillbugLogo}
                            alt="PillBug logo"
                            className="w-12 h-12 object-contain"
                    />

                        {/* <h1 className={`text-xl font-bold ${currentTheme.text}`}>
                            PillBug
                        </h1> */}
                    </div>
                </div>

                {/*Welcome Card */}
                <div className={`${isSignUp ? `${currentTheme.primary} text-white` : "bg-gray-100 text-gray-900"} mx-5 rounded-xl p-5 mb-5`}>

                    {/* Welcome Icon */}
                    <div className={`w-12 h-12 ${isSignUp ? "bg-white/20" : "bg-white"} rounded-full flex items-center justify-center mb-4`}>
                        <span className="text-2xl">
                            {isSignUp ? "❤️" : "👋"}
                            </span>
                    </div>

                    <h2 className="text-2xl font-bold mb-2">
                        {isSignUp ? "Start your health journey" : "Welcome to PillBug"}
                    </h2>

                    <p className={`text-sm ${isSignUp ? "text-white" : "text-gray-600"}`}>
                        {isSignUp
                            ? "Track your medications, supplements, and symptoms with ease."
                            : "Keep your medications, supplements, and symptoms in one place."}
                      
                    </p>

                </div>
                        
                {/* Sign in / Sign up Tabs */}
                <div className="mx-5 flex bg-gray-100 rounded-xl p-1 mb-4">
                    <button
                        onClick={() => setIsSignUp(false)} 
                        className={`flex-1 py-2 text-sm font-semibold rounded-lg ${
                            !isSignUp
                                ? `${currentTheme.primary} text-white`
                                : "text-gray-600"
                        }`}
                    >
                        Sign In
                    </button>

                    <button
                        onClick={() => setIsSignUp(true)} 
                        className={`flex-1 py-2 text-sm font-semibold rounded-lg ${
                            isSignUp
                                ? `${currentTheme.primary} text-white`
                                : "text-gray-600"
                        }`}
                    >
                        Sign Up
                    </button>
                </div>

                {/* Form Box */}
                <div className="p-5">

                    {isSignUp ? (
                        <>
                              {/* First name */}
                                <div className="mb-3">
                                    <label className={labelClass}>
                                        First Name
                                    </label>

                                    <input
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className={inputClass} 
                                    />
                                </div>

                                {/* Last name */}
                                <div className="mb-3">
                                    <label className={labelClass}>
                                        Last Name
                                    </label>

                                    <input
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className={inputClass} 
                                    />
                                </div>

                                {/* Email */}
                                <div className="mb-3">
                                    <label className={labelClass}>
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={inputClass}
                                    />
                                </div>
                                
                                {/* Password */}
                                <div className="mb-3">
                                    <label className={labelClass}>
                                        Password
                                    </label>

                                    <input 
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={inputClass} 
                                    />
                                </div>

                                {/* Date of Birth*/}
                                <div className="mb-6">
                                    <label className={labelClass}>
                                        Date of Birth
                                    </label>

                                    <input 
                                        type="date"
                                        value={dateOfBirth}
                                        onChange={(e) => setDateOfBirth(e.target.value)}
                                        className={inputClass} 
                                    />
                                </div>

                                {/* Terms of Service */}
                                <div className="mb-4">
                                    <label className={labelClass}>
                                        Terms of Service
                                    </label>

                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={termsAccepted}
                                        onChange={(e) => setTermsAccepted(e.target.checked)}
                                        className="w-4 h-4 accent-blue-600"
                                    />

                                    <span className={`text-xs ${currentTheme.secondaryText}`}>
                                        I have read and agree to the Terms of Service
                                    </span>
                                </div>
                            </div>
                                {/* Sign Up Button */}
                                <button
                                    onClick={handleSignUp}
                                    className={`w-full py-3 ${currentTheme.primary} text-white font-semibold rounded-xl hover:opacity-90`}
                                >
                                    Sign Up
                                </button>
                            </>
                        ) : (
                            <>
                                {/* Email */}
                                <div className="mb-3">
                                    <label className={labelClass}>
                                        Email
                                    </label>
                                    
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={inputClass} 
                                    />
                                </div>

                                {/* Password */}
                                <div className="mb-3">
                                    <label className={labelClass}>
                                        Password
                                    </label>

                                    <input 
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={inputClass} 
                                    />
                                </div>

                                {/* Forgot Password */}
                                <div className="text-right mb-4">
                                    <button className={`text-sm font-semibold ${currentTheme.text} hover:underline`}>
                                        Forgot Password?
                                    </button>
                                </div>

                                {/* Sign In Button */}
                                <button
                                    onClick={handleSignIn}
                                    className={`w-full py-3 ${currentTheme.primary} text-white font-semibold rounded-xl hover:opacity-90`}
                                >
                                    Sign In
                                </button>
                            </>
                        )}

                </div>

            </div>

        </div>
    )
}

export default AuthPage