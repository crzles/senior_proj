function HomePage() {
    return (
        <div className="min-h-screen bg-gray-50 p-4 flex flex-col">

            {/* Welcome Header */}
            <div className="mb-4">
                <p className="text-sm text-gray-600">
                    Welcome to PillBug, name 👋 {/* first name last name*/}
                </p>

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold">
                            Today's Medications
                        </h1>

                        <p className="text-sm text-blue-600">
                            📅 Day, num-date month year {/* actual date */}
                        </p>
                    </div>

                    {/* Profile Button */}
                    <button className="w-10 h-10 bg-blue-600 text-white rounded-full font-semibold">
                        P 
                    </button>
                </div>
            </div>

            {/* Fresh Start Card */}
            <div className="bg-blue-600 text-white rounded-xl p-4 mb-4">

                <p className="text-sm opacity-80">
                    A fresh start
                </p>

                <h2 className="text-lg font-bold">
                    Your routine starts here
                </h2>

                <p className="text-sm opacity-80">
                    Add your first medication to begin.
                </p>

            </div>

            {/* Medication Status */}
            <div className="grid grid-cols-3 gap-3 mb-4">

                {/* Taken */}
                <div className="bg-white rounded-xl p-3 text-center shadow-sm">
                    <p className="text-xl font-bold text-blue-600">
                        0
                    </p>
                    <p className="text-xs text-gray-500">
                        Taken
                    </p>
                </div>

                {/* Pending */}
                <div className="bg-white rounded-xl p-3 text-center shadow-sm">
                    <p className="text-xl font-bold text-yellow-600">
                        0
                    </p>
                    <p className="text-xs text-gray-500">
                        Pending
                    </p>
                </div>

                {/* Missed */}
                <div className="bg-white rounded-xl p-3 text-center shadow-sm">
                    <p className="text-xl font-bold text-red-600">
                        0
                    </p>
                    <p className="text-xs text-gray-500">
                        Missed
                    </p>
                </div>

            </div>

            {/* Medication Filters */}
            <div className="flex gap-2 mb-4 overflow-x-auto">

                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
                    All
                </button>
                
                <button className="px-4 py-2 bg-white-600 text-gray rounded-lg text-sm font-medium">
                    Morning
                </button>

                <button className="px-4 py-2 bg-white-600 text-gray rounded-lg text-sm font-medium">
                    Afternoon
                </button>

                <button className="px-4 py-2 bg-white-600 text-gray rounded-lg text-sm font-medium">
                    Evening
                </button>
            </div>

            {/* Your medications */}
            <div className="mb-4">
                <h2 className="text-lg font-bold mb-2">
                    Your Medications
                </h2>

                <div className="bg-white rounded-xl p-6 text-center shadow-sm">

                    {/* Pill Icon */}
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">
                            💊
                        </span>
                    </div>

                    {/* Empty State Title */}
                    <h3 className="text-lg font-bold mb-2">
                        No medications yet
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-500 max-w-xs mx-auto">
                        Add your first medication or supplement to see your daily
                        schedule here.
                    </p>

                    {/* Divider */}
                    <div className="border-t border-gray-200 my-4"></div>

                    {/* No Doses */}
                    <p className="text-sm text-gray-500">
                        No doses scheduled Today
                    </p>
                </div>

            </div>

            {/* Reminder Information */}
            <div className="bg-blue-50 border border-blue-100 rounded xl p-4 mb-4">

                <h3 className="font-semibold mb-1">
                    Medication reminders
                </h3>

                <p className="text-sm text-gray-600">
                    Once you add a medication, your reminders and upcoming doses will appear here.
                </p>

            </div>

            {/* Add Medication Button */}
            <button className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700">
                + Add Medication 
            </button>

            {/* Medication Type Filter */}
            <div className="flex gap-2 py-2 mb-1">

                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
                    All
                </button>

                <button className="px-4 py-2 bg-white text-gray-600 rounded-lg text-sm font-medium">
                    Medication
                </button>

                <button className="px-4 py-2 bg-white text-gray-600 rounded-lg text-sm font-medium">
                    Supplement
                </button>
            </div>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2">

                <div className="flex justify-around">

                    <button className="flex flex-col items-center text-gray-500 text-xs">
                        <span className="text-lg">⌂</span>
                        Home
                    </button>

                    <button className="flex flex-col items-center text-gray-500 text-xs">
                        <span className="text-lg">📍</span>
                        Map
                    </button>

                    <button className="flex flex-col items-center text-gray-500 text-xs">
                        <span className="text-lg">📝</span>
                        Symptoms
                    </button>

                    <button className="flex flex-col items-center text-gray-500 text-xs">
                        <span className="text-lg">📅</span>
                        Calendar
                    </button>

                    <button className="flex flex-col items-center text-gray-500 text-xs">
                        <span className="text-lg">👤</span>
                        Profile
                    </button>

                </div>
            </nav>

        </div>
    )
}

export default HomePage