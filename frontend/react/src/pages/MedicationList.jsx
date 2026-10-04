import { useState } from "react"

function MedicationList() {
    const [medications] = useState([
        {
            id: 1,
            name: "Ibuprofen",
            dosage: "200 mg",
            recurrence: "Every 6 hours",
            pillsPerDose: 1,
            nextDose: "4:00 PM",
        },
        {
            id: 2,
            name: "Vitamin D",
            dosage: "1000 IU",
            recurrence: "Once daily",
            pillsPerDose: 1,
            nextDose: "8:00 PM",
        },
    ])

    function goToAddMedication() {
        window.location.href = "/add-medication"
    }

    function goToEditMedication(id) {
        window.location.href = `/edit-medication?id=${id}`
    }

    function goToMedicationInfo(id) {
        window.location.href = `/medication-info?id=${id}`
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 flex flex-col pb-20">

            {/* Header */}
            <div className="mb-4">
                <p className="text-sm text-gray-600">
                    PillBug
                </p>

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold">
                            My Medications
                        </h1>

                        <p className="text-sm text-blue-600">
                            Keep track of your medications and supplements
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={goToAddMedication}
                        className="w-10 h-10 bg-blue-600 text-white rounded-full font-semibold"
                    >
                        +
                    </button>
                </div>
            </div>

            {/* Medication Summary */}
            <div className="bg-blue-600 text-white rounded-xl p-4 mb-4">
                <p className="text-sm opacity-80">
                    Your medication routine
                </p>

                <h2 className="text-lg font-bold">
                    {medications.length}{" "}
                    {medications.length === 1
                        ? "medication"
                        : "medications"}{" "}
                    added
                </h2>
            </div>

            {/* Your Medications */}
            <div className="mb-4">

                <h2 className="text-lg font-bold mb-2">
                    Your Medications
                </h2>

                <div className="space-y-3">

                    {medications.map((medication) => (
                        <div
                            key={medication.id}
                            className="bg-white rounded-xl p-4 shadow-sm"
                        >

                            {/* Medication Name */}
                            <div className="flex items-start justify-between gap-3 mb-3">

                                <div>
                                    <h3 className="text-lg font-bold">
                                        {medication.name}
                                    </h3>

                                    <p className="text-sm text-gray-500">
                                        {medication.dosage}
                                    </p>
                                </div>

                                <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold">
                                    Active
                                </span>

                            </div>

                            {/* Medication Details */}
                            <div className="grid grid-cols-2 gap-3 mb-3">

                                <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-xs text-gray-500 mb-1">
                                        Frequency
                                    </p>

                                    <p className="text-sm font-semibold">
                                        {medication.recurrence}
                                    </p>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-xs text-gray-500 mb-1">
                                        Per dose
                                    </p>

                                    <p className="text-sm font-semibold">
                                        {medication.pillsPerDose}{" "}
                                        {medication.pillsPerDose === 1
                                            ? "pill"
                                            : "pills"}
                                    </p>
                                </div>

                            </div>

                            {/* Next Dose */}
                            <div className="bg-blue-50 rounded-lg p-3 mb-3">

                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-500">
                                        Next dose
                                    </p>

                                    <p className="text-sm font-semibold text-blue-600">
                                        {medication.nextDose}
                                    </p>
                                </div>

                            </div>

                            {/* Buttons */}
                            <div className="grid grid-cols-2 gap-2">

                                <button
                                    type="button"
                                    onClick={() =>
                                        goToEditMedication(medication.id)
                                    }
                                    className="py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
                                >
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        goToMedicationInfo(medication.id)
                                    }
                                    className="py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                                >
                                    More Info
                                </button>

                            </div>

                        </div>
                    ))}

                </div>
            </div>

            {/* Add Medication */}
            <button
                type="button"
                onClick={goToAddMedication}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700"
            >
                + Add Medication
            </button>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2">

                <div className="flex justify-around">

                    <button
                        type="button"
                        onClick={() => (window.location.href = "/")}
                        className="flex flex-col items-center text-blue-600 text-xs font-semibold"
                    >
                        <span className="text-lg">
                            ⌂
                        </span>
                        Home
                    </button>

                    <button
                        type="button"
                        className="flex flex-col items-center text-gray-500 text-xs"
                    >
                        <span className="text-lg">
                            📍
                        </span>
                        Map
                    </button>

                    <button
                        type="button"
                        className="flex flex-col items-center text-gray-500 text-xs"
                    >
                        <span className="text-lg">
                            📝
                        </span>
                        Symptoms
                    </button>

                    <button
                        type="button"
                        className="flex flex-col items-center text-gray-500 text-xs"
                    >
                        <span className="text-lg">
                            📅
                        </span>
                        Calendar
                    </button>

                    <button
                        type="button"
                        className="flex flex-col items-center text-gray-500 text-xs"
                    >
                        <span className="text-lg">
                            👤
                        </span>
                        Profile
                    </button>

                </div>

            </nav>

        </div>
    )
}

export default MedicationList