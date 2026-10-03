import { useState } from "react";

// Medication list page
function MedicationList() {
  // Temporary medication data
  const [medications] = useState([
    {
      id: 1,
      name: "Ibuprofen",
      dosage: "200 mg",
      recurrence: "Every 6 hours",
      pillsPerDose: 1,
    },
    {
      id: 2,
      name: "Vitamin D",
      dosage: "1000 IU",
      recurrence: "Once daily",
      pillsPerDose: 1,
    },
  ]);

  return (
    <div>
      {/* Page title */}
      <h1>My Medications</h1>

      {/* Add medication button */}
      <button>Add Medication</button>

      {/* Display medications */}
      {medications.length === 0 ? (
        <p>No medications added yet.</p>
      ) : (
        <div>
          {medications.map((medication) => (
            <div key={medication.id}>
              <h2>{medication.name}</h2>

              <p>Dosage: {medication.dosage}</p>
              <p>Frequency: {medication.recurrence}</p>
              <p>Pills per dose: {medication.pillsPerDose}</p>

              {/* Medication actions */}
              <button>Edit</button>
              <button>More Info</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MedicationList;