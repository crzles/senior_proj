import {useState} from "react"
import {useNavigate} from "react-router-dom"
import pillbugLogo from "../assets/pillbug-logo.png"

function AuthPage() {
  const navigate = useNavigate()

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

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">

      {/* Authentication Box */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* PillBug Header */}
        <div className="flex items-center px-5 py-3">
          <div className="flex items-center gap-2">
            <img
              src={pillbugLogo}
              alt="PillBug logo"
              className="w-12 h-12 object-contain"
          />

            <h1 className="text-xl font-bold">
              PillBug
            </h1>
          </div>
        </div>

        {/*Welcome Card */}
        <div className={`${isSignUp ? "bg-blue-600 text-white" : "bg-blue-50"} rounded-xl p-5 mb-5`}>

          {/* Welcome Icon */}
          <div className={`w-12 h-12 ${isSignUp ? "bg-white/20" : "bg-blue-100"} rounded-full flex items-center justify-center mb-4`}>
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
        <div className="flex bg-gray-100 rounded-xl p-1 mb-4">
          <button
            onClick={() => setIsSignUp(false)} 
            className={`flex-1 py-2 text-sm rounded-lg ${
              !isSignUp
                ? "bg-blue-600 text-white"
                : "text-gray-700"
            }`}
          >
            Sign In
          </button>

          <button
            onClick={() => setIsSignUp(true)} 
            className={`flex-1 py-2 text-sm rounded-lg ${
              isSignUp
                ? "bg-blue-600 text-white"
                : "text-gray-700"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form Box */}
        <div className="p-6">

          {isSignUp ? (
            <>
               {/* First name */}
                <div className="mb-3">
                  <label className="block mb-2 font-medium">
                    First Name
                  </label>

                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg" 
                  />
                </div>

                {/* Last name */}
                <div className="mb-3">
                  <label className="block mb-2 font-medium">
                    Last Name
                  </label>

                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg" 
                  />
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label className="block mb-2 font-medium">
                    Email
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                
                {/* Password */}
                <div className="mb-3">
                  <label className="block mb-2 font-medium">
                    Password
                  </label>

                  <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg" 
                  />
                </div>

                {/* Date of Birth*/}
                <div className="mb-6">
                  <label className="block mb-2 font-medium">
                    Date of Birth
                  </label>

                  <input 
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg" 
                  />
                </div>

                {/* Terms of Service */}
                <div className="mb-4">
                  <label className="block mb-2 font-medium">
                    Terms of Service
                  </label>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="w-4 h-4"
                  />

                  <span className="text-xs text-gray-600">
                    I have read and agree to the Terms of Service
                  </span>
                </div>
              </div>
                {/* Sign Up Button */}
                <button
                  onClick={handleSignUp}
                  className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                {/* Email */}
                <div className="mb-3">
                  <label className="block mb-2 font-medium">
                    Email
                  </label>
                  
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg" 
                  />
                </div>

                {/* Password */}
                <div className="mb-3">
                  <label className="block mb-2 font-medium">
                    Password
                  </label>

                  <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg" 
                  />
                </div>

                {/* Forgot Password */}
                <div className="text-right mb-4">
                  <button className="text-sm text-blue-600 hover:underline">
                    Forgot Password?
                  </button>
                </div>

                {/* Sign In Button */}
                <button
                  onClick={handleSignIn}
                  className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
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