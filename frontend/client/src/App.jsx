import MedicationList from "./pages/MedicationList";
import AddMedication from "./pages/AddMedication";
import EditMedication from "./pages/EditMedication";
import MedicationInfo from "./pages/MedicationInfo";

function App() {
  if (window.location.pathname === "/add-medication") {
    return <AddMedication />;
  }

  if (window.location.pathname === "/edit-medication") {
    return <EditMedication />;
  }

  if (window.location.pathname === "/medication-info") {
    return <MedicationInfo />;
  }

  return <MedicationList />;
}

export default App;