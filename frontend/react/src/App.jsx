import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom"
import {ThemeProvider} from "./context/ThemeContext"
import {DemoProvider, useDemo} from "./context/DemoContext"
import AuthPage from "./pages/AuthPage"
import HomePage from "./pages/HomePage"
import ComingSoon from "./pages/ComingSoon"
import InsightsPage from "./pages/InsightsPage"
import MedicationList from "./pages/MedicationList"
import AddMedication from "./pages/AddMedication"
import EditMedication from "./pages/EditMedication"
import MedicationInfo from "./pages/MedicationInfo"
import ProfilePage from "./pages/ProfilePage"
import MapPage from "./pages/MapPage"
import SymptomPage from "./pages/SymptomPage"
import DoseReminder from "./components/DoseReminder"

// Pages behind sign-in. With demo mode off, signed-out visitors go back to the sign-in page.
function RequireAuth({children}) {
    const {isAuthenticated, authLoading} = useDemo()

    if (authLoading) {
        return null
    }

    return isAuthenticated ? children : <Navigate to="/" replace />
}

function App() {
    return (
        <BrowserRouter>
            <ThemeProvider>
                <DemoProvider>
                    <DoseReminder />
                    <Routes>
                        <Route path="/" element={<AuthPage />} />
                        <Route path="/home" element={<RequireAuth><HomePage /></RequireAuth>} />
                        <Route path="/MedPage" element={<RequireAuth><MedicationList /></RequireAuth>} />
                        <Route path="/add-medication" element={<RequireAuth><AddMedication /></RequireAuth>} />
                        <Route path="/edit-medication" element={<RequireAuth><EditMedication /></RequireAuth>} />
                        <Route path="/medication-info" element={<RequireAuth><MedicationInfo /></RequireAuth>} />
                        <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
                        <Route path="/map" element={<RequireAuth><MapPage /></RequireAuth>} />
                        <Route path="/symptoms" element={<RequireAuth><SymptomPage /></RequireAuth>} />
                        <Route path="/insights" element={<RequireAuth><InsightsPage /></RequireAuth>} />
                        <Route path="/coming-soon" element={<RequireAuth><ComingSoon /></RequireAuth>} />
                    </Routes>
                </DemoProvider>
            </ThemeProvider>
        </BrowserRouter>
    )
}

export default App