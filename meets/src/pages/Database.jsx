import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import '../styles/Database.css';

export default function Template() {
    const [templates, setTemplates] = useState([
        { id: 1, name: 'BOS Meeting', status: 'Active', dateCreated: 'Jan 4, 2024', lastUpdated: 'Jan 4, 2024', category: 'COA', createdBy: 'Olivia Rhye' },
        { id: 2, name: 'Skill Meeting', status: 'In Active', dateCreated: 'Jan 4, 2024', lastUpdated: 'Jan 4, 2024', category: 'M Team', createdBy: 'Phoenix Baker' },
        { id: 3, name: 'Academic Meeting', status: 'Active', dateCreated: 'Jan 2, 2024', lastUpdated: 'Jan 2, 2024', category: 'Academic', createdBy: 'Lana Steiner' },
        { id: 4, name: 'Grievance Meeting', status: 'In Active', dateCreated: 'Jan 6, 2024', lastUpdated: 'Jan 6, 2024', category: 'COA', createdBy: 'Demi Wilkinson' },
        { id: 5, name: 'BOS MeetingBOS Meeting', status: 'Active', dateCreated: 'Jan 8, 2024', lastUpdated: 'Jan 8, 2024', category: 'COA', createdBy: 'Candice Wu' },
        { id: 6, name: 'Skill Meeting', status: 'Active', dateCreated: 'Jan 6, 2024', lastUpdated: 'Jan 6, 2024', category: 'COA', createdBy: 'Natali Craig' },
        { id: 7, name: 'Academic Meeting', status: 'Active', dateCreated: 'Jan 4, 2024', lastUpdated: 'Jan 4, 2024', category: 'COA', createdBy: 'Drew Cano' }
    ]);
    const [activeTab, setActiveTab] = useState('templates');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [activeStatusDropdown, setActiveStatusDropdown] = useState(null);
    const navigate = useNavigate(); // Initialize useNavigate

    // Sort function
    const sortData = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Filter and sort templates
    const filteredTemplates = useMemo(() => {
        let filtered = [...templates];

        // Apply search
        if (searchTerm) {
            filtered = filtered.filter(template =>
                template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                template.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                template.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply status filter
        if (statusFilter) {
            filtered = filtered.filter(template => template.status === statusFilter);
        }

        // Apply category filter
        if (categoryFilter) {
            filtered = filtered.filter(template => template.category === categoryFilter);
        }

        // Apply sort
        if (sortConfig.key) {
            filtered.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        return filtered;
    }, [templates, searchTerm, statusFilter, categoryFilter, sortConfig]);

    // Get unique categories
    const categories = [...new Set(templates.map(template => template.category))];

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            const activeTemplateIds = filteredTemplates
                .filter(template => template.status === 'Active')
                .map(template => template.id);
            setSelectedItems(new Set(activeTemplateIds));
        } else {
            setSelectedItems(new Set());
        }
    };

    const handleSelectItem = (id, status) => {
        if (status === 'In Active') return;
        
        setSelectedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleStatusClick = (templateId) => {
        setActiveStatusDropdown(activeStatusDropdown === templateId ? null : templateId);
    };

    const handleStatusChange = (templateId, newStatus) => {
        setTemplates(prevTemplates =>
            prevTemplates.map(template =>
                template.id === templateId ? { ...template, status: newStatus } : template
            )
        );
        setActiveStatusDropdown(null);
    };

    const handleSaveAndNext = () => {
        // Close the modal and navigate to the CreateMeeting page
        setIsModalOpen(false);
        navigate('/template');
    };

    return (
        <div className="db-container">
            {/* Navigation */}
            <nav className="db-nav">
                <div className={`db-nav-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
                    <i className="fi fi-rr-users"></i>
                    <span>Users</span>
                </div>
                <div className={`db-nav-item ${activeTab === 'roles' ? 'active' : ''}`} onClick={() => setActiveTab('roles')}>
                    <i className="fi fi-rr-user"></i>
                    <span>Roles</span>
                </div>
                <div className={`db-nav-item ${activeTab === 'infrastructure' ? 'active' : ''}`} onClick={() => setActiveTab('infrastructure')}>
                    <i className="fi fi-rr-building"></i>
                    <span>Infrastructure</span>
                </div>
                <div className={`db-nav-item ${activeTab === 'templates' ? 'active' : ''}`} onClick={() => setActiveTab('templates')}>
                    <i className="fi fi-rr-file"></i>
                    <span>Templates</span>
                </div>
            </nav>

            {/* Main Content */}
            <div className="db-content">
                {activeTab === 'templates' && (
                    <>
                        {/* Header */}
                        <div className="db-header">
                            <div className="db-header-title">
                                <h1>Template list</h1>
                                <p className="db-header-subtitle">Keep track of templates and their datas.</p>
                            </div>
                            <div className="db-header-buttons">
                                <button className="db-button secondary">
                                    <i className="fi fi-rr-download"></i>
                                    <span>Import</span>
                                </button>
                                <button className="db-button primary" onClick={openModal}>
                                    <i className="fi fi-rr-plus"></i>
                                    <span>Add Template</span>
                                </button>
                            </div>
                        </div>

                        {templates.length > 0 ? (
                            <div className="db-table">
                                {/* Filter and Search */}
                                <div className="db-filter-search">
                                    <div className="db-filter-buttons">
                                        <button 
                                            className={`db-button ${!statusFilter && !categoryFilter ? 'primary' : ''}`}
                                            onClick={() => { setStatusFilter(''); setCategoryFilter(''); }}
                                        >
                                            View all
                                        </button>
                                        <select 
                                            className="db-button"
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                        >
                                            <option value="">Status: All</option>
                                            <option value="Active">Active</option>
                                            <option value="In Active">Inactive</option>
                                        </select>
                                        <select 
                                            className="db-button"
                                            value={categoryFilter}
                                            onChange={(e) => setCategoryFilter(e.target.value)}
                                        >
                                            <option value="">Category: All</option>
                                            {categories.map(category => (
                                                <option key={category} value={category}>{category}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="db-search-filter">
                                        <div className="db-search">
                                            <i className="fi fi-rr-search db-search-icon"></i>
                                            <input 
                                                type="text" 
                                                placeholder="Search" 
                                                className="db-search-input"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Table */}
                                <div className="db-table-container">
                                    <table className="db-table">
                                        <thead>
                                            <tr>
                                                <th>
                                                    <input
                                                        type="checkbox"
                                                        onChange={handleSelectAll}
                                                        checked={
                                                            filteredTemplates.length > 0 &&
                                                            filteredTemplates
                                                                .filter(t => t.status === 'Active')
                                                                .every(t => selectedItems.has(t.id))
                                                        }
                                                    />
                                                </th>
                                                <th onClick={() => sortData('name')}>
                                                    File name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                                </th>
                                                <th onClick={() => sortData('status')}>
                                                    Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                                </th>
                                                <th>Date created</th>
                                                <th>Last updated</th>
                                                <th onClick={() => sortData('category')}>
                                                    Category {sortConfig.key === 'category' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                                </th>
                                                <th>Created by</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredTemplates.map((template) => (
                                                <tr key={template.id}>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedItems.has(template.id)}
                                                            onChange={() => handleSelectItem(template.id, template.status)}
                                                            disabled={template.status === 'In Active'}
                                                        />
                                                    </td>
                                                    <td>
                                                        <div className="db-table-cell">
                                                            <div className="db-icon-container">
                                                                <i className="fi fi-rr-file db-icon"></i>
                                                            </div>
                                                            {template.name}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div style={{ position: 'relative' }}>
                                                            <div
                                                                className={`db-status ${template.status === 'Active' ? 'active' : 'inactive'}`}
                                                                onClick={() => handleStatusClick(template.id)}
                                                            >
                                                                <span className={`db-status-dot ${template.status === 'Active' ? 'active' : 'inactive'}`} />
                                                                {template.status}
                                                                <i className="fi fi-rr-angle-small-down"></i>
                                                            </div>
                                                            {activeStatusDropdown === template.id && (
                                                                <div className="db-status-dropdown">
                                                                    <div 
                                                                        className="db-status-option active"
                                                                        onClick={() => handleStatusChange(template.id, 'Active')}
                                                                    >
                                                                        <span className="db-status-dot active" />
                                                                        Active
                                                                    </div>
                                                                    <div 
                                                                        className="db-status-option inactive"
                                                                        onClick={() => handleStatusChange(template.id, 'In Active')}
                                                                    >
                                                                        <span className="db-status-dot inactive" />
                                                                        Inactive
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td>{template.dateCreated}</td>
                                                    <td>{template.lastUpdated}</td>
                                                    <td>
                                                        <span 
                                                            className="db-category" 
                                                            data-category={template.category}
                                                        >
                                                            {template.category}
                                                        </span>
                                                    </td>
                                                    <td>{template.createdBy}</td>
                                                    <td>
                                                        <div className="db-actions">
                                                            <button className="db-action-button">
                                                                <i className="fi fi-rr-trash"></i>
                                                            </button>
                                                            <button className="db-action-button">
                                                                <i className="fi fi-rr-edit"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="db-pagination">
                                        <div className="db-pagination-info">Page 1 of 10</div>
                                        <div className="db-pagination-buttons">
                                            <button className="db-button">Previous</button>
                                            <button className="db-button">Next</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Empty State */
                            <div className="db-empty-state">
                                <div className="db-empty-icon">
                                    <i className="fi fi-rr-upload"></i>
                                </div>
                                <h3>Start by uploading a file</h3>
                                <p>Any assets used in projects will live here.</p>
                                <p>Start creating by uploading your files.</p>
                                <div className="db-empty-buttons">
                                    <button className="db-button-new" onClick={openModal}>
                                        <i className="fi fi-rr-plus"></i>
                                        <span>Add New</span>
                                    </button>
                                    <label className="db-button primary">
                                        <i className="fi fi-rr-upload"></i>
                                        <span>Upload</span>
                                        <input type="file" accept=".jpg,.jpeg,.png,.doc,.docx,.pdf" style={{ display: 'none' }} />
                                    </label>
                                </div>
                            </div>
                        )}
                    </>
                )}
                {/* Add similar content for other tabs (users, roles, infrastructure) */}
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-button" onClick={closeModal}>&times;</button>
                        <h2>Select Category</h2>
                        <form>
                            <div className="form-group">
                                <label>Category of Meeting:</label>
                                <select>
                                    <option value="COA">COA</option>
                                    <option value="PSkill">PSkill</option>
                                    <option value="Rewards">Rewards</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="db-button cancel" onClick={closeModal}>Cancel</button>
                                <button type="button" className="db-button primary" onClick={handleSaveAndNext}>Save and Next</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}