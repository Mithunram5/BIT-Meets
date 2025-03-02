import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useNavigate } from 'react-router-dom';
import "../styles/Dashboard.css";
import DashboardRightPanel from "../components/DashboardRightPanel";
import noTodoImage from "../assets/nomeetings.png"; // Ensure the path is correct
import profileImage from "../assets/profileimage.png"; // Ensure the path is correct

// Dummy data for meetings
const dummyMeetings = [
  {
    id: 1,
    type: "Info: Create a meeting for grievance",
    title: "BOS Meeting",
    date: dayjs().format("dddd, D MMMM, YYYY"), // Today's date
    duration: "45 min",
    location: "SF Board room",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
    host: "J. David",
    priority: "HIGH PRIORITY",
    deadline: "6 Days Left",
  },
  {
    id: 2,
    type: "Info: Waiting to complete the task",
    title: "Academic Meeting",
    date: dayjs().add(1, 'day').format("dddd, D MMMM, YYYY"), // Tomorrow's date
    duration: "45 min",
    location: "SF Board room",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
    host: "J. David",
    priority: "HIGH PRIORITY",
    progress: "40%",
  },
  {
    id: 3,
    type: "Info: Meeting has a conflict in schedule",
    title: "Grievance Meeting",
    date: dayjs().add(2, 'day').format("dddd, D MMMM, YYYY"), // Day after tomorrow
    duration: "45 min",
    location: "SF Board room",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
    host: "J. David",
    priority: "HIGH PRIORITY",
  },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("Todo");
  const [date, setDate] = useState(dayjs());
  const [meetings, setMeetings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate fetching data from a database
    setTimeout(() => {
      setMeetings(dummyMeetings);
    }, 1000);
  }, []);

  const tabs = ["Todo", "Scheduled", "Draft"];

  const events = [
    { id: 1, title: "BOS Meeting", time: "09:00 AM - 10:00 AM", color: "#007bff" },
    { id: 2, title: "Grievance Meeting", time: "10:00 AM - 11:00 AM", color: "#ffc107" },
  ];

  const filteredMeetings = meetings.filter((meeting) => {
    if (activeTab === "Todo") {
      return dayjs(meeting.date).isSame(dayjs(), 'day');
    } else if (activeTab === "Scheduled") {
      return dayjs(meeting.date).isAfter(dayjs(), 'day');
    } else if (activeTab === "Draft") {
      return false; // No draft meetings available
    } else {
      return meeting;
    }
  });

  const handleMeetingCardClick = (meetingData) => {
    navigate('/meeting', { state: { meetingData } });
  };

  const getNoMeetingsMessage = () => {
    switch (activeTab) {
      case "Todo":
        return "No meetings are scheduled for today.";
      case "Scheduled":
        return "No upcoming meetings are scheduled.";
      case "Draft":
        return "No draft meetings available.";
      default:
        return "";
    }
  };

  return (
    <div className="main-container">
      {/* Left Panel */}
      <div className="left-panel">
        {/* Tabs */}
        <div className="tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab ${activeTab === tab ? "active-tab" : ""}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="search-bar">
          <input type="text" placeholder="Search" />
          <button className="filter-btn">Filter BY</button>
        </div>

        {/* Meeting Cards */}
        {filteredMeetings.length === 0 ? (
          <div className="no-todo-container">
            <img src={noTodoImage} alt="No Todo Works" className="no-todo-image" />
            <p className="no-todo-message">{getNoMeetingsMessage()}</p>
          </div>
        ) : (
          filteredMeetings.map((meeting) => (
            <div key={meeting.id} className="meeting-card" onClick={() => handleMeetingCardClick(meeting)}>
              <div className="meeting-type-banner">
                <i className="fi fi-sr-info"></i> {meeting.type}
              </div>
              <div className="meeting-title">
                <h3>{meeting.title}</h3>
                <span className="priority-tag">
                  <span className="priority-dot"></span>
                  {meeting.priority}
                </span>
              </div>
              <p className="meeting-details">
                <i className="fi fi-rr-calendar"></i> <strong>{meeting.date}</strong> 
                <i className="fi fi-rr-clock"></i> {meeting.duration} 
                <i className="fi fi-rr-marker"></i> {meeting.location}
              </p>
              <p className="meeting-description">{meeting.description}</p>
              <div className="meeting-footer">
                <div className="host-info">
                  <img src={profileImage} alt="Host Avatar" className="host-avatar" /> 
                  <span><strong>HOST : </strong>{meeting.host}</span>
                </div>
                {meeting.deadline && (
                  <span className="deadline-tag">
                    Deadline: {meeting.deadline}
                  </span>
                )}
              </div>
              {meeting.progress && (
                <div className="progress-section">
                  <div className="progress-header">
                    <span>Task Progress: {meeting.progress}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: meeting.progress }}></div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Right Panel */}
      <DashboardRightPanel date={date} setDate={setDate} events={events} />
    </div>
  );
};

export default Dashboard;