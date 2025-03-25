import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, subDays, addDays, subMonths, addMonths, isSameMonth } from "date-fns";
import "../styles/DashboardRightPanel.css";
import CreateMeeting from "../pages/CreateMeeting";
import Template1 from "../components/template1";

const generateTimeSlots = (meetings) => {
  const slots = [];
  const currentHour = new Date().getHours();
  const startHour = Math.max(0, currentHour - 2); // Start 2 hours before current time
  let endHour = Math.min(23, currentHour + 3); // End 3 hours after current time

  for (let i = startHour; i <= endHour; i++) {
    slots.push(i % 24);
  }

  // Ensure at least 6 slots are shown
  while (slots.length < 6) {
    slots.push((endHour + 1) % 24);
    endHour++;
  }

  return slots;
};

const formatTime = (time) => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  return `${hour % 12 || 12}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
};

const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const DashboardRightPanel = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date()); // Set to today's date
  const [meetings] = useState([
    {
      id: 1,
      title: 'BOS Meeting',
      date: new Date(2025, 0, 28),
      startTime: '15:00',
      endTime: '16:00',
      color: 'bg-purple-200',
      borderColor: 'border-purple-500'
    },
    {
      id: 2,
      title: 'Grievance Meeting',
      date: new Date(2025, 0, 28),
      startTime: '13:00',
      endTime: '14:00',
      color: 'bg-orange-200',
      borderColor: 'border-orange-500'
    }
  ]);
  const [showTemplateOverlay, setShowTemplateOverlay] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [showCreateMeeting, setShowCreateMeeting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedDate(new Date());
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

const calculatePosition = (meeting) => {
  const slots = generateTimeSlots(meetings);
  const startHour = slots[0];
  
  // Convert times to minutes from start of timeline
  const [startH, startM] = meeting.startTime.split(':').map(Number);
  const [endH, endM] = meeting.endTime.split(':').map(Number);
  
  const startMinutes = ((startH - startHour) * 60) + startM;
  const endMinutes = ((endH - startHour) * 60) + endM;
  
  // Convert to percentages
  const top = (startMinutes / 360) * 100 + 10;  // 360 = 6 hours * 60 minutes
  const height = ((endMinutes - startMinutes) / 360) * 100;
  
  return { top, height };
};

const calculateCurrentTimePosition = () => {
  const now = new Date();
  const slots = generateTimeSlots(meetings);
  const startHour = slots[0];
  
  // Calculate total minutes from start of the timeline
  const currentHourDiff = now.getHours() - startHour;
  const totalMinutes = (currentHourDiff * 60) + now.getMinutes();
  
  // Each hour is 60px, so multiply by 60 to get total height
  const totalHeight = 6 * 60; // 6 hours * 60px
  
  // Determine if the current time is within the first half or the second half of the hour
  if (now.getMinutes() < 30) {
    // Place at the bottom of the current hour box
    return (totalMinutes / totalHeight) * 100 +12;
  } else {
    // Place at the top of the next hour box
    return ((currentHourDiff + 1) * 60) / totalHeight * 100 + 5 ;
  }
};

  const groupMeetingsByTime = (meetings) => {
    const grouped = [];
    meetings.forEach(meeting => {
      const overlappingGroup = grouped.find(group =>
        group.some(m => 
          (meeting.startTime < m.endTime && meeting.endTime > m.startTime)
        )
      );
      if (overlappingGroup) {
        overlappingGroup.push(meeting);
      } else {
        grouped.push([meeting]);
      }
    });
    return grouped;
  };

  const groupedMeetings = groupMeetingsByTime(meetings);

  const getCalendarDays = (date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const startDay = start.getDay();
    const endDay = end.getDay();

    const daysBefore = Array.from({ length: startDay }, (_, i) => subDays(start, startDay - i));
    const daysInMonth = eachDayOfInterval({ start, end });
    const daysAfter = Array.from({ length: 6 - endDay }, (_, i) => addDays(end, i + 1));

    return [...daysBefore, ...daysInMonth, ...daysAfter];
  };

  const handlePrevMonth = () => {
    setSelectedDate(subMonths(selectedDate, 1));
  };

  const handleNextMonth = () => {
    setSelectedDate(addMonths(selectedDate, 1));
  };

  const handleCreateMeetingClick = () => {
    setShowCreateMeeting(true);
  };

  const handleTemplateSelect = (selectedTemplate) => {
    setShowCreateMeeting(false);
    navigate('/template1', { state: { selectedTemplate } });
  };

  const handleViewMoreCalendar = () => {
    navigate('/calendar'); // This will navigate to the calendar page
  };

  const days = getCalendarDays(selectedDate);

  return (
    <>
      {/* Template Selection Overlay */}
      {showCreateMeeting && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999
          }}
        >
          <CreateMeeting
            onUseTemplate={handleTemplateSelect}
            onClose={() => setShowCreateMeeting(false)}
          />
        </div>
      )}

      <div className="right-panel">
        {/* Create Meeting Button */}
        <div className="create-meeting-section">
          <button className="create-meeting-button" onClick={handleCreateMeetingClick}>
            <i className="fi fi-rr-plus"></i>
            Create Meeting
          </button>
        </div>

        {/* Calendar Section */}
        <div className="calendar-section">
          <div className="calendar">
            <div className="calendar-header">
              <h2>{format(selectedDate, 'dd MMM yyyy')}</h2>
              <div className="calendar-actions">
                <div className="calendar-nav">
                  <button onClick={handlePrevMonth}><i className="fi fi-rr-caret-left"></i></button>
                  <button onClick={handleNextMonth}><i className="fi fi-rr-caret-right"></i></button>
                </div>
                <button className="view-more-btn" onClick={handleViewMoreCalendar}>
                  <i className="fi fi-rr-calendar"></i>
                  <span>View More</span>
                </button>
              </div>
            </div>
            <div className="calendar-grid">
              {weekDays.map(day => (
                <div key={day} className="calendar-day-header">{day}</div>
              ))}
              {days.map(day => (
                <div
                  key={day.toString()}
                  className={`calendar-day ${
                    !isSameMonth(day, selectedDate) ? 'different-month' : ''
                  } ${isSameDay(day, selectedDate) ? 'selected' : ''}`}
                  onClick={() => setSelectedDate(day)}
                >
                  {format(day, 'd')}
                  {meetings.some(meeting => isSameDay(meeting.date, day)) && (
                    <div className="meeting-indicator" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Schedule Section */}
        <div className="schedule-section">
          <h3>Today's Schedule</h3>
          <div className="schedule">
            {generateTimeSlots(meetings).map(hour => (
              <div className="time-slot" key={hour}>
                <div className="time">{`${hour}:00`}</div>
                <div className="line"></div>
              </div>
            ))}
            <div
              className="current-time"
              style={{ top: `${calculateCurrentTimePosition()}%` }}
            >
              <span className="current-time-dot"></span>
            </div>
            {groupedMeetings.map((group, groupIndex) => 
              group.map((meeting, index) => {
                const { top, height } = calculatePosition(meeting);
                return (
                  <MeetingCard
                    key={meeting.id}
                    meeting={meeting}
                    top={top}
                    height={height}
                    formatTime={formatTime}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const MeetingCard = ({ meeting, top, height, formatTime }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      className={`event ${meeting.title.toLowerCase().replace(' ', '-')} ${isHovered ? 'hovered' : ''}`}
      style={{
        top: `${top}%`,
        height: `${height}%`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <strong>{meeting.title}</strong>
      <div>{`${formatTime(meeting.startTime)} - ${formatTime(meeting.endTime)}`}</div>
    </div>
  );
};

export default DashboardRightPanel;