import React, { useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import '../styles/CreateMeeting.css';
import RepeatOverlay from '../components/RepeatOverlay';
import AddPerson from '../components/AddPerson';
import illustration from '../assets/Illustration.png';
import AddTopicModal from '../components/AddTopicModal';
import PreviewMeeting from '../components/PreviewMeeting';
import { Editor } from 'primereact/editor';
import DOMPurify from 'dompurify';

const CreateMeeting = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');
  const [dateTime, setDateTime] = useState('');
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('');
  const [venue, setVenue] = useState('');
  const [repeatOption, setRepeatOption] = useState('');
  const [repeatDetails, setRepeatDetails] = useState({});
  const [selectedMembers, setSelectedMembers] = useState({
    host: [],
    chairman: [],
    universityNominee: [],
    academicCouncilMember: [],
    specialInvitees: [],
    industrialExperts: [],
    alumniMembers: [],
    internalMembers: [],
    studentMembers: [],
    others: [],
  });
  const [showRepeatOverlay, setShowRepeatOverlay] = useState(false);
  const [showAddPersonOverlay, setShowAddPersonOverlay] = useState(false);
  const [currentRole, setCurrentRole] = useState('');
  const [agendaItems, setAgendaItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('topic');
  const [parentTopic, setParentTopic] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});
  const [showPreview, setShowPreview] = useState(false);

  const handleDateTimeChange = (e) => {
    setDateTime(e.target.value);
  };

  const handleRepeatClick = () => {
    setShowRepeatOverlay(true);
  };

  const handleRepeatSave = (option, details) => {
    setRepeatOption(option);
    setRepeatDetails(details);
    setShowRepeatOverlay(false);
  };

  const handleAddPersonClick = (role) => {
    setCurrentRole(role);
    setShowAddPersonOverlay(true);
  };

  const handleAddPersonClose = () => {
    setShowAddPersonOverlay(false);
    setCurrentRole('');
  };

  const handleMemberAdd = (selectedMembers) => {
    setSelectedMembers((prevMembers) => ({
      ...prevMembers,
      [currentRole]: selectedMembers,
    }));
    handleAddPersonClose();
  };

  const handleMemberRemove = (role, memberId) => {
    setSelectedMembers((prevMembers) => ({
      ...prevMembers,
      [role]: prevMembers[role].filter((member) => member.id !== memberId),
    }));
  };

  const capitalizeRole = (role) => role.charAt(0).toUpperCase() + role.slice(1);

  const handleAddNewClick = () => {
    setModalMode('topic');
    setIsModalOpen(true);
  };

  const handleAddSubTopicClick = (parent) => {
    setModalMode('subtopic');
    setParentTopic(parent);
    setIsModalOpen(true);
  };

  const handleAddInchargeClick = (item) => {
    setModalMode('incharge');
    setParentTopic(item);
    setIsModalOpen(true);
  };

  const handleSetDeadlineClick = (item) => {
    setModalMode('deadline');
    setParentTopic(item);
    setIsModalOpen(true);
  };

  const handleSaveTopic = (newItem, mode, parent) => {
    if (mode === 'subtopic' && parent) {
      // Handle subtopic addition
      setAgendaItems((prevItems) =>
        prevItems.map((item) =>
          item.id === parent.id
            ? { ...item, subtopics: [...(item.subtopics || []), newItem] }
            : item
        )
      );
    } else if (mode === 'incharge' || mode === 'deadline') {
      // Update incharge or deadline for existing topic
      setAgendaItems((prevItems) =>
        prevItems.map((item) =>
          item.id === parent.id
            ? {
                ...item,
                incharge: {
                  ...(item.incharge || {}),
                  ...newItem.incharge
                }
              }
            : item
        )
      );
    } else {
      // Add new topic
      setAgendaItems((prevItems) => [...prevItems, newItem]);
    }
    setIsModalOpen(false);
  };

  const getRepeatLabel = () => {
    if (!repeatOption) return 'Select repeat';
    let label = `Repeat Option: ${repeatOption}`;
    if (repeatDetails.startDate) label += `, Start Date: ${repeatDetails.startDate}`;
    if (repeatOption === 'Custom' && repeatDetails.endDate) label += `, Series End: ${repeatDetails.endDate}`;
    if (repeatDetails.days && repeatDetails.days.length > 0) label += `, Days: ${repeatDetails.days.join(', ')}`;
    return label;
  };

  const TagLabel = ({ label, onClose }) => {
    return (
      <div className="cm-tag-label">
        <span className="cm-label-text">{label}</span>
        <button className="cm-close-button" onClick={(e) => { e.stopPropagation(); onClose(); }}>
          &#x2716; {/* Unicode for the "X" symbol */}
        </button>
      </div>
    );
  };

  const toggleExpand = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };  

  const renderTopicItem = (item) => {
    const isExpanded = expandedItems[item.id];

    return (
      <div key={item.id} className="cm-topic-item">
        <div className="cm-topic-header">
          <div className="cm-topic-title-wrapper">
            <div className={`cm-status-indicator ${item.status || 'orange'}`} />
            <h3 className="cm-topic-title">{item.title}</h3>
          </div>
          <div className="cm-action-buttons">
            <div 
              className="cm-icon-button"
              onClick={() => toggleExpand(item.id)}
            >
              {isExpanded ? <i className="fi fi-rr-minus"></i> : <i className="fi fi-rr-plus"></i>}
            </div>
            <div className="cm-icon-button">
              <i className="fi fi-rr-menu-dots-vertical"></i>
            </div>
          </div>
        </div>

        {item.forwarded && (
          <div className="cm-forwarded-message">Forwarded from previous meeting</div>
        )}

        {isExpanded && (
          <div className="cm-expanded-content">
            <p className="cm-description" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.description) }} style={{ textAlign: 'left' }} />
            {item.subtopics && item.subtopics.length > 0 && (
              <div className="cm-nested-topics">
                {item.subtopics.map((subtopic, index) => (
                  <div key={index} className="cm-nested-topic">
                    <div className="cm-nested-topic-header">
                      <h4 className="cm-nested-topic-title">{subtopic.title}</h4>
                    </div>
                    <p className="cm-description" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(subtopic.description) }} style={{ textAlign: 'left' }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="cm-topic-footer">
          <div className="cm-footer-left">
            {item.incharge ? (
              <div className="cm-incharge-info">
                <div className="cm-incharge-avatar">
                  <img 
                    src={item.incharge.avatar || "../assets/profileimage.png"} 
                    alt="Incharge"
                    className="cm-profile-image" 
                  />
                </div>
                <div className="cm-incharge-details">
                  <div className="cm-incharge-name">
                    Incharge: {item.incharge.name}
                  </div>
                  {item.incharge.members && item.incharge.members.length > 0 && (
                    <div className="cm-incharge-members">
                      Members: {item.incharge.members.map(member => member.name).join(', ')}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="cm-no-incharge">
                <div className="cm-incharge-placeholder">
                  <div className="cm-dashed-circle">
                    <i className="fi fi-rr-user"></i>
                  </div>
                </div>
                <button className="cm-add-incharge-button" onClick={() => handleAddInchargeClick(item)}>Add Incharge</button>
              </div>
            )}
            <div className="cm-deadline">
              {item.incharge && item.incharge.deadline ? 
                `Deadline: ${new Date(item.incharge.deadline).toLocaleDateString()}` : 
                <div className="cm-add-deadline-button" onClick={() => handleSetDeadlineClick(item)}>Set Deadline</div>}
            </div>
          </div>
          <div className="cm-footer-right">
            <button className="cm-add-subtopic-button" onClick={() => handleAddSubTopicClick(item)}>
              <i className="fi fi-sr-ftp"></i> Add sub topic
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleSaveAndNext = () => {
    if (activeTab === 'details') {
      if (title && dateTime && description && category && priority) {
        setActiveTab('members');
      } else {
        alert('Please fill in all required fields.');
      }
    } else if (activeTab === 'members') {
      if (selectedMembers.host.length > 0) {
        setActiveTab('agenda');
      } else {
        alert('Please add at least one host.');
      }
    }
  };

  const handlePreviewClick = () => {
    setShowPreview(true);
  };

  const handleCreateMeetingClick = () => {
    if (title && dateTime && description && category && priority && selectedMembers.host.length > 0) {
      const meetingData = {
        title,
        dateTime,
        description,
        category,
        priority,
        venue,
        repeatOption,
        repeatDetails,
        participants: selectedMembers,
        agenda: agendaItems,
      };
      navigate('/meeting', { state: { meetingData } });
    } else {
      if (selectedMembers.host.length === 0) {
        alert('Please add at least one host.');
      } else {
        alert('Please fill in all required fields.');
      }
    }
  };

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="cm-container">
      <RepeatOverlay
        isOpen={showRepeatOverlay}
        onClose={() => setShowRepeatOverlay(false)}
        onSave={handleRepeatSave}
        minDate={minDate}
      />
      <AddPerson  
        role={currentRole}
        selectedMembers={selectedMembers[currentRole]}
        onSave={handleMemberAdd}
        isOpen={showAddPersonOverlay}
        onClose={handleAddPersonClose}
        allSelectedMembers={selectedMembers} // Pass all selected members
      />
      <AddTopicModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTopic}
        mode={modalMode}
        parentTopic={parentTopic}
        existingTopic={parentTopic}
      />
      {showPreview && (
        <PreviewMeeting
          meetingData={{
            title,
            dateTime,
            description,
            category,
            priority,
            venue,
            repeatOption,
            repeatDetails,
            participants: selectedMembers,
            agenda: agendaItems,
          }}
          onClose={() => setShowPreview(false)}
        />
      )}

      <div className="cm-header">
        <div className="cm-header-left">
          <button className="cm-back-button" onClick={() => navigate(-1)}>
            <FiArrowLeft size={20} />
          </button>
          <h1 className="cm-title">Create Meeting</h1>
        </div>
        <div className="cm-header-right">
          <button className="cm-btn cm-preview-btn" onClick={handlePreviewClick}>
            <i className="fi fi-rr-computer"></i> Preview
          </button>
          <button className="cm-btn cm-draft-btn">
            <i className="fi fi-rr-document"></i> Save as Draft
          </button>
          <button className="cm-btn cm-create-btn" onClick={handleCreateMeetingClick}>
            <i className="fi fi-rr-confetti"></i> Create Meeting
          </button>
        </div>
      </div>

      <div className="cm-tabs">
        <div
          className={`cm-tab ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          <i className="fi fi-rr-id-badge"></i> Details
        </div>
        <div
          className={`cm-tab ${activeTab === 'members' ? 'active' : ''}`}
          onClick={() => setActiveTab('members')}
        >
          <i className="fi fi-rr-man-head"></i> Members
        </div>
        <div
          className={`cm-tab ${activeTab === 'agenda' ? 'active' : ''}`}
          onClick={() => setActiveTab('agenda')}
        >
          <i className="fi fi-rr-chart-tree"></i> Agenda
        </div>
      </div>

      <div className="cm-tab-content">
        {activeTab === 'details' && (
          <form className="cm-form">
            <div className="cm-form-group">
              <label>Meeting Title</label>
              <input type="text" placeholder="Enter your title" className="cm-form-input" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>

            <div className="cm-form-group">
              <label>Description</label>
              <Editor value={description} placeholder="Enter description" onTextChange={(e) => setDescription(e.htmlValue)} style={{ height: '150px' }} required />
            </div>

            <div className="cm-form-group">
              <label>Category of the Meeting</label>
              <select className="cm-form-select" value={category} onChange={(e) => setCategory(e.target.value)} required>
                <option value="" disabled>Select category</option>
                <option value="COA">COA</option>
                <option value="SKILL">SKILL</option>
                <option value="REWARDS">REWARDS</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div className="cm-form-group">
              <label>Priority</label>
              <select className="cm-form-select" value={priority} onChange={(e) => setPriority(e.target.value)} required>
                <option value="" disabled>Select priority</option>
                <option value="High priority">High priority</option>
                <option value="No priority">No priority</option>
              </select>
            </div>

            <div className="cm-form-group">
              <label>Date & Time</label>
              <div className="cm-date-input">
                <input
                  type="datetime-local"
                  value={dateTime}
                  onChange={handleDateTimeChange}
                  placeholder="Select date"
                  className="cm-form-input"
                  min={minDate}
                  required
                />
              </div>
            </div>

            <div className="cm-form-group">
              <label>Venue (optional)</label>
              <select className="cm-form-select" value={venue} onChange={(e) => setVenue(e.target.value)}>
                <option value="" disabled>Select venue</option>
                <option value="SF Seminar Hall 1">SF Seminar Hall 1</option>
                <option value="SF Seminar Hall 2">SF Seminar Hall 2</option>
                <option value="SF Seminar Hall 3">SF Seminar Hall 3</option>
              </select>
            </div>


            <div className="cm-form-group">
              <label>Repeat (optional)</label>
              <div className="cm-form-select" onClick={handleRepeatClick}>
                {getRepeatLabel()}
              </div>
            </div>

            <div className="cm-form-actions">
              <button type="button" className="cm-cancel-btn">Cancel</button>
              <button type="button" className="cm-save-next-btn" onClick={handleSaveAndNext}>Save & Next</button>
            </div>
          </form>
        )}

        {activeTab === 'members' && (
          <div className="cm-members-tab">
            {Object.entries(selectedMembers).map(([role, members]) => (
              <div className="cm-form-group" key={role}>
                <label>{capitalizeRole(role)}</label>
                <div className="cm-form-select" onClick={() => handleAddPersonClick(role)}>
                  {members.length === 0 ? (
                    <span className="cm-form-placeholder-text">Select members</span>
                  ) : (
                    members.map((member) => (
                      <TagLabel
                        key={member.id}
                        label={`${member.name} | ${member.role}`}
                        onClose={() => handleMemberRemove(role, member.id)}
                      />
                    ))
                  )}
                </div>
              </div>
            ))}

            <div className="cm-form-actions">
              <button type="button" className="cm-cancel-btn">Cancel</button>
              <button type="button" className="cm-save-next-btn" onClick={handleSaveAndNext}>Save & Next</button>
            </div>
          </div>
        )}

        {activeTab === 'agenda' && (
          <div className="cm-agenda-tab">
            {agendaItems.length === 0 ? (
              <div className="cm-upload-placeholder">
                <div className="cm-placeholder-icon">
                  <img src={illustration} alt="Upload Icon" />
                </div>
                <h3 className="cm-placeholder-title">Start by uploading a file</h3>
                <p className="cm-placeholder-description">
                  Any assets used in projects will live here.
                  <br />
                  Start creating by uploading your files.
                </p>
                <div className="cm-placeholder-buttons">
                  <button className="cm-add-new-btn" onClick={handleAddNewClick}>+ Add New</button>
                  <label className="cm-upload-btn">
                    <i className="fi fi-rr-cloud-upload"></i> Upload
                    <input type="file" accept=".jpg,.jpeg,.png,.doc,.docx,.pdf" style={{ display: 'none' }} />
                  </label>
                </div>
              </div>
            ) : (
              <div className="cm-agenda-container">
                <div className="cm-header">
                  <button className="cm-add-topic-button" onClick={handleAddNewClick}>
                    <i className="fi fi-rr-plus"></i> Add Topic
                  </button>
                </div>
                <div>
                  {agendaItems.map(item => renderTopicItem(item))}
                </div>
              </div>
            )}
            <div className="cm-form-actions">
              <button type="button" className="cm-cancel-btn">Cancel</button>
              <button type="button" className="cm-save-next-btn" onClick={handleSaveAndNext}>Save & Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateMeeting;
