import { useSearchParams, useNavigate } from "react-router-dom"
import { useDemo } from "../context/DemoContext"

function MedicationInfo() {
  const [searchParams] = useSearchParams()
  const medicationId = searchParams.get("id")

  const {demoMedications} = useDemo()
  const navigate = useNavigate()

  const medication = demoMedications.find(
    (med) => String(med.id) === medicationId
  )

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "600px",
        margin: "0 auto",
        padding: "30px 20px",
        boxSizing: "border-box",
      }}
    >
      <h1
        style={{
          fontSize: "36px",
          textAlign: "center",
          marginBottom: "30px",
          lineHeight: "1.2",
        }}
      >
        Medication Information
      </h1>

      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "25px",
        }}
      >
        <h2 style={{ textAlign: "center" }}>
          {medication?.med_name}
        </h2>

        <p>Next Reminder: 2:00 PM</p>
        <p>Type: {medication?.med_type}</p>
        <p>Dosage: {medication?.dosage}</p>
        <p>Re-occurrence: {medication?.recurrence}</p>
        <p>Treatment Duration: 7 days</p>
        <p>
          Refillable: {medication?.is_refillable ? "Yes" : "No"}
        </p>

        <h3>Symptoms / Tags</h3>
        <p>Pain relief</p>

        <h3>Requirements / Suggestions</h3>
        <p>Take with food.</p>

        <h3>Avoid</h3>
        <p>Follow medication instructions.</p>

        <h3>Storage</h3>
        <p>Store at room temperature.</p>

        <div style={{ marginTop: "25px" }}>
          <button
            onClick={() =>
              navigate(`/edit-medication?id=${medication.id}`)
            }
          >
            Edit Medication
          </button>

          <button
            onClick={() => navigate("/MedPage")}
            style={{ marginLeft: "10px" }}
          >
            My Medications
          </button>
        </div>
      </div>
    </div>
  );
}

export default MedicationInfo;