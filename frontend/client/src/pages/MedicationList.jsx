import { useState } from "react";

function MedicationList() {
  const [medications] = useState([
    {
      id: 1,
      name: "Ibuprofen",
      dosage: "200 mg",
      recurrence: "Every 6 hours",
      pillsPerDose: 1,
      nextDose: "4:00 PM",
    },
    {
      id: 2,
      name: "Vitamin D",
      dosage: "1000 IU",
      recurrence: "Once daily",
      pillsPerDose: 1,
      nextDose: "8:00 PM",
    },
  ]);

  const colors = {
    blue: "#2563EB",
    background: "#F7F9FC",
    text: "#111827",
    secondaryText: "#64748B",
    border: "#E2E8F0",
    white: "#FFFFFF",
    green: "#047857",
    greenBackground: "#ECFDF5",
    lightBlue: "#EFF6FF",
  };

  function goToAddMedication() {
    window.location.href = "/add-medication";
  }

  function goToEditMedication(id) {
    window.location.href = `/edit-medication?id=${id}`;
  }

  function goToMedicationInfo(id) {
    window.location.href = `/medication-info?id=${id}`;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: colors.background,
        color: colors.text,
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        paddingBottom: "100px",
      }}
    >
      {/* Header */}
      <header
        style={{
          backgroundColor: colors.blue,
          color: colors.white,
          padding: "28px 5%",
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
            My Medications
          </h1>

          <p
            style={{
              margin: "7px 0 0",
              fontSize: "16px",
              color: "rgba(255, 255, 255, 0.85)",
            }}
          >
            Keep track of your medications and supplements
          </p>
        </div>
      </header>

      {/* Main */}
      <main
        style={{
          width: "90%",
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "32px 0",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "24px",
            marginBottom: "26px",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "24px",
                fontWeight: "700",
              }}
            >
              Your medications
            </h2>

            <p
              style={{
                margin: "6px 0 0",
                fontSize: "15px",
                color: colors.secondaryText,
              }}
            >
              {medications.length}{" "}
              {medications.length === 1
                ? "medication"
                : "medications"}{" "}
              added
            </p>
          </div>

          <button
            type="button"
            onClick={goToAddMedication}
            style={{
              border: "none",
              borderRadius: "12px",
              backgroundColor: colors.blue,
              color: colors.white,
              padding: "13px 20px",
              fontSize: "15px",
              fontWeight: "700",
              cursor: "pointer",
              fontFamily: "inherit",
              whiteSpace: "nowrap",
              boxShadow:
                "0 4px 10px rgba(37, 99, 235, 0.2)",
            }}
          >
            + Add Medication
          </button>
        </div>

        {medications.length === 0 ? (
          <div
            style={{
              backgroundColor: colors.white,
              borderRadius: "18px",
              padding: "60px 30px",
              textAlign: "center",
              border: `1px solid ${colors.border}`,
              boxShadow:
                "0 2px 10px rgba(0, 0, 0, 0.04)",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                margin: "0 auto 18px",
                borderRadius: "50%",
                backgroundColor: colors.lightBlue,
                color: colors.blue,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
                fontWeight: "700",
              }}
            >
              +
            </div>

            <h2
              style={{
                margin: "0 0 8px",
                fontSize: "21px",
                fontWeight: "700",
              }}
            >
              No medications yet
            </h2>

            <p
              style={{
                margin: "0 auto 22px",
                maxWidth: "450px",
                fontSize: "15px",
                lineHeight: "1.6",
                color: colors.secondaryText,
              }}
            >
              Add your first medication or supplement
              to start tracking your schedule.
            </p>

            <button
              type="button"
              onClick={goToAddMedication}
              style={{
                border: "none",
                borderRadius: "12px",
                backgroundColor: colors.blue,
                color: colors.white,
                padding: "13px 20px",
                fontSize: "15px",
                fontWeight: "700",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              + Add Medication
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(420px, 1fr))",
              gap: "20px",
            }}
          >
            {medications.map((medication) => (
              <article
                key={medication.id}
                style={{
                  backgroundColor: colors.white,
                  borderRadius: "18px",
                  padding: "24px",
                  border: `1px solid ${colors.border}`,
                  boxShadow:
                    "0 3px 12px rgba(0, 0, 0, 0.05)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "16px",
                    marginBottom: "22px",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "23px",
                        fontWeight: "700",
                      }}
                    >
                      {medication.name}
                    </h3>

                    <p
                      style={{
                        margin: "5px 0 0",
                        fontSize: "16px",
                        color: colors.secondaryText,
                      }}
                    >
                      {medication.dosage}
                    </p>
                  </div>

                  <span
                    style={{
                      backgroundColor: colors.greenBackground,
                      color: colors.green,
                      borderRadius: "999px",
                      padding: "7px 12px",
                      fontSize: "13px",
                      fontWeight: "700",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Active
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(2, minmax(0, 1fr))",
                    gap: "14px",
                    marginBottom: "16px",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#F8FAFC",
                      borderRadius: "13px",
                      padding: "16px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "13px",
                        color: colors.secondaryText,
                        marginBottom: "6px",
                      }}
                    >
                      Frequency
                    </div>

                    <div
                      style={{
                        fontSize: "15px",
                        fontWeight: "700",
                      }}
                    >
                      {medication.recurrence}
                    </div>
                  </div>

                  <div
                    style={{
                      backgroundColor: "#F8FAFC",
                      borderRadius: "13px",
                      padding: "16px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "13px",
                        color: colors.secondaryText,
                        marginBottom: "6px",
                      }}
                    >
                      Per dose
                    </div>

                    <div
                      style={{
                        fontSize: "15px",
                        fontWeight: "700",
                      }}
                    >
                      {medication.pillsPerDose}{" "}
                      {medication.pillsPerDose === 1
                        ? "pill"
                        : "pills"}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 16px",
                    borderRadius: "13px",
                    backgroundColor: colors.lightBlue,
                    marginBottom: "18px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      color: colors.secondaryText,
                    }}
                  >
                    Next dose
                  </span>

                  <span
                    style={{
                      fontSize: "16px",
                      fontWeight: "700",
                      color: colors.blue,
                    }}
                  >
                    {medication.nextDose}
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                  }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      goToEditMedication(medication.id)
                    }
                    style={{
                      padding: "12px",
                      borderRadius: "12px",
                      border: `1px solid ${colors.border}`,
                      backgroundColor: colors.white,
                      color: colors.text,
                      fontSize: "15px",
                      fontWeight: "600",
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      goToMedicationInfo(medication.id)
                    }
                    style={{
                      padding: "12px",
                      borderRadius: "12px",
                      border: "none",
                      backgroundColor: colors.blue,
                      color: colors.white,
                      fontSize: "15px",
                      fontWeight: "600",
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    More Info
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: colors.white,
          borderTop: `1px solid ${colors.border}`,
          boxShadow:
            "0 -4px 14px rgba(0, 0, 0, 0.06)",
          zIndex: 20,
        }}
      >
        <div
          style={{
            width: "90%",
            maxWidth: "1400px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "center",
            gap: "clamp(40px, 10vw, 160px)",
            padding: "14px 20px",
          }}
        >
          <button
            type="button"
            onClick={() => (window.location.href = "/")}
            style={{
              border: "none",
              backgroundColor: "transparent",
              color: colors.blue,
              fontSize: "14px",
              fontWeight: "700",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Medications
          </button>

          <button
            type="button"
            style={{
              border: "none",
              backgroundColor: "transparent",
              color: colors.secondaryText,
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Health
          </button>

          <button
            type="button"
            style={{
              border: "none",
              backgroundColor: "transparent",
              color: colors.secondaryText,
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Settings
          </button>
        </div>
      </nav>
    </div>
  );
}

export default MedicationList;