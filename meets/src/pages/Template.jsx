import React, { useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import '../styles/Template.css';

export default function Template() {
  const navigate = useNavigate();
  const [meetingDetails, setMeetingDetails] = useState({
    title: '',
    description: '',
    repeatType: '',
    priorityType: '',
    venue: '',
    dateTime: '',
    refNumber: 'Auto generate'
  });

  // Update roles state to be empty initially
  const [roles, setRoles] = useState([]);

  const [points, setPoints] = useState([
    {
      sno: '01',
      point: '',
      remarks: '',
      responsibility: '',
      targetDate: ''
    }
  ]);

  const handleMeetingChange = (field, value) => {
    setMeetingDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRoleChange = (index, field, value) => {
    const newRoles = [...roles];
    newRoles[index][field] = value;
    setRoles(newRoles);
  };

  const handlePointChange = (index, field, value) => {
    const newPoints = [...points];
    newPoints[index][field] = value;
    setPoints(newPoints);
  };

  const addNewPoint = () => {
    setPoints(prev => [
      ...prev,
      {
        sno: String(prev.length + 1).padStart(2, '0'),
        point: '',
        remarks: '',
        responsibility: '',
        targetDate: ''
      }
    ]);
  };

  // Add new handler for roles
  const addNewRole = () => {
    setRoles(prev => [...prev, { role: '', member: '' }]);
  };

  // Add helper function for alphabetical indexing
  const getAlphabeticalIndex = (index) => {
    return String.fromCharCode(97 + index) + ")"; // 97 is ASCII for 'a'
  };

  const deleteRole = (index) => {
    if (roles.length > 1) {
      setRoles(prev => {
        const newRoles = prev.filter((_, i) => i !== index);
        return newRoles;
      });
    }
  };

  const deletePoint = (index) => {
    if (points.length > 1) {
      setPoints(prev => {
        const newPoints = prev.filter((_, i) => i !== index);
        // Recalculate S.No for remaining points
        return newPoints.map((point, i) => ({
          ...point,
          sno: String(i + 1).padStart(2, '0')
        }));
      });
    }
  };

  const handleDragStart = (e, index, type) => {
    e.dataTransfer.setData('index', index);
    e.dataTransfer.setData('type', type);
    e.target.closest('tr').classList.add('dragging');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    const draggingRow = document.querySelector('.dragging');
    if (draggingRow) {
      const targetRow = e.target.closest('tr');
      if (targetRow && targetRow !== draggingRow) {
        targetRow.classList.add('drag-over');
      }
    }
  };

  const handleDragLeave = (e) => {
    const targetRow = e.target.closest('tr');
    if (targetRow) {
      targetRow.classList.remove('drag-over');
    }
  };

  const handleDrop = (e, targetIndex, type) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData('index'));
    const sourceType = e.dataTransfer.getData('type');
    
    if (sourceType !== type) return;
    
    if (type === 'role') {
      const newRoles = [...roles];
      const [moved] = newRoles.splice(sourceIndex, 1);
      newRoles.splice(targetIndex, 0, moved);
      setRoles(newRoles);
    } else if (type === 'point') {
      const newPoints = [...points];
      const [moved] = newPoints.splice(sourceIndex, 1);
      newPoints.splice(targetIndex, 0, moved);
      // Update S.No after reordering
      const updatedPoints = newPoints.map((point, idx) => ({
        ...point,
        sno: String(idx + 1).padStart(2, '0')
      }));
      setPoints(updatedPoints);
    }
    
    // Clean up drag classes
    document.querySelectorAll('.dragging, .drag-over').forEach(el => {
      el.classList.remove('dragging', 'drag-over');
    });
  };

  return (
    <div className="page-container">
      {/* Header Section */}
      <div className="cm-header">
        <div className="cm-header-left">
          <button className="cm-back-button" onClick={() => navigate(-1)}>
            <FiArrowLeft size={20} />
          </button>
          <h1 className="cm-title">Create Template</h1>
        </div>
        <div className="cm-header-right">
          <button className="cm-btn cm-preview-btn">
            <i className="fi fi-rr-computer"></i> Preview
          </button>
          <button className="cm-btn cm-draft-btn">
            <i className="fi fi-rr-document"></i> Save as Draft
          </button>
          <button className="cm-btn cm-create-btn">
            <i className="fi fi-rr-confetti"></i> Create Template
          </button>
        </div>
      </div>

      <div className="document-container">
        {/* Institution Header */}
        <div className="document-header">
          <img src="/path-to-logo.png" alt="Logo" className="header-logo" />
          <div className="header-content">
            <h2 className="institution-name">BANNARI AMMAN INSTITUTE OF TECHNOLOGY</h2>
            <p className="institution-accreditation">
              An Autonomous Institution Affiliated to Anna University - Chennai • Approved by AICTE • Accredited by NAAC with "A+" Grade
            </p>
            <p className="institution-address">
              SATHYAMANGALAM - 638401 &nbsp; ERODE DISTRICT &nbsp; TAMILNADU &nbsp; INDIA
            </p>
            <p className="institution-contact">
              Ph: 04295-226000/221289 &nbsp; Fax: 04295-226666 &nbsp; E-mail: stayahead@bitsathy.ac.in &nbsp; Web: www.bitsathy.ac.in
            </p>
          </div>
        </div>

        {/* Meeting Details Table */}
        <div className="form-section">
          <table className="meeting-table">
            <tbody>
              <tr>
                <td className="table-label">Name of the Meeting</td>
                <td className="table-input">
                  <input 
                    type="text" 
                    placeholder="Enter meeting name"
                    value={meetingDetails.title}
                    onChange={(e) => handleMeetingChange('title', e.target.value)}
                  />
                </td>
                <td className="table-label disabled-label">Reference Number</td>
                <td className="table-input">
                  <input 
                    type="text" 
                    className="disabled-input" 
                    disabled 
                    value="Auto generate"
                    placeholder="Auto generate"
                  />
                </td>
              </tr>
              <tr>
                <td className="table-label">Meeting Description</td>
                <td className="table-input" colSpan="3">
                  <textarea 
                    placeholder="Enter meeting description"
                    value={meetingDetails.description}
                    onChange={(e) => handleMeetingChange('description', e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td className="table-label">Repeat Type</td>
                <td className="table-input">
                  <input 
                    type="text" 
                    placeholder="Enter repeat type"
                    value={meetingDetails.repeatType}
                    onChange={(e) => handleMeetingChange('repeatType', e.target.value)}
                  />
                </td>
                <td className="table-label">Priority Type</td>
                <td className="table-input">
                  <input 
                    type="text" 
                    placeholder="Enter priority"
                    value={meetingDetails.priorityType}
                    onChange={(e) => handleMeetingChange('priorityType', e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td className="table-label disabled-label">Venue Details</td>
                <td className="table-input">
                  <input 
                    type="text" 
                    className="disabled-input" 
                    disabled 
                    placeholder="To be decided"
                    value={meetingDetails.venue}
                  />
                </td>
                <td className="table-label disabled-label">Date & Time</td>
                <td className="table-input">
                  <input 
                    type="datetime-local" 
                    className="disabled-input" 
                    disabled 
                    value={meetingDetails.dateTime}
                    placeholder="dd-mm-yyyy --:--"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Roles Section */}
        <div className="form-section">
          <h3 className="section-title">Roles and Responsibilities</h3>
          <table className="meeting-table">
            <thead>
              <tr className="table-header">
                <th className="header-cell" width="8%">Actions</th>
                <th className="header-cell" width="41%">Role Title</th>
                <th className="header-cell disabled-label" width="51%">Member List</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role, index) => (
                <tr key={index} 
                    className="table-row"
                    draggable="true"
                    onDragStart={(e) => handleDragStart(e, index, 'role')}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, index, 'role')}
                >
                  <td className="table-actions">
                    <div className="action-buttons">
                      <button 
                        className="action-icon drag" 
                        title="Drag to reorder"
                        onMouseDown={(e) => e.preventDefault()} // Prevent text selection while dragging
                      >
                        <i className="fi fi-rr-apps-sort"></i>
                      </button>
                      <button 
                        className="action-icon delete" 
                        onClick={() => deleteRole(index)} 
                        disabled={roles.length === 1}
                        title={roles.length === 1 ? "Cannot delete last role" : "Delete role"}
                      >
                        <i className="fi fi-rr-trash"></i>
                      </button>
                    </div>
                  </td>
                  <td className="table-input">
                    <div className="input-wrapper">
                      <span className="index-badge">{getAlphabeticalIndex(index)}</span>
                      <input 
                        className="modern-input"
                        type="text" 
                        placeholder="Enter role title"
                        value={role.role}
                        onChange={(e) => handleRoleChange(index, 'role', e.target.value)}
                      />
                    </div>
                  </td>
                  <td className="table-input disabled-cell">
                    <input 
                      className="modern-input"
                      type="text" 
                      placeholder="Member list"
                      disabled
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="action-button" onClick={addNewRole}>
            <i className="fi fi-rr-plus"></i> Add Role
          </button>
        </div>

        {/* Points Section */}
        <div className="form-section">
          <h3 className="section-title">Points to be Discussed</h3>
          <table className="meeting-table">
            <thead>
              <tr className="table-header">
                <th className="header-cell" style={{ width: '90px' }}>Actions</th>
                <th className="header-cell" style={{ width: '60px' }}>S.No</th>
                <th className="header-cell">Points</th>
                <th className="header-cell disabled-label">Remarks</th>
                <th className="header-cell disabled-label">Responsibility</th>
                <th className="header-cell disabled-label">Target Date</th>
              </tr>
            </thead>
            <tbody>
              {points.map((point, index) => (
                <tr key={point.sno} 
                    className="table-row"
                    draggable="true"
                    onDragStart={(e) => handleDragStart(e, index, 'point')}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, index, 'point')}
                >
                  <td className="table-actions">
                    <div className="action-buttons">
                      <button className="action-icon drag" title="Drag to reorder">
                        <i className="fi fi-rr-apps-sort"></i>
                      </button>
                      <button 
                        className="action-icon delete"
                        onClick={() => deletePoint(index)}
                        disabled={points.length === 1}
                        title={points.length === 1 ? "Cannot delete last point" : "Delete point"}
                      >
                        <i className="fi fi-rr-trash"></i>
                      </button>
                    </div>
                  </td>
                  <td className="table-center">
                    <span className="index-badge">{point.sno}</span>
                  </td>
                  <td className="table-input">
                    <textarea 
                      className="modern-input"
                      placeholder="Enter points to be discussed"
                      value={point.point}
                      onChange={(e) => handlePointChange(index, 'point', e.target.value)}
                    />
                  </td>
                  <td className="table-input disabled-cell">
                    <input 
                      type="text" 
                      className="disabled-input"
                      disabled 
                      placeholder="Remarks"
                    />
                  </td>
                  <td className="table-input disabled-cell">
                    <input 
                      type="text" 
                      className="disabled-input"
                      disabled 
                      placeholder="Responsibility"
                    />
                  </td>
                  <td className="table-input disabled-cell">
                    <input 
                      type="date" 
                      className="disabled-input"
                      disabled 
                      placeholder="To be decided"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="action-button" onClick={addNewPoint}>
            <i className="fi fi-rr-plus"></i> Add Point
          </button>
        </div>
      </div>
    </div>
  );
}
