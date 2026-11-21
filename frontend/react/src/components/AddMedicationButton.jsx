import {Plus} from "lucide-react"
import {useNavigate} from "react-router-dom"
import {useTheme} from "../context/ThemeContext"

// A floating "Add Medication" button that stays on screen however far the page is scrolled.
// `bottomClass` sets how far above the bottom edge it floats, so each page can clear the
// bars underneath it (the nav is 3.5rem tall).
function AddMedicationButton({bottomClass}) {
    const navigate = useNavigate()
    const {currentTheme} = useTheme()

    return (
        <button
            type="button"
            onClick={() => navigate("/add-medication")}
            className={`fixed inset-x-4 z-20 flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-lg hover:opacity-90 ${currentTheme.primary} ${bottomClass}`}
        >
            <Plus className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
            Add Medication
        </button>
    )
}

export default AddMedicationButton
