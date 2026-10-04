import { useState } from "react";

function EditMedication() {
  const [medicationName, setMedicationName] = useState("Ibuprofen");
  const [medicationType, setMedicationType] = useState("Medication");
  const [dosage, setDosage] = useState("200 mg");
  const [pillsPerDose, setPillsPerDose] = useState("1");

  const [frequency, setFrequency] = useState("Every 6 hours");
  const [customHours, setCustomHours] = useState("");

  const [startDate, setStartDate] = useState("2026-10-01");
  const [endDate, setEndDate] = useState("");

  const [refillable, setRefillable] = useState("yes");
  const [pillQuantity, setPillQuantity] = useState("30");
  const [refillReminder, setRefillReminder] = useState("7");

  const [instructions, setInstructions] = useState(
    "Take with food if needed."
  );
  const [avoidNotes, setAvoidNotes] = useState(
    "Avoid taking more than directed."
  );
  const [storageNotes, setStorageNotes] = useState(
    "Store at room temperature."
  );

  const [message, setMessage] = useState("");

  const frequencyOptions = [
    "Once daily",
    "Twice daily",
    "3 times daily",
    "4 times daily",
    "Every X hours",
    "Once weekly",
    "Every X days",
    "As needed",
    "Custom schedule",
  ];

  function handleSubmit(event) {
    event.preventDefault();

    if (!medicationName.trim()) {
      setMessage("Please enter a medication name.");
      return;
    }

    if (!dosage.trim()) {
      setMessage("Please enter a dosage.");
      return;
    }

    if (!pillsPerDose || Number(pillsPerDose) < 1) {
      setMessage("Please enter a valid pills per dose amount.");
      return;
    }

    if (endDate && startDate && endDate < startDate) {
      setMessage("End date cannot be before the start date.");
      return;
    }

    if (refillable === "yes" && Number(pillQuantity) < 1) {
      setMessage("Please enter the current pill quantity.");
      return;
    }

    const medicationData = {
      medicationName,
      medicationType,
      dosage,
      pillsPerDose: Number(pillsPerDose),
      frequency,
      customHours,
      startDate,
      endDate,
      refillable: refillable === "yes",
      pillQuantity:
        refillable === "yes" ? Number(pillQuantity) : null,
      refillReminder:
        refillable === "yes" ? Number(refillReminder) : null,
      instructions,
      avoidNotes,
      storageNotes,
    };

    console.log("Updated medication:", medicationData);

    setMessage("Medication updated successfully!");

    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  }

  function cancelEdit() {
    window.location.href = "/";
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#F7F9FC",
        color: "#111827",
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        paddingBottom: "110px",
      }}
    >
      {/* Header */}
      <header
        style={{
          backgroundColor: "#2563EB",
          color: "#FFFFFF",
          padding: "26px 5%",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1400px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              fontSize: "15px",
              fontWeight: "600",
              marginBottom: "5px",
              opacity: 0.9,
            }}
          >
            PillBug
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "32px",
              lineHeight: "1.2",
              fontWeight: "700",
            }}
          >
            Edit Medication
          </h1>

          <p
            style={{
              margin: "7px 0 0",
              fontSize: "16px",
              color: "rgba(255, 255, 255, 0.85)",
            }}
          >
            Update your medication information
          </p>
        </div>
      </header>

      {/* Main */}
      <main
        style={{
          width: "90%",
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "32px 0",
        }}
      >
        {message && (
          <div
            style={{
              marginBottom: "20px",
              padding: "14px 16px",
              borderRadius: "12px",
              backgroundColor:
                message.includes("successfully")
                  ? "#ECFDF5"
                  : "#FEF2F2",
              color:
                message.includes("successfully")
                  ? "#047857"
                  : "#B91C1C",
              border: `1px solid ${
                message.includes("successfully")
                  ? "#A7F3D0"
                  : "#FECACA"
              }`,
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <section
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderRadius: "18px",
              padding: "26px",
              marginBottom: "20px",
              boxShadow: "0 3px 12px rgba(0, 0, 0, 0.04)",
            }}
          >
            <h2
              style={{
                margin: "0 0 5px",
                fontSize: "21px",
                fontWeight: "700",
              }}
            >
              Basic Information
            </h2>

            <p
              style={{
                margin: "0 0 22px",
                color: "#64748B",
                fontSize: "14px",
              }}
            >
              Update the medication or supplement details.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "18px",
              }}
            >
              {/* Name */}
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "7px",
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  Medication Name
                </span>

                <input
                  type="text"
                  value={medicationName}
                  onChange={(e) =>
                    setMedicationName(e.target.value)
                  }
                  placeholder="Medication name"
                  style={{
                    width: "100%",
                    padding: "12px 13px",
                    border: "1px solid #CBD5E1",
                    borderRadius: "10px",
                    fontSize: "15px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </label>

              {/* Type */}
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "7px",
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  Medication Type
                </span>

                <select
                  value={medicationType}
                  onChange={(e) =>
                    setMedicationType(e.target.value)
                  }
                  style={{
                    width: "100%",
                    padding: "12px 13px",
                    border: "1px solid #CBD5E1",
                    borderRadius: "10px",
                    fontSize: "15px",
                    backgroundColor: "#FFFFFF",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="Medication">
                    Medication
                  </option>
                  <option value="Supplement">
                    Supplement
                  </option>
                </select>
              </label>

              {/* Dosage */}
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "7px",
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  Dosage
                </span>

                <input
                  type="text"
                  value={dosage}
                  onChange={(e) =>
                    setDosage(e.target.value)
                  }
                  placeholder="Example: 200 mg"
                  style={{
                    width: "100%",
                    padding: "12px 13px",
                    border: "1px solid #CBD5E1",
                    borderRadius: "10px",
                    fontSize: "15px",
                    boxSizing: "border-box",
                  }}
                />
              </label>

              {/* Pills per dose */}
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "7px",
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  Pills Per Dose
                </span>

                <input
                  type="number"
                  min="1"
                  value={pillsPerDose}
                  onChange={(e) =>
                    setPillsPerDose(e.target.value)
                  }
                  style={{
                    width: "100%",
                    padding: "12px 13px",
                    border: "1px solid #CBD5E1",
                    borderRadius: "10px",
                    fontSize: "15px",
                    boxSizing: "border-box",
                  }}
                />
              </label>
            </div>
          </section>

          {/* Schedule */}
          <section
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderRadius: "18px",
              padding: "26px",
              marginBottom: "20px",
              boxShadow: "0 3px 12px rgba(0, 0, 0, 0.04)",
            }}
          >
            <h2
              style={{
                margin: "0 0 5px",
                fontSize: "21px",
                fontWeight: "700",
              }}
            >
              Schedule
            </h2>

            <p
              style={{
                margin: "0 0 22px",
                color: "#64748B",
                fontSize: "14px",
              }}
            >
              Update when and how often you take it.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "18px",
              }}
            >
              {/* Frequency */}
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "7px",
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  Frequency
                </span>

                <select
                  value={frequency}
                  onChange={(e) =>
                    setFrequency(e.target.value)
                  }
                  style={{
                    width: "100%",
                    padding: "12px 13px",
                    border: "1px solid #CBD5E1",
                    borderRadius: "10px",
                    fontSize: "15px",
                    backgroundColor: "#FFFFFF",
                    boxSizing: "border-box",
                  }}
                >
                  {frequencyOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              {/* Custom hours */}
              {frequency === "Every X hours" && (
                <label
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "7px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    Every How Many Hours?
                  </span>

                  <input
                    type="number"
                    min="1"
                    value={customHours}
                    onChange={(e) =>
                      setCustomHours(e.target.value)
                    }
                    placeholder="Example: 6"
                    style={{
                      width: "100%",
                      padding: "12px 13px",
                      border: "1px solid #CBD5E1",
                      borderRadius: "10px",
                      fontSize: "15px",
                      boxSizing: "border-box",
                    }}
                  />
                </label>
              )}

              {/* Start Date */}
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "7px",
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  Start Date
                </span>

                <input
                  type="date"
                  value={startDate}
                  onChange={(e) =>
                    setStartDate(e.target.value)
                  }
                  style={{
                    width: "100%",
                    padding: "12px 13px",
                    border: "1px solid #CBD5E1",
                    borderRadius: "10px",
                    fontSize: "15px",
                    boxSizing: "border-box",
                  }}
                />
              </label>

              {/* End Date */}
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "7px",
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  End Date
                </span>

                <input
                  type="date"
                  value={endDate}
                  onChange={(e) =>
                    setEndDate(e.target.value)
                  }
                  style={{
                    width: "100%",
                    padding: "12px 13px",
                    border: "1px solid #CBD5E1",
                    borderRadius: "10px",
                    fontSize: "15px",
                    boxSizing: "border-box",
                  }}
                />
              </label>
            </div>
          </section>

          {/* Refill */}
          <section
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderRadius: "18px",
              padding: "26px",
              marginBottom: "20px",
              boxShadow: "0 3px 12px rgba(0, 0, 0, 0.04)",
            }}
          >
            <h2
              style={{
                margin: "0 0 5px",
                fontSize: "21px",
                fontWeight: "700",
              }}
            >
              Refill
            </h2>

            <p
              style={{
                margin: "0 0 22px",
                color: "#64748B",
                fontSize: "14px",
              }}
            >
              Update your refill information.
            </p>

            <div
              style={{
                display: "flex",
                gap: "22px",
                flexWrap: "wrap",
                marginBottom:
                  refillable === "yes" ? "18px" : "0",
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name="refillable"
                  value="yes"
                  checked={refillable === "yes"}
                  onChange={(e) =>
                    setRefillable(e.target.value)
                  }
                />
                <span>Yes, this medication is refillable</span>
              </label>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name="refillable"
                  value="no"
                  checked={refillable === "no"}
                  onChange={(e) =>
                    setRefillable(e.target.value)
                  }
                />
                <span>No</span>
              </label>
            </div>

            {refillable === "yes" && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "18px",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "7px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    Current Pill Quantity
                  </span>

                  <input
                    type="number"
                    min="1"
                    value={pillQuantity}
                    onChange={(e) =>
                      setPillQuantity(e.target.value)
                    }
                    placeholder="Example: 30"
                    style={{
                      width: "100%",
                      padding: "12px 13px",
                      border: "1px solid #CBD5E1",
                      borderRadius: "10px",
                      fontSize: "15px",
                      boxSizing: "border-box",
                    }}
                  />
                </label>

                <label
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "7px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    Refill Reminder
                  </span>

                  <input
                    type="number"
                    min="1"
                    value={refillReminder}
                    onChange={(e) =>
                      setRefillReminder(e.target.value)
                    }
                    placeholder="Days before refill"
                    style={{
                      width: "100%",
                      padding: "12px 13px",
                      border: "1px solid #CBD5E1",
                      borderRadius: "10px",
                      fontSize: "15px",
                      boxSizing: "border-box",
                    }}
                  />
                </label>
              </div>
            )}
          </section>

          {/* Instructions */}
          <section
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderRadius: "18px",
              padding: "26px",
              marginBottom: "20px",
              boxShadow: "0 3px 12px rgba(0, 0, 0, 0.04)",
            }}
          >
            <h2
              style={{
                margin: "0 0 5px",
                fontSize: "21px",
                fontWeight: "700",
              }}
            >
              Instructions & Notes
            </h2>

            <p
              style={{
                margin: "0 0 22px",
                color: "#64748B",
                fontSize: "14px",
              }}
            >
              Update any instructions or notes you want to
              remember.
            </p>

            <div
              style={{
                display: "grid",
                gap: "18px",
              }}
            >
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "7px",
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  Instructions
                </span>

                <textarea
                  value={instructions}
                  onChange={(e) =>
                    setInstructions(e.target.value)
                  }
                  rows="3"
                  placeholder="How should you take this medication?"
                  style={{
                    width: "100%",
                    padding: "12px 13px",
                    border: "1px solid #CBD5E1",
                    borderRadius: "10px",
                    fontSize: "15px",
                    resize: "vertical",
                    boxSizing: "border-box",
                  }}
                />
              </label>

              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "7px",
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  Avoid
                </span>

                <textarea
                  value={avoidNotes}
                  onChange={(e) =>
                    setAvoidNotes(e.target.value)
                  }
                  rows="3"
                  placeholder="Anything to avoid?"
                  style={{
                    width: "100%",
                    padding: "12px 13px",
                    border: "1px solid #CBD5E1",
                    borderRadius: "10px",
                    fontSize: "15px",
                    resize: "vertical",
                    boxSizing: "border-box",
                  }}
                />
              </label>

              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "7px",
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  Storage
                </span>

                <textarea
                  value={storageNotes}
                  onChange={(e) =>
                    setStorageNotes(e.target.value)
                  }
                  rows="3"
                  placeholder="How should it be stored?"
                  style={{
                    width: "100%",
                    padding: "12px 13px",
                    border: "1px solid #CBD5E1",
                    borderRadius: "10px",
                    fontSize: "15px",
                    resize: "vertical",
                    boxSizing: "border-box",
                  }}
                />
              </label>
            </div>
          </section>

          {/* Action Bar */}
          <div
            style={{
              position: "sticky",
              bottom: "20px",
              zIndex: 10,
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
              backgroundColor: "rgba(247, 249, 252, 0.96)",
              padding: "14px 0",
              backdropFilter: "blur(8px)",
            }}
          >
            <button
              type="button"
              onClick={cancelEdit}
              style={{
                padding: "12px 20px",
                borderRadius: "11px",
                border: "1px solid #CBD5E1",
                backgroundColor: "#FFFFFF",
                color: "#111827",
                fontSize: "15px",
                fontWeight: "600",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              style={{
                padding: "12px 22px",
                borderRadius: "11px",
                border: "none",
                backgroundColor: "#2563EB",
                color: "#FFFFFF",
                fontSize: "15px",
                fontWeight: "700",
                cursor: "pointer",
                fontFamily: "inherit",
                boxShadow:
                  "0 4px 10px rgba(37, 99, 235, 0.2)",
              }}
            >
              Save Changes
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default EditMedication;