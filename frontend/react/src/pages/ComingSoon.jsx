import {useNavigate} from "react-router-dom"
import {useDemo} from "../context/DemoContext"
import {useTheme} from "../context/ThemeContext"
import pillbugLogo from "../assets/pillbug-logo.png"

function ComingSoon() {
    const navigate = useNavigate()

    const {demoUser} = useDemo()
    const {currentTheme} = useTheme()

    return (
        <div className={`min-h-screen ${currentTheme.background} p-4 pb-24 flex flex-col`}>

            {/* Header */}
            <div className="mb-4">

                <div className="flex items-center justify-between">

                    {/*PillBug Logo */}
                    <div className="flex items-center gap-2">

                            <div className="w-8 h-8 items-center justify-center">
                                <img
                                    src={pillbugLogo}
                                    alt="PillBug"
                                    className="w-8 h-8 object-contain"
                                />
                            </div>

                            {/* <h1 className={`${currentTheme.text} text-xl font-bold`}>
                                PillBug
                            </h1> */}
                    </div>

                        {/* Profile Button */}
                        <button className="w-10 h-10 bg-blue-600 text-white rounded-full font-semibold">
                            {demoUser
                                ? `${demoUser.firstName.charAt(0)}${demoUser.lastName.charAt(0)}`
                                : "?"}
                        </button>

                    </div>

                </div>

            {/* Coming Soon Message */}
            <div className="flex-1 flex items-center justify-center">
            
               <div className={`${currentTheme.card} w-full rounded-2xl p-6 text-center shadow-sm`}>

                    {/* Clock Icon */}
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">
                            ◷
                        </span>
                    </div>

                    {/* Title */}
                    <h2 className={`${currentTheme.text} text-2xl font-bold mb-2`}>
                        Coming Soon
                    </h2>

                    {/* Description */}
                    <p className={`${currentTheme.secondaryText} text-sm mb-6`}>
                        We're putting the finishing touches on this feature.
                        Thanks for your patience as PillBug grows.
                    </p>

                    {/* Back Button */}
                    <button
                        onClick={() => navigate("/home")}
                        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700"
                    >
                        ← Back to Home
                    </button>
                </div>
            </div>

            {/* Footer Message */}
            <p className={`${currentTheme.secondaryText} text-sm text-center mb-4`}>
                A little more care is on the way.
            </p>

        </div>
    )
}

export default ComingSoon