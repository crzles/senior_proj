import {useState} from "react"
import pillbugLogo from "../assets/pillbug-logo.png"

function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">

      {/* Authentication Box */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* PillBug Logo */}
        <div className="flex items-center justify-center gap-3 p-6 pb-2">
          <img
            src={pillbugLogo}
            alt="PillBug logo"
            className="w-12 h-12 object-contain"
          />

          <h1 className="text-2xl font-bold">
            PillBug
          </h1>
        </div>

        {/* Sign in / Sign up Tabs */}
        <div className="flex bg-gray-200 rounded-md p-1 mb-6">
          <button
            onClick={() => setIsSignUp(false)} 
            className={`flex-1 py-2 text-sm rounded ${
              !isSignUp
                ? "bg-blue-600 text-white"
                : "text-gray-700"
            }`}
          >
            Sign In
          </button>

          <button
            onClick={() => setIsSignUp(true)} 
            className={`flex-1 py-2 text-sm rounded ${
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
               {/* Username */}
                <div className="mb-4">
                  <label className="block mb-2 font-medium">
                    Username
                  </label>

                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg" 
                  />
                </div>

                {/* Email */}
                <div className="mb-4">
                  <label className="block mb-2 font-medium">
                    Email
                  </label>

                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                
                {/* Password */}
                <div className="mb-4">
                  <label className="block mb-2 font-medium">
                    Password
                  </label>

                  <input 
                    type="password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg" 
                  />
                </div>

                {/* Confirm Password */}
                <div className="mb-6">
                  <label className="block mb-2 font-medium">
                    Confirm Password
                  </label>

                  <input 
                    type="password"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg" 
                  />
                </div>

                {/* Terms of Service */}
                <div className="mb-6">
                  <label className="block mb-2 font-medium">
                    Terms of Service
                  </label>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                  />

                  <span className="text-xs text-gray-600">
                    I have read and agree to the Terms of Service
                  </span>
                </div>
              </div>
                {/* Sign Up Button */}
                <button className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
                  Sign Up
                </button>
              </>
            ) : (
              <>
                {/* Username */}
                <div className="mb-4">
                  <label className="block mb-2 font-medium">
                    Username
                  </label>
                  
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg" 
                  />
                </div>

                {/* Password */}
                <div className="mb-4">
                  <label className="block mb-2 font-medium">
                    Password
                  </label>

                  <input 
                    type="password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg" 
                  />
                </div>

                {/* Forgot Password */}
                <div className="text-right mb-6">
                  <button className="text-sm text-blue-600 hover:underline">
                    Forgot Password?
                  </button>
                </div>

                {/* Sign In Button */}
                <button className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
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