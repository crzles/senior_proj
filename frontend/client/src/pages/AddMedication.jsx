import { useState } from "react";

function AddMedication() {
  // -----------------------------
  // Medication information
  // -----------------------------
  const [medicationName, setMedicationName] = useState("");
  const [medicationType, setMedicationType] = useState("Medication");
  const [dosage, setDosage] = useState("");
  const [pillsPerDose, setPillsPerDose] = useState("1");

  // -----------------------------
  // Schedule
  // -----------------------------
  const [frequency, setFrequency] = useState("Once daily");
  const [reminderTimes, setReminderTimes] = useState(["08:00"]);

  const [hoursInterval, setHoursInterval] = useState("6");
  const [daysInterval, setDaysInterval] = useState("2");
  const [firstDoseTime, setFirstDoseTime] = useState("08:00");

  const [weeklyDay, setWeeklyDay] = useState("Monday");

  const [customDays, setCustomDays] = useState([]);
  const [customTimes, setCustomTimes] = useState(["08:00"]);

  // -----------------------------
  // Dates
  // -----------------------------
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [noEndDate, setNoEndDate] = useState(true);
  const [endDate, setEndDate] = useState("");

  // -----------------------------
  // Refills
  // -----------------------------
  const [refillEnabled, setRefillEnabled] = useState(false);
  const [pillQuantity, setPillQuantity] = useState("");
  const [refillReminder, setRefillReminder] = useState("5");

  // -----------------------------
  // Additional information
  // -----------------------------
  const [instructions, setInstructions] = useState("");
  const [avoidNotes, setAvoidNotes] = useState("");
  const [storageNotes, setStorageNotes] = useState("");

  const [searchOpen, setSearchOpen] = useState(false);

  // Temporary sample medication list.
  // This will later be replaced with the backend drug search.
  const medicationSuggestions = [
    "Ibuprofen",
    "Acetaminophen",
    "Amoxicillin",
    "Cetirizine",
    "Loratadine",
    "Vitamin D",
    "Vitamin C",
    "Magnesium",
    "Iron",
  ];

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // -----------------------------
  // Shared styles
  // -----------------------------
  const colors = {
    blue: "#2563EB",
    darkBlue: "#1D4ED8",
    background: "#F9FAFB",
    text: "#111827",
    secondaryText: "#6B7280",
    label: "#374151",
    border: "#D1D5DB",
    white: "#FFFFFF",
    greenBackground: "#ECFDF5",
    greenBorder: "#A7F3D0",
    greenText: "#047857",
  };

  const inputStyle = {
    width: "100%",
    padding: "13px 15px",
    border: `1px solid ${colors.border}`,
    borderRadius: "12px",
    fontSize: "15px",
    backgroundColor: colors.white,
    color: colors.text,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
  };

  const sectionStyle = {
    backgroundColor: colors.white,
    borderRadius: "18px",
    padding: "24px",
    marginBottom: "16px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
  };

  const sectionHeaderStyle = {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    marginBottom: "22px",
  };

  const sectionNumberStyle = {
    width: "30px",
    height: "30px",
    minWidth: "30px",
    borderRadius: "50%",
    backgroundColor: colors.blue,
    color: colors.white,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "14px",
  };

  const sectionTitleStyle = {
    margin: "2px 0 4px",
    fontSize: "19px",
    fontWeight: "700",
    color: colors.text,
  };

  const labelStyle = {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    color: colors.label,
    marginBottom: "8px",
  };

  const descriptionStyle = {
    margin: 0,
    fontSize: "13px",
    color: colors.secondaryText,
    lineHeight: "1.5",
  };

  // -----------------------------
  // Schedule functions
  // -----------------------------
  function updateFrequency(newFrequency) {
    setFrequency(newFrequency);

    if (newFrequency === "Once daily") {
      setReminderTimes(["08:00"]);
    } else if (newFrequency === "Twice daily") {
      setReminderTimes(["08:00", "20:00"]);
    } else if (newFrequency === "3 times daily") {
      setReminderTimes(["08:00", "14:00", "20:00"]);
    } else if (newFrequency === "4 times daily") {
      setReminderTimes(["08:00", "12:00", "16:00", "20:00"]);
    } else if (newFrequency === "Once weekly") {
      setReminderTimes(["08:00"]);
    } else if (newFrequency === "Every X hours") {
      setReminderTimes([]);
    } else if (newFrequency === "Every X days") {
      setReminderTimes([]);
    } else if (newFrequency === "As needed") {
      setReminderTimes([]);
    } else if (newFrequency === "Custom schedule") {
      setReminderTimes([]);
      setCustomTimes(["08:00"]);
    }
  }

  function updateReminderTime(index, value) {
    const updatedTimes = [...reminderTimes];
    updatedTimes[index] = value;
    setReminderTimes(updatedTimes);
  }

  function updateCustomTime(index, value) {
    const updatedTimes = [...customTimes];
    updatedTimes[index] = value;
    setCustomTimes(updatedTimes);
  }

  function toggleCustomDay(day) {
    if (customDays.includes(day)) {
      setCustomDays(customDays.filter((item) => item !== day));
    } else {
      setCustomDays([...customDays, day]);
    }
  }

  function addCustomTime() {
    setCustomTimes([...customTimes, "08:00"]);
  }

  function removeCustomTime(index) {
    if (customTimes.length === 1) {
      return;
    }

    setCustomTimes(customTimes.filter((_, i) => i !== index));
  }

  // -----------------------------
  // Submit
  // -----------------------------
  function handleSubmit(event) {
    event.preventDefault();

    if (!medicationName.trim()) {
      alert("Please enter a medication name.");
      return;
    }

    if (!dosage.trim()) {
      alert("Please enter the medication strength.");
      return;
    }

    if (frequency === "Custom schedule" && customDays.length === 0) {
      alert("Please select at least one day for the custom schedule.");
      return;
    }

    if (frequency === "Custom schedule" && customTimes.length === 0) {
      alert("Please add at least one reminder time.");
      return;
    }

    if (!noEndDate && !endDate) {
      alert("Please choose an end date or select No end date.");
      return;
    }

    if (!noEndDate && endDate < startDate) {
      alert("End date cannot be before the start date.");
      return;
    }

    if (refillEnabled && !pillQuantity) {
      alert("Please enter your current pill quantity.");
      return;
    }

    const medicationData = {
      med_name: medicationName.trim(),
      med_type: medicationType,
      dosage: dosage.trim(),
      pills_per_dose: Number(pillsPerDose),

      recurrence: frequency,

      reminder_times:
        frequency === "As needed"
          ? []
          : frequency === "Every X hours"
            ? [
                {
                  interval_hours: Number(hoursInterval),
                  first_dose: firstDoseTime,
                },
              ]
            : frequency === "Every X days"
              ? [
                  {
                    interval_days: Number(daysInterval),
                    first_dose: firstDoseTime,
                  },
                ]
              : frequency === "Once weekly"
                ? [
                    {
                      day: weeklyDay,
                      time: reminderTimes[0],
                    },
                  ]
                : frequency === "Custom schedule"
                  ? [
                      {
                        days: customDays,
                        times: customTimes,
                      },
                    ]
                  : reminderTimes,

      start_date: startDate,
      end_date: noEndDate ? null : endDate,

      is_refillable: refillEnabled,
      pill_qty:
        refillEnabled && pillQuantity
          ? Number(pillQuantity)
          : null,

      refill_reminder:
        refillEnabled && refillReminder
          ? Number(refillReminder)
          : null,

      requirements: instructions.trim(),
      avoid_notes: avoidNotes.trim(),
      storage_notes: storageNotes.trim(),
    };

    // Temporary frontend behavior.
    // This will later be replaced with the POST /medications request.
    console.log(
      "Medication to send to backend:",
      medicationData
    );

    alert(`${medicationName} has been added!`);

    window.location.href = "/";
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: colors.background,
        color: colors.text,
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        paddingBottom: "88px",
      }}
    >
      {/* =========================
          HEADER
      ========================== */}
      <header
        style={{
          backgroundColor: colors.blue,
          color: colors.white,
          padding: "22px 24px 26px",
          boxShadow:
            "0 2px 8px rgba(37, 99, 235, 0.18)",
        }}
      >
        <div
          style={{
            maxWidth: "760px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <button
            type="button"
            aria-label="Back to medications"
            onClick={() => (window.location.href = "/")}
            style={{
              width: "42px",
              height: "42px",
              minWidth: "42px",
              borderRadius: "50%",
              border: "none",
              backgroundColor:
                "rgba(255, 255, 255, 0.18)",
              color: colors.white,
              fontSize: "22px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ←
          </button>

          <div>
            <div
              style={{
                fontSize: "14px",
                fontWeight: "600",
                opacity: 0.9,
                marginBottom: "3px",
              }}
            >
              PillBug
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "25px",
                lineHeight: "1.2",
                fontWeight: "700",
                color: colors.white,
              }}
            >
              Add Medication
            </h1>

            <p
              style={{
                margin: "5px 0 0",
                fontSize: "13px",
                color: "rgba(255, 255, 255, 0.82)",
              }}
            >
              Add a medication or supplement to your routine
            </p>
          </div>
        </div>
      </header>

      {/* =========================
          MAIN FORM
      ========================== */}
      <main
        style={{
          maxWidth: "760px",
          margin: "20px auto",
          padding: "0 16px",
        }}
      >
        <form onSubmit={handleSubmit}>
          {/* =========================
              1. MEDICATION
          ========================== */}
          <section style={sectionStyle}>
            <div style={sectionHeaderStyle}>
              <div style={sectionNumberStyle}>1</div>

              <div>
                <h2 style={sectionTitleStyle}>
                  Medication
                </h2>

                <p style={descriptionStyle}>
                  Search for a medication or supplement
                </p>
              </div>
            </div>

            <div style={{ position: "relative" }}>
              <label style={labelStyle}>
                Medication name
              </label>

              <input
                type="text"
                value={medicationName}
                onChange={(event) => {
                  setMedicationName(event.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
                onBlur={() =>
                  setTimeout(
                    () => setSearchOpen(false),
                    150
                  )
                }
                placeholder="Search medication or supplement..."
                style={inputStyle}
              />

              {searchOpen &&
                medicationName.trim() !== "" && (
                  <div
                    style={{
                      position: "absolute",
                      top: "77px",
                      left: 0,
                      right: 0,
                      backgroundColor: colors.white,
                      border: "1px solid #E5E7EB",
                      borderRadius: "12px",
                      boxShadow:
                        "0 8px 20px rgba(0, 0, 0, 0.08)",
                      zIndex: 10,
                      overflow: "hidden",
                    }}
                  >
                    {medicationSuggestions
                      .filter((item) =>
                        item
                          .toLowerCase()
                          .includes(
                            medicationName.toLowerCase()
                          )
                      )
                      .map((item) => (
                        <button
                          key={item}
                          type="button"
                          onMouseDown={() => {
                            setMedicationName(item);
                            setSearchOpen(false);
                          }}
                          style={{
                            width: "100%",
                            padding: "12px 15px",
                            textAlign: "left",
                            border: "none",
                            borderBottom:
                              "1px solid #F3F4F6",
                            backgroundColor:
                              colors.white,
                            color: colors.text,
                            cursor: "pointer",
                            fontSize: "14px",
                            fontFamily: "inherit",
                          }}
                        >
                          {item}
                        </button>
                      ))}

                    <button
                      type="button"
                      onMouseDown={() =>
                        setSearchOpen(false)
                      }
                      style={{
                        width: "100%",
                        padding: "12px 15px",
                        textAlign: "left",
                        border: "none",
                        backgroundColor: colors.background,
                        color: colors.blue,
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "14px",
                        fontFamily: "inherit",
                      }}
                    >
                      + Add my own
                    </button>
                  </div>
                )}
            </div>

            <div style={{ marginTop: "20px" }}>
              <label style={labelStyle}>Category</label>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                }}
              >
                {["Medication", "Supplement"].map(
                  (type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() =>
                        setMedicationType(type)
                      }
                      style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: "12px",
                        border:
                          medicationType === type
                            ? `1px solid ${colors.blue}`
                            : `1px solid ${colors.border}`,
                        backgroundColor:
                          medicationType === type
                            ? colors.blue
                            : colors.white,
                        color:
                          medicationType === type
                            ? colors.white
                            : colors.label,
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      {type}
                    </button>
                  )
                )}
              </div>
            </div>
          </section>

          {/* =========================
              2. DOSE
          ========================== */}
          <section style={sectionStyle}>
            <div style={sectionHeaderStyle}>
              <div style={sectionNumberStyle}>2</div>

              <div>
                <h2 style={sectionTitleStyle}>
                  Dose
                </h2>

                <p style={descriptionStyle}>
                  Enter the strength and amount you take
                </p>
              </div>
            </div>

            <div style={{ marginBottom: "18px" }}>
              <label style={labelStyle}>
                Dosage strength
              </label>

              <input
                type="text"
                value={dosage}
                onChange={(event) =>
                  setDosage(event.target.value)
                }
                placeholder="Example: 200 mg"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>
                Quantity per dose
              </label>

              <input
                type="number"
                min="0.01"
                step="0.01"
                value={pillsPerDose}
                onChange={(event) =>
                  setPillsPerDose(event.target.value)
                }
                style={inputStyle}
              />
            </div>
          </section>

          {/* =========================
              3. SCHEDULE
          ========================== */}
          <section style={sectionStyle}>
            <div style={sectionHeaderStyle}>
              <div style={sectionNumberStyle}>3</div>

              <div>
                <h2 style={sectionTitleStyle}>
                  Schedule
                </h2>

                <p style={descriptionStyle}>
                  Choose how often you take it
                </p>
              </div>
            </div>

            <label style={labelStyle}>
              Dosing frequency
            </label>

            <select
              value={frequency}
              onChange={(event) =>
                updateFrequency(event.target.value)
              }
              style={inputStyle}
            >
              <option>Once daily</option>
              <option>Twice daily</option>
              <option>3 times daily</option>
              <option>4 times daily</option>
              <option>Every X hours</option>
              <option>Once weekly</option>
              <option>Every X days</option>
              <option>As needed</option>
              <option>Custom schedule</option>
            </select>

            {/* Standard schedules */}
            {[
              "Once daily",
              "Twice daily",
              "3 times daily",
              "4 times daily",
            ].includes(frequency) && (
              <div style={{ marginTop: "20px" }}>
                <label style={labelStyle}>
                  Reminder time(s)
                </label>

                <div
                  style={{
                    display: "grid",
                    gap: "10px",
                  }}
                >
                  {reminderTimes.map(
                    (time, index) => (
                      <input
                        key={index}
                        type="time"
                        value={time}
                        onChange={(event) =>
                          updateReminderTime(
                            index,
                            event.target.value
                          )
                        }
                        style={inputStyle}
                      />
                    )
                  )}
                </div>
              </div>
            )}

            {/* Every X hours */}
            {frequency === "Every X hours" && (
              <div
                style={{
                  marginTop: "20px",
                  display: "grid",
                  gap: "16px",
                }}
              >
                <div>
                  <label style={labelStyle}>
                    Repeat every how many hours?
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={hoursInterval}
                    onChange={(event) =>
                      setHoursInterval(
                        event.target.value
                      )
                    }
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>
                    First dose time
                  </label>

                  <input
                    type="time"
                    value={firstDoseTime}
                    onChange={(event) =>
                      setFirstDoseTime(
                        event.target.value
                      )
                    }
                    style={inputStyle}
                  />
                </div>
              </div>
            )}

            {/* Once weekly */}
            {frequency === "Once weekly" && (
              <div
                style={{
                  marginTop: "20px",
                  display: "grid",
                  gap: "16px",
                }}
              >
                <div>
                  <label style={labelStyle}>Day</label>

                  <select
                    value={weeklyDay}
                    onChange={(event) =>
                      setWeeklyDay(event.target.value)
                    }
                    style={inputStyle}
                  >
                    {daysOfWeek.map((day) => (
                      <option key={day}>{day}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>
                    Reminder time
                  </label>

                  <input
                    type="time"
                    value={reminderTimes[0]}
                    onChange={(event) =>
                      updateReminderTime(
                        0,
                        event.target.value
                      )
                    }
                    style={inputStyle}
                  />
                </div>
              </div>
            )}

            {/* Every X days */}
            {frequency === "Every X days" && (
              <div
                style={{
                  marginTop: "20px",
                  display: "grid",
                  gap: "16px",
                }}
              >
                <div>
                  <label style={labelStyle}>
                    Repeat every how many days?
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={daysInterval}
                    onChange={(event) =>
                      setDaysInterval(
                        event.target.value
                      )
                    }
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>
                    First dose time
                  </label>

                  <input
                    type="time"
                    value={firstDoseTime}
                    onChange={(event) =>
                      setFirstDoseTime(
                        event.target.value
                      )
                    }
                    style={inputStyle}
                  />
                </div>
              </div>
            )}

            {/* As needed */}
            {frequency === "As needed" && (
              <div
                style={{
                  marginTop: "18px",
                  padding: "14px",
                  borderRadius: "12px",
                  backgroundColor:
                    colors.greenBackground,
                  border: `1px solid ${colors.greenBorder}`,
                  color: colors.greenText,
                  fontSize: "13px",
                  lineHeight: "1.5",
                }}
              >
                This medication does not have a
                recurring reminder schedule. You can
                take it when needed.
              </div>
            )}

            {/* Custom schedule */}
            {frequency === "Custom schedule" && (
              <div style={{ marginTop: "20px" }}>
                <label style={labelStyle}>
                  Select days
                </label>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                    marginBottom: "20px",
                  }}
                >
                  {daysOfWeek.map((day) => {
                    const selected =
                      customDays.includes(day);

                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() =>
                          toggleCustomDay(day)
                        }
                        style={{
                          padding: "9px 12px",
                          borderRadius: "10px",
                          border: selected
                            ? `1px solid ${colors.blue}`
                            : `1px solid ${colors.border}`,
                          backgroundColor: selected
                            ? colors.blue
                            : colors.white,
                          color: selected
                            ? colors.white
                            : colors.label,
                          fontSize: "13px",
                          fontWeight: "600",
                          cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                      >
                        {day.slice(0, 3)}
                      </button>
                    );
                  })}
                </div>

                <label style={labelStyle}>
                  Reminder times
                </label>

                <div
                  style={{
                    display: "grid",
                    gap: "10px",
                  }}
                >
                  {customTimes.map(
                    (time, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          gap: "8px",
                        }}
                      >
                        <input
                          type="time"
                          value={time}
                          onChange={(event) =>
                            updateCustomTime(
                              index,
                              event.target.value
                            )
                          }
                          style={{
                            ...inputStyle,
                            flex: 1,
                          }}
                        />

                        {customTimes.length > 1 && (
                          <button
                            type="button"
                            aria-label="Remove reminder time"
                            onClick={() =>
                              removeCustomTime(index)
                            }
                            style={{
                              width: "45px",
                              border: `1px solid ${colors.border}`,
                              borderRadius: "12px",
                              backgroundColor:
                                colors.white,
                              color: colors.secondaryText,
                              cursor: "pointer",
                              fontSize: "20px",
                            }}
                          >
                            ×
                          </button>
                        )}
                      </div>
                    )
                  )}
                </div>

                <button
                  type="button"
                  onClick={addCustomTime}
                  style={{
                    marginTop: "12px",
                    border: "none",
                    backgroundColor: "transparent",
                    color: colors.blue,
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    padding: 0,
                    fontFamily: "inherit",
                  }}
                >
                  + Add another time
                </button>
              </div>
            )}
          </section>

          {/* =========================
              4. DATES
          ========================== */}
          <section style={sectionStyle}>
            <div style={sectionHeaderStyle}>
              <div style={sectionNumberStyle}>4</div>

              <div>
                <h2 style={sectionTitleStyle}>
                  Dates
                </h2>

                <p style={descriptionStyle}>
                  Set when you will start and stop taking it
                </p>
              </div>
            </div>

            <div style={{ marginBottom: "18px" }}>
              <label style={labelStyle}>
                Start date
              </label>

              <input
                type="date"
                value={startDate}
                onChange={(event) =>
                  setStartDate(event.target.value)
                }
                style={inputStyle}
              />
            </div>

            <label style={labelStyle}>
              End date
            </label>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: noEndDate ? 0 : "12px",
                fontSize: "14px",
                color: colors.label,
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={noEndDate}
                onChange={(event) =>
                  setNoEndDate(event.target.checked)
                }
                style={{
                  width: "18px",
                  height: "18px",
                  accentColor: colors.blue,
                }}
              />

              No end date
            </label>

            {!noEndDate && (
              <input
                type="date"
                value={endDate}
                min={startDate}
                onChange={(event) =>
                  setEndDate(event.target.value)
                }
                style={inputStyle}
              />
            )}
          </section>

          {/* =========================
              5. REFILLS
          ========================== */}
          <section style={sectionStyle}>
            <div style={sectionHeaderStyle}>
              <div style={sectionNumberStyle}>5</div>

              <div>
                <h2 style={sectionTitleStyle}>
                  Refills
                </h2>

                <p style={descriptionStyle}>
                  Keep track of your medication supply
                </p>
              </div>
            </div>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "14px",
                fontWeight: "600",
                color: colors.label,
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={refillEnabled}
                onChange={(event) =>
                  setRefillEnabled(event.target.checked)
                }
                style={{
                  width: "18px",
                  height: "18px",
                  accentColor: colors.blue,
                }}
              />

              This medication is refillable
            </label>

            {refillEnabled && (
              <div
                style={{
                  marginTop: "18px",
                  display: "grid",
                  gap: "16px",
                }}
              >
                <div>
                  <label style={labelStyle}>
                    Current pill quantity
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={pillQuantity}
                    onChange={(event) =>
                      setPillQuantity(
                        event.target.value
                      )
                    }
                    placeholder="Example: 30"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>
                    Remind me when I have this many pills left
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={refillReminder}
                    onChange={(event) =>
                      setRefillReminder(
                        event.target.value
                      )
                    }
                    style={inputStyle}
                  />
                </div>
              </div>
            )}
          </section>

          {/* =========================
              6. ADDITIONAL INFORMATION
          ========================== */}
          <section style={sectionStyle}>
            <div style={sectionHeaderStyle}>
              <div style={sectionNumberStyle}>6</div>

              <div>
                <h2 style={sectionTitleStyle}>
                  Additional Information
                </h2>

                <p style={descriptionStyle}>
                  Add notes that may be useful later
                </p>
              </div>
            </div>

            <div style={{ marginBottom: "18px" }}>
              <label style={labelStyle}>
                Instructions
              </label>

              <textarea
                value={instructions}
                onChange={(event) =>
                  setInstructions(event.target.value)
                }
                placeholder="Example: Take with food"
                rows="3"
                style={{
                  ...inputStyle,
                  resize: "vertical",
                }}
              />
            </div>

            <div style={{ marginBottom: "18px" }}>
              <label style={labelStyle}>Avoid</label>

              <textarea
                value={avoidNotes}
                onChange={(event) =>
                  setAvoidNotes(event.target.value)
                }
                placeholder="Example: Avoid grapefruit"
                rows="3"
                style={{
                  ...inputStyle,
                  resize: "vertical",
                }}
              />
            </div>

            <div>
              <label style={labelStyle}>
                Storage
              </label>

              <textarea
                value={storageNotes}
                onChange={(event) =>
                  setStorageNotes(event.target.value)
                }
                placeholder="Example: Store at room temperature"
                rows="3"
                style={{
                  ...inputStyle,
                  resize: "vertical",
                }}
              />
            </div>
          </section>
        </form>
      </main>

      {/* =========================
          FIXED ACTION BAR
      ========================== */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: colors.white,
          borderTop: "1px solid #E5E7EB",
          padding: "10px 16px",
          boxShadow:
            "0 -4px 14px rgba(0, 0, 0, 0.06)",
          zIndex: 20,
        }}
      >
        <div
          style={{
            maxWidth: "760px",
            margin: "0 auto",
            display: "flex",
            gap: "10px",
          }}
        >
          <button
            type="button"
            onClick={() => (window.location.href = "/")}
            style={{
              flex: 1,
              padding: "11px 14px",
              borderRadius: "12px",
              border: `1px solid ${colors.border}`,
              backgroundColor: colors.white,
              color: colors.label,
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Cancel
          </button>

          <button
            type="submit"
            onClick={handleSubmit}
            style={{
              flex: 2,
              padding: "11px 14px",
              borderRadius: "12px",
              border: "none",
              backgroundColor: colors.blue,
              color: colors.white,
              fontSize: "14px",
              fontWeight: "700",
              cursor: "pointer",
              fontFamily: "inherit",
              boxShadow:
                "0 3px 8px rgba(37, 99, 235, 0.25)",
            }}
          >
            + Add Medication
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddMedication;