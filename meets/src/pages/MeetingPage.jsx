import React, { useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import '../styles/MeetingPage.css';
import '../styles/PreviewMeeting.css';
import DOMPurify from 'dompurify';

const MeetingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { meetingData } = location.state || {};
  const [activeTab, setActiveTab] = useState('details');
  const [expandedItems, setExpandedItems] = useState({});
  const [meetingStarted, setMeetingStarted] = useState(false);
  const [attendance, setAttendance] = useState({});

  if (!meetingData) {
    return <div>Error: Meeting data not found.</div>;
  }

  const participants = meetingData.participants || {};
  const agenda = meetingData.agenda || [];

  const allMembers = [
    ...Object.entries(participants).flatMap(([role, members]) =>
      members.map((member) => ({ ...member, role }))
    ),
    ...agenda.map((topic) => ({ ...topic.incharge, role: 'Incharge' })).filter(Boolean),
  ];

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = d.getHours() % 12 || 12;
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = d.getHours() >= 12 ? 'PM' : 'AM';
    return `${day} ${month}, ${year} at ${hours}:${minutes} ${ampm}`;
  };

  const getPriorityBadgeStyle = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high priority':
        return { backgroundColor: 'rgb(243, 232, 255)', color: 'rgb(124, 58, 237)' };
      case 'no priority':
        return { backgroundColor: 'rgb(198, 193, 193)', color: 'rgb(100, 100, 100)' }; // Change color for "No priority"
      default:
        return { backgroundColor: 'rgb(243, 232, 255)', color: 'rgb(124, 58, 237)' };
    }
  };

  const toggleExpand = (id) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleAttendance = (memberName, status) => {
    setAttendance((prev) => ({
      ...prev,
      [memberName]: status,
    }));
  };

  const renderTopicItem = (item) => {
    const isExpanded = expandedItems[item.id];

    return (
      <div key={item.id} className="meet-topic-item">
        <div className="meet-topic-header">
          <div className="meet-topic-title-wrapper">
            <div className={`meet-status-indicator ${item.status || 'orange'}`} />
            <h3 className="meet-topic-title">{item.title}</h3>
          </div>
          <div className="meet-action-buttons">
            <div 
              className="meet-icon-button"
              onClick={() => toggleExpand(item.id)}
            >
              {isExpanded ? <i className="fi fi-rr-minus"></i> : <i className="fi fi-rr-plus"></i>}
            </div>
            <div className="meet-icon-button">
              <i className="fi fi-rr-menu-dots-vertical"></i>
            </div>
          </div>
        </div>

        {item.forwarded && (
          <div className="meet-forwarded-message">Forwarded from previous meeting</div>
        )}

        {isExpanded && (
          <div className="meet-expanded-content">
            <p className="meet-description" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.description) }} style={{ textAlign: 'left' }} />
            {item.subtopics && item.subtopics.length > 0 && (
              <div className="meet-nested-topics">
                {item.subtopics.map((subtopic, index) => (
                  <div key={index} className="meet-nested-topic">
                    <div className="meet-nested-topic-header">
                      <h4 className="meet-nested-topic-title">{subtopic.title}</h4>
                    </div>
                    <p className="meet-description" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(subtopic.description) }} style={{ textAlign: 'left' }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="meet-topic-footer">
          <div className="meet-footer-left">
            {item.incharge ? (
              <div className="meet-incharge-info">
                <div className="meet-incharge-avatar">
                  <img 
                    src={item.incharge.avatar || "../assets/profileimage.png"} 
                    alt={item.incharge.name}
                    className="meet-profile-image" 
                  />
                </div>
                <div className="meet-incharge-details">
                  <div className="meet-incharge-name">
                    Incharge: {item.incharge.name}
                  </div>
                  {item.incharge.members && item.incharge.members.length > 0 && (
                    <div className="meet-incharge-members">
                      Members: {item.incharge.members.map(member => member.name).join(', ')}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="meet-no-incharge">
                <div className="meet-incharge-placeholder">
                  <div className="meet-dashed-circle">
                    <i className="fi fi-rr-user"></i>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="meet-footer-right">
            <div className="meet-deadline">
              {item.incharge && item.incharge.deadline ? 
                `Deadline: ${formatDate(item.incharge.deadline)}` : 
                'No deadline set'}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleStartMeeting = () => {
    setMeetingStarted(true);
    setActiveTab('attendance');
  };

  const handleEndMeeting = () => {
    setMeetingStarted(false);
    navigate('/dashboard'); // Navigate back to the dashboard
  };

  return (
    <div className="meet-page-container">
      <div className="meet-page-header">
        <div className="meet-page-header-left">
          <button className="meet-page-back-button" onClick={() => navigate(-1)} style={{ backgroundColor: 'white' }}>
            <FiArrowLeft size={20} />
          </button>
          <div className="meet-page-header-info">
            <h1 className="meet-page-title">{meetingData.title}</h1>
            <p className="meet-page-subtitle">{meetingData.venue}</p>
            <p className="meet-page-subtitle">{formatDate(meetingData.dateTime)}</p>
          </div>
        </div>
        <div className="meet-page-header-right">
          <div className="meet-page-buttons">
            {!meetingStarted && (
              <button className="meet-btn meet-cancel-btn" onClick={() => navigate(-1)}>
                <i className="fi fi-rr-trash"></i> Cancel Meeting
              </button>
            )}
            {meetingStarted ? (
              <button className="meet-btn meet-end-btn" onClick={handleEndMeeting} style={{ backgroundColor: '#FFB547' }}>
                <i className="fi fi-br-confetti"></i> End Meeting
              </button>
            ) : (
              <button className="meet-btn meet-create-btn" onClick={handleStartMeeting}>
                <i className="fi fi-rr-confetti"></i> Start Meeting
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="meet-page-tabs">
        <div
          className={`meet-page-tab ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          <i className="fi fi-rr-id-badge"></i> Details
        </div>
        <div
          className={`meet-page-tab ${activeTab === 'agenda' ? 'active' : ''}`}
          onClick={() => setActiveTab('agenda')}
        >
          <i className="fi fi-rr-chart-tree"></i> Agenda
        </div>
        {meetingStarted && (
          <div
            className={`meet-page-tab ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => setActiveTab('attendance')}
          >
            <i className="fi fi-rr-user-check"></i> Attendance
          </div>
        )}
      </div>

      <div className="meet-page-tab-content">
        {activeTab === 'details' && (
          <div className="meet-details-card">
            <div className="meet-details-header">
              <h1 className="meet-details-title">{meetingData.title}</h1>
              <span className="meet-details-priority-badge" 
                style={getPriorityBadgeStyle(meetingData.priority)}>
                <span className="meet-priority-dot"></span>
                {meetingData.priority.toUpperCase()}
              </span>
            </div>

            <div className="meet-details-grid">
              <div className="meet-details-item">
                <h2>VENUE</h2>
                <p>{meetingData.venue}</p>
              </div>
              <div className="meet-details-item">
                <h2>CREATED DATE</h2>
                <p>{formatDate(new Date())}</p>
              </div>
              <div className="meet-details-item">
                <h2>DUE DATE</h2>
                <p>{formatDate(meetingData.dateTime)}</p>
              </div>
              <div className="meet-details-item">
                <h2>REPEAT</h2>
                <p>{meetingData.repeatOption || 'None'}</p>
              </div>
            </div>

            <div className="meet-details-description">
              <h2>Description</h2>
              <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(meetingData.description) }} />
            </div>

            <div className="meet-members">
              <div className="meet-section-header">
                <h2>Members</h2>
                <span className="meet-count">
                  ({Object.values(participants).flat().length + agenda.filter(topic => topic.incharge).length})
                </span>
              </div>
              <div className="meet-members-list">
                {Object.entries(participants).map(([role, members]) =>
                  members.map((member, index) => (
                    <div key={index} className="meet-member-card">
                      <div className="meet-member-info">
                        <div className="meet-avatar">
                          <i className="fi fi-rr-user"></i>
                        </div>
                        <div className="meet-member-details">
                          <h3>{member.name}</h3>
                          <p>{member.role}</p>
                        </div>
                      </div>
                      <span className="meet-member-badge">
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </span>
                    </div>
                  ))
                )}
                {agenda.map((topic) =>
                  topic.incharge ? (
                    <div key={topic.incharge.id} className="meet-member-card">
                      <div className="meet-member-info">
                        <div className="meet-avatar">
                          <i className="fi fi-rr-user"></i>
                        </div>
                        <div className="meet-member-details">
                          <h3>{topic.incharge.name}</h3>
                          <p>Incharge</p>
                        </div>
                      </div>
                      <span className="meet-member-badge">
                        Incharge
                      </span>
                    </div>
                  ) : null
                )}
              </div>
            </div>
          </div>
        )}
        {activeTab === 'agenda' && (
          <div className="meet-agenda">
            <div className="meet-section-header">
              <h2>Topics to Discuss</h2>
              <span className="meet-count">({agenda.length})</span>
            </div>
            <div className="meet-topics-list">
              {agenda.map((topic, index) => renderTopicItem(topic))}
            </div>
          </div>
        )}
        {activeTab === 'attendance' && (
          <div className="meet-attendance-container">
            <div className="meet-attendance-header">
              <div className="meet-attendance-title">
                Members ({allMembers.length})
              </div>
            </div>
            <div className="meet-attendance-list">
              {allMembers.map((member) => (
                <div className="meet-attendance-row" key={member.name}>
                  <div className="meet-attendance-info">
                    <img 
                      className="meet-attendance-avatar" 
                      alt={member.name} 
                      src={member.avatar || "https://placehold.co/50x50"} 
                    />
                    <div className="meet-attendance-details">
                      <div className="meet-attendance-name">{member.name}</div>
                      <div className="meet-attendance-role">{member.role}</div>
                    </div>
                  </div>
                  <div className="meet-attendance-badge">
                    {member.role}
                  </div>
                  <div className="meet-attendance-status">
                    {attendance[member.name] === 'absent' ? (
                      <button className="meet-attendance-btn meet-attendance-btn-absent">Absent</button>
                    ) : attendance[member.name] === 'present' ? (
                      <button className="meet-attendance-btn meet-attendance-btn-present">Present</button>
                    ) : (
                      <>
                        <button
                          className="meet-attendance-btn meet-attendance-btn-absent"
                          onClick={() => handleAttendance(member.name, 'absent')}
                        >
                          Absent
                        </button>
                        <button
                          className="meet-attendance-btn meet-attendance-btn-present"
                          onClick={() => handleAttendance(member.name, 'present')}
                        >
                          Present
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingPage;
