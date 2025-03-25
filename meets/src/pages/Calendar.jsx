import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import EventCard from '../components/EventCard.jsx';
import '../styles/Calendar.css';  

const defaultEvents = [
  {
    id: '1',
    title: 'BOS Meeting',
    start: '2025-03-01T09:00:00',
    end: '2025-03-01T10:00:00',
    color: 'blue',
    description: 'Board of Studies meeting to discuss curriculum changes',
    location: 'SF Board room',
    host: 'J. David',
    priority: 'high',
    deadline: '6 Days Left'
  },
  {
    id: '2',
    title: 'Grievance Meeting',
    start: '2025-03-09T09:00:00',
    end: '2025-03-09T10:00:00',
    color: 'purple',
    description: 'Monthly grievance committee meeting',
    location: 'SF Board room',
    host: 'J. David',
    priority: 'high',
    deadline: '6 Days Left'
  },
  {
    id: '3',
    title: 'Grievance Meeting',
    start: '2025-03-10T09:00:00',
    end: '2025-03-10T10:00:00',
    color: 'orange',
    description: 'Follow-up on previous grievance issues',
    location: 'SF Board room',
    host: 'J. David',
    priority: 'high',
    deadline: '6 Days Left'
  },
  {
    id: '4',
    title: 'Academic Meeting',
    start: '2025-03-12T09:00:00',
    end: '2025-03-12T10:00:00',
    color: 'blue',
    description: 'Weekly academic progress review',
    location: 'SF Board room',
    host: 'J. David',
    priority: 'high',
    deadline: '6 Days Left'
  },
  {
    id: '5',
    title: 'Grievance Meeting',
    start: '2025-03-19T09:00:00',
    end: '2025-03-19T10:00:00',
    color: 'orange',
    description: 'Monthly grievance committee meeting',
    location: 'SF Board room',
    host: 'J. David',
    priority: 'high',
    deadline: '6 Days Left'
  },
  {
    id: '6',
    title: 'Grievance Meeting',
    start: '2025-03-20T09:00:00',
    end: '2025-03-20T10:00:00',
    color: 'green',
    description: 'Special grievance meeting for urgent matters',
    location: 'SF Board room',
    host: 'J. David',
    priority: 'high',
    deadline: '6 Days Left'
  },
  {
    id: '7',
    title: 'Academic Meeting',
    start: '2025-03-22T09:00:00',
    end: '2025-03-22T10:00:00',
    color: 'blue',
    description: 'Weekly academic progress review',
    location: 'SF Board room',
    host: 'J. David',
    priority: 'high',
    deadline: '6 Days Left'
  },
  {
    id: '8',
    title: 'Schedule 2+',
    start: '2025-03-17T09:00:00',
    end: '2025-03-17T10:00:00',
    color: 'gray',
    description: 'Planning meeting for next semester schedule',
    location: 'SF Board room',
    host: 'J. David',
    priority: 'high',
    deadline: '6 Days Left'
  }
];

const Calendar = ({ initialDate = new Date(2025, 0, 1), events = defaultEvents }) => {
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [currentView, setCurrentView] = useState('month');
  const [viewDropdownOpen, setViewDropdownOpen] = useState(false);
  
  // Get month name and year
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const monthName = monthNames[currentDate.getMonth()];
  const year = currentDate.getFullYear();
  
  // Navigation functions
  const goToPrevious = () => {
    if (currentView === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else if (currentView === 'week') {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() - 7);
      setCurrentDate(newDate);
    } else if (currentView === 'day') {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() - 1);
      setCurrentDate(newDate);
    } else if (currentView === 'year') {
      setCurrentDate(new Date(currentDate.getFullYear() - 1, 0, 1));
    }
  };
  
  const goToNext = () => {
    if (currentView === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else if (currentView === 'week') {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + 7);
      setCurrentDate(newDate);
    } else if (currentView === 'day') {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + 1);
      setCurrentDate(newDate);
    } else if (currentView === 'year') {
      setCurrentDate(new Date(currentDate.getFullYear() + 1, 0, 1));
    }
  };
  
  // Generate days for month view
  const generateMonthDays = () => {
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    const startingDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();
    
    // Previous month days to show
    const prevMonthDays = [];
    if (startingDayOfWeek > 0) {
      const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
      const prevMonthDaysCount = prevMonth.getDate();
      
      for (let i = prevMonthDaysCount - startingDayOfWeek + 1; i <= prevMonthDaysCount; i++) {
        prevMonthDays.push({
          day: i,
          month: 'prev',
          date: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, i)
        });
      }
    }
    
    // Current month days
    const currentMonthDays = [];
    for (let i = 1; i <= daysInMonth; i++) {
      currentMonthDays.push({
        day: i,
        month: 'current',
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), i)
      });
    }
    
    // Next month days to fill the grid
    const nextMonthDays = [];
    const totalDaysShown = prevMonthDays.length + currentMonthDays.length;
    const remainingDays = 42 - totalDaysShown; // 6 rows of 7 days
    
    for (let i = 1; i <= remainingDays; i++) {
      nextMonthDays.push({
        day: i,
        month: 'next',
        date: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i)
      });
    }
    
    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };
  
  // Get events for a specific day
  const getEventsForDay = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };
  
  // Check if a date is today
  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };
  
  // Generate week days
  const generateWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - day);
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(date.getDate() + i);
      weekDays.push(date);
    }
    
    return weekDays;
  };
  
  // Generate time slots
  const generateTimeSlots = () => {
    const timeSlots = [];
    for (let i = 1; i <= 24; i++) {
      timeSlots.push(`${i % 12 === 0 ? 12 : i % 12} ${i < 12 ? 'AM' : 'PM'}`);
    }
    return timeSlots;
  };
  
  // Generate months for year view
  const generateMonthsForYear = () => {
    const months = [];
    for (let i = 0; i < 12; i++) {
      const firstDayOfMonth = new Date(currentDate.getFullYear(), i, 1);
      const lastDayOfMonth = new Date(currentDate.getFullYear(), i + 1, 0);
      
      const daysInMonth = lastDayOfMonth.getDate();
      const startingDayOfWeek = firstDayOfMonth.getDay();
      
      const monthDays = [];
      
      // Add empty slots for days before the 1st of the month
      for (let j = 0; j < startingDayOfWeek; j++) {
        monthDays.push({ day: null, month: 'prev' });
      }
      
      // Add days of the month
      for (let j = 1; j <= daysInMonth; j++) {
        const date = new Date(currentDate.getFullYear(), i, j);
        monthDays.push({
          day: j,
          month: 'current',
          date,
          isToday: isToday(date),
          hasEvents: getEventsForDay(date).length > 0
        });
      }
      
      months.push({
        name: monthNames[i],
        days: monthDays
      });
    }
    
    return months;
  };
  
  // Render month view
  const renderMonthView = () => {
    const days = generateMonthDays();
    
    return (
      <div>
        <div className="weekdays">
          <div>SUN</div>
          <div>MON</div>
          <div>TUE</div>
          <div>WED</div>
          <div>THU</div>
          <div>FRI</div>
          <div>SAT</div>
        </div>
        <div className="month-view">
          {days.map((day, index) => {
            const dayEvents = getEventsForDay(day.date);
            const isCurrentDay = isToday(day.date);
            
            return (
              <div 
                key={index} 
                className={`day-cell ${day.month !== 'current' ? 'different-month' : ''} ${isCurrentDay ? 'today' : ''}`}
              >
                <div className={`day-number ${isCurrentDay ? 'current-day' : ''}`}>
                  {day.day}
                </div>
                <div className="events">
                  {dayEvents.slice(0, 2).map((event, eventIndex) => (
                    <EventCard key={eventIndex} event={event} index={eventIndex} />
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="more-events">
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  // Render week view
  const renderWeekView = () => {
    const weekDays = generateWeekDays();
    const timeSlots = generateTimeSlots();
    
    return (
      <div>
        <div className="week-header">
          <div className="week-days-header">
            <div className="time-header"></div>
            {weekDays.map((date, index) => {
              const day = date.getDate();
              const isCurrentDay = isToday(date);
              
              return (
                <div key={index} className="day-header">
                  <div className={`day-number ${isCurrentDay ? 'selected' : ''}`}>
                    {day}
                  </div>
                  <div className="day-name">
                    {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][date.getDay()]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="week-view">
          <div className="time-column">
            {timeSlots.map((time, index) => (
              <div key={index} className="time-slot">
                {time}
              </div>
            ))}
          </div>
          <div className="week-grid">
            {weekDays.map((date, dayIndex) => {
              const dayEvents = getEventsForDay(date);
              
              return (
                <div key={dayIndex} className="day-column">
                  {timeSlots.map((_, timeIndex) => {
                    const eventsAtTime = dayEvents.filter(event => {
                      const eventTime = new Date(event.start).getHours();
                      return eventTime === timeIndex + 1;
                    });
                    
                    return (
                      <div key={timeIndex} className="week-cell">
                        {eventsAtTime.map((event, eventIndex) => (
                          <EventCard key={eventIndex} event={event} index={eventIndex} />
                        ))}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };
  
  // Render day view
  const renderDayView = () => {
    const timeSlots = generateTimeSlots();
    const dayEvents = getEventsForDay(currentDate);
    
    return (
      <div>
        <div className="day-header">
          <div className="day-number selected">
            {currentDate.getDate()}
          </div>
          <div className="day-name">
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][currentDate.getDay()]}
          </div>
        </div>
        <div className="day-view">
          <div className="time-column">
            {timeSlots.map((time, index) => (
              <div key={index} className="time-slot">
                {time}
              </div>
            ))}
          </div>
          <div className="day-grid">
            {timeSlots.map((_, timeIndex) => {
              const eventsAtTime = dayEvents.filter(event => {
                const eventTime = new Date(event.start).getHours();
                return eventTime === timeIndex + 1;
              });
              
              return (
                <div key={timeIndex} className="day-cell">
                  {eventsAtTime.map((event, eventIndex) => (
                    <EventCard key={eventIndex} event={event} index={eventIndex} />
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };
  
  // Render year view
  const renderYearView = () => {
    const months = generateMonthsForYear();
    
    return (
      <div className="year-view">
        {months.map((month, monthIndex) => (
          <div key={monthIndex} className="month-card">
            <div className="month-title">{month.name}</div>
            <div className="month-weekdays">
              {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day, i) => (
                <div key={i} className="month-weekday">{day}</div>
              ))}
            </div>
            <div className="month-grid">
              {month.days.map((day, dayIndex) => (
                <div 
                  key={dayIndex} 
                  className={`month-day ${day.month !== 'current' ? 'different-month' : ''} ${day.isToday ? 'today' : ''} ${day.hasEvents ? 'has-events' : ''}`}
                >
                  {day.day}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  // Render view selector
  const renderViewSelector = () => {
    const viewOptions = {
      month: 'Month',
      week: 'Week',
      day: 'Today',
      year: 'Year'
    };
    
    const handleViewChange = (view) => {
      setCurrentView(view);
      setViewDropdownOpen(false);
    };
    
    return (
      <div className="view-selector">
        <button 
          className="view-button"
          onClick={() => setViewDropdownOpen(!viewDropdownOpen)}
        >
          {viewOptions[currentView]}
          <ChevronDown size={16} />
        </button>
        
        {viewDropdownOpen && (
          <div className="view-dropdown">
            {Object.entries(viewOptions).map(([key, label]) => (
              <div 
                key={key} 
                className="view-option"
                onClick={() => handleViewChange(key)}
              >
                {label}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <div className="calendar-nav">
          <button className="nav-button" onClick={goToPrevious}>
            <ChevronLeft size={18} />
          </button>
          <button className="nav-button" onClick={goToNext}>
            <ChevronRight size={18} />
          </button>
        </div>
        <div className="calendar-title">
          {currentView === 'year' ? year : currentView === 'week' || currentView === 'day' ? `${monthName}, ${year}` : `${monthName}, ${year}`}
        </div>
        {renderViewSelector()}
      </div>
      {currentView === 'month' && renderMonthView()}
      {currentView === 'week' && renderWeekView()}
      {currentView === 'day' && renderDayView()}
      {currentView === 'year' && renderYearView()}
    </div>
  );
};

Calendar.propTypes = {
  initialDate: PropTypes.instanceOf(Date),
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      start: PropTypes.string.isRequired,
      end: PropTypes.string.isRequired,
      color: PropTypes.oneOf(['blue', 'green', 'purple', 'orange', 'gray']).isRequired,
      description: PropTypes.string,
      location: PropTypes.string,
      host: PropTypes.string,
      priority: PropTypes.oneOf(['high', 'medium', 'low']),
      deadline: PropTypes.string
    })
  )
};

export default Calendar;