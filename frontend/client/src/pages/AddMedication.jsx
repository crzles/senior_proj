function AddMedication() {
  return (
    <div>
      <h1>Add Medication/Supplement</h1>

      <label>
        Name
        <input type="text" placeholder="Enter name" />
      </label>

      <br />

      <label>
        Medication Type
        <select>
          <option>Select type</option>
          <option>Medication</option>
          <option>Supplement</option>
        </select>
      </label>

      <br />

      <label>
        Dosage
        <input type="text" placeholder="Enter dosage" />
      </label>

      <br />

      <label>
        Re-occurrence
        <input type="text" placeholder="Enter re-occurrence" />
      </label>

      <br />

      <label>
        Treatment Duration
        <input type="text" placeholder="Enter treatment duration" />
      </label>

      <br />

      <p>Refillable?</p>

      <label>
        <input type="radio" name="refillable" />
        Yes
      </label>

      <label>
        <input type="radio" name="refillable" />
        No
      </label>

      <br />

      <label>
        Refill Reminder
        <input
          type="text"
          placeholder="e.g. 2 weeks before refill date"
        />
      </label>

      <br />

      <button>Add Medication</button>
    </div>
  );
}

export default AddMedication;