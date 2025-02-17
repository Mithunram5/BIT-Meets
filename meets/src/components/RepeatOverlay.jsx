import React, { useState } from "react";
import "../styles/RepeatOverlay.css";

const RepeatOverlay = ({ isOpen, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState("Do not repeat");
  const [selectedDays, setSelectedDays] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const tabs = ["Do not repeat", "Every day", "Every week", "Every month", "Custom"];
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const toggleDay = (day) => {
    setSelectedDays((prevDays) =>
      prevDays.includes(day) ? prevDays.filter((d) => d !== day) : [...prevDays, day]
    );
  };

  const handleSave = () => {
    const details = {
      startDate,
      endDate,
      days: selectedDays,
    };
    onSave(activeTab, details); // Pass the activeTab and details as the repeat option
  };

  if (!isOpen) return null;

  return (
    <div className="repeat-overlay-container">
      <div className="repeat-overlay">
        <div className="repeat-overlay-header">
          <h3>Repeat</h3>
          <button className="add-person-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="repeat-overlay-tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`repeat-overlay-tab-btn ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="repeat-overlay-content">
          {activeTab === "Do not repeat" && <p>No repeat options selected.</p>}
          {activeTab === "Every day" && (
            <div className="repeat-overlay-form-group">
              <label>Starting from</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              <label>For no of days</label>
              <input type="number" defaultValue="4" />
            </div>
          )}
          {activeTab === "Every week" && (
            <div className="repeat-overlay-form-group">
              <label>Starting from</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              
              <label>For no of weeks</label>
              <input type="number" defaultValue="4" />
            </div>
          )}
          {activeTab === "Every month" && (
            <div className="repeat-overlay-form-group">
              <label>Starting from</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              
              <label>For no of months</label>
              <input type="number" defaultValue="4" />
            </div>
          )}
          {activeTab === "Custom" && (
            <div className="repeat-overlay-form-group">
              <label>Starting from</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              
              <label>Repeat every weeks</label>
              <input type="number" defaultValue="4" />
              <label>On</label>
              <div className="repeat-overlay-days">
                {daysOfWeek.map((day) => (
                  <span
                    key={day}
                    className={`repeat-overlay-day ${selectedDays.includes(day) ? "selected" : ""}`}
                    onClick={() => toggleDay(day)}
                  >
                    {day}
                  </span>
                ))}
              </div>
              <label>Series end</label>
              <div className="repeat-overlay-series-end">
                <div>
                  <input type="radio" id="never" name="end" defaultChecked />
                  <label htmlFor="never">Never</label>
                </div>
                <div>
                  <input type="radio" id="appearances" name="end" />
                  <label htmlFor="appearances">After appearances</label>
                  <input type="number" defaultValue="4" />
                </div>
                <div>
                  <input type="radio" id="endOn" name="end" />
                  <label htmlFor="endOn">End on</label>
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="repeat-overlay-footer">
          <button className="cm-cancel-btn" onClick={onClose}>Cancel</button>
          <button className="btn repeat-overlay-save-btn" onClick={handleSave}>Save & Next</button>
        </div>
      </div>
    </div>
  );
};

export default RepeatOverlay;
