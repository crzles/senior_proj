function MedicationList() {
  const medications = [
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
  ];

  return (
    <div>
      <h1>My Medications</h1>

      <button
        onClick={() => (window.location.href = "/add-medication")}
      >
        + Add Medication
      </button>

      {medications.length === 0 ? (
        <p>No medications added yet.</p>
      ) : (
        <div>
          {medications.map((medication) => (
            <div
              key={medication.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "20px",
                margin: "20px auto",
                maxWidth: "400px",
              }}
            >
              <h2>{medication.name}</h2>

              <p>Dosage: {medication.dosage}</p>
              <p>Frequency: {medication.recurrence}</p>
              <p>Pills per dose: {medication.pillsPerDose}</p>

              <button
                onClick={() =>
                  (window.location.href = "/edit-medication")
                }
                style={{ marginRight: "10px" }}
              >
                Edit
              </button>

              <button
                onClick={() =>
                  (window.location.href = "/medication-info")
                }
              >
                More Info
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MedicationList;