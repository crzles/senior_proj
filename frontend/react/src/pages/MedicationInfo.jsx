function MedicationInfo() {
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
        <h2 style={{ textAlign: "center" }}>Ibuprofen</h2>

        <p>Next Reminder: 2:00 PM</p>
        <p>Type: Medication</p>
        <p>Dosage: 200 mg</p>
        <p>Re-occurrence: Every 6 hours</p>
        <p>Treatment Duration: 7 days</p>
        <p>Refillable: Yes</p>

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
              (window.location.href = "/edit-medication")
            }
          >
            Edit Medication
          </button>

          <button
            onClick={() => (window.location.href = "/")}
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