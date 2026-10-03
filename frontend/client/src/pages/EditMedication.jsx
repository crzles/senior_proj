import { useState } from "react";

function EditMedication() {
  const [refillable, setRefillable] = useState("");

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
          marginBottom: "35px",
          lineHeight: "1.2",
        }}
      >
        Edit Medication
      </h1>

      <form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <label
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          Name
          <input
            type="text"
            placeholder="Medication name"
            style={{
              width: "100%",
              padding: "10px",
              boxSizing: "border-box",
            }}
          />
        </label>

        <label
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          Medication Type
          <select
            style={{
              width: "100%",
              padding: "10px",
              boxSizing: "border-box",
            }}
          >
            <option value="">Select type</option>
            <option value="Medication">Medication</option>
            <option value="Supplement">Supplement</option>
          </select>
        </label>

        <label
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          Dosage
          <input
            type="text"
            placeholder="Enter dosage"
            style={{
              width: "100%",
              padding: "10px",
              boxSizing: "border-box",
            }}
          />
        </label>

        <label
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          Pills per Dose
          <input
            type="number"
            min="1"
            placeholder="Enter amount"
            style={{
              width: "100%",
              padding: "10px",
              boxSizing: "border-box",
            }}
          />
        </label>

        <label
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          Re-occurrence
          <input
            type="text"
            placeholder="Enter re-occurrence"
            style={{
              width: "100%",
              padding: "10px",
              boxSizing: "border-box",
            }}
          />
        </label>

        <label
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          Start Date
          <input
            type="date"
            style={{
              width: "100%",
              padding: "10px",
              boxSizing: "border-box",
            }}
          />
        </label>

        <label
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          Treatment Duration / End Date
          <input
            type="date"
            style={{
              width: "100%",
              padding: "10px",
              boxSizing: "border-box",
            }}
          />
        </label>

        <div>
          <p style={{ marginBottom: "8px" }}>Refillable?</p>

          <label>
            <input
              type="radio"
              name="refillable"
              value="yes"
              checked={refillable === "yes"}
              onChange={(e) => setRefillable(e.target.value)}
            />
            {" "}Yes
          </label>

          <label style={{ marginLeft: "20px" }}>
            <input
              type="radio"
              name="refillable"
              value="no"
              checked={refillable === "no"}
              onChange={(e) => setRefillable(e.target.value)}
            />
            {" "}No
          </label>
        </div>

        {refillable === "yes" && (
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            Refill Reminder
            <input
              type="number"
              min="1"
              placeholder="Days before refill"
              style={{
                width: "100%",
                padding: "10px",
                boxSizing: "border-box",
              }}
            />
          </label>
        )}

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "10px",
          }}
        >
          <button type="submit">Save Changes</button>

          <button
            type="button"
            onClick={() => (window.location.href = "/")}
          >
            My Medications
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditMedication;