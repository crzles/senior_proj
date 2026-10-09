import { BrowserRouter, Routes, Route } from "react-router-dom"
import {ThemeProvider} from "./context/ThemeContext"
import {DemoProvider} from "./context/DemoContext"
import AuthPage from "./pages/AuthPage"
import HomePage from "./pages/HomePage"
import ComingSoon from "./pages/ComingSoon"
import MedicationList from "./pages/MedicationList"
import AddMedication from "./pages/AddMedication"
import EditMedication from "./pages/EditMedication"
import MedicationInfo from "./pages/MedicationInfo"

function App() {
    return (
        <BrowserRouter>
            <ThemeProvider>
                <DemoProvider>
                    <Routes>
                        <Route path="/" element={<AuthPage />} />
                        <Route path="/home" element={<HomePage />} />
                        <Route path="/MedPage" element={<MedicationList />} />
                        <Route path="/add-medication" element={<AddMedication />} />
                        <Route path="/edit-medication" element={<EditMedication />} />
                        <Route path="/medication-info" element={<MedicationInfo />} />
                        <Route path="/coming-soon" element={<ComingSoon />} />
                    </Routes>
                </DemoProvider>
            </ThemeProvider>
        </BrowserRouter>
    )
}

export default App