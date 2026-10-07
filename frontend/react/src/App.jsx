import { BrowserRouter, Routes, Route } from "react-router-dom"
import AuthPage from "./pages/AuthPage"
import HomePage from "./pages/HomePage"
import MedicationList from "./pages/MedicationList"
import AddMedication from "./pages/AddMedication"
import EditMedication from "./pages/EditMedication"

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AuthPage />} />
                <Route path="/home" element={<HomePage />} />

                <Route
                    path="/MedPage"
                    element={<MedicationList />}
                />

                <Route
                    path="/add-medication"
                    element={<AddMedication />}
                />

                <Route
                    path="/edit-medication"
                    element={<EditMedication />}
                />
            </Routes>
        </BrowserRouter>
    )
}

export default App