import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Database.css'; // Reuse Database styles

export default function Reports() {
    const [reports, setReports] = useState([
        { id: 1, name: 'BOS meeting', category: 'COA', createdBy: 'Olivia Rhye', dateCreated: 'Jan 4, 2024' },
        { id: 2, name: 'Grievance meeting', category: 'M Team', createdBy: 'Phoenix Baker', dateCreated: 'Jan 4, 2024' },
        { id: 3, name: 'Academic meeting', category: 'Academic', createdBy: 'Lana Steiner', dateCreated: 'Jan 2, 2024' },
        // ... more reports data
    ]);

    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [selectedItems, setSelectedItems] = useState(new Set());

    // ... existing handlers ...

    return (
        <div className="db-container">
            {/* Header */}
            <div className="db-header">
                <div className="db-header-title">
                    <h1>Reports list</h1>
                    <p className="db-header-subtitle">Keep track of meeting reports and their data.</p>
                </div>
                <div className="db-header-buttons">
                    <button className="db-button secondary">
                        <i className="fi fi-rr-download"></i>
                        <span>Import</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="db-content">
                <div className="db-table">
                    {/* Filter and Search */}
                    <div className="db-filter-search">
                        <div className="db-filter-buttons">
                            <button className={`db-button ${!statusFilter && !categoryFilter ? 'primary' : ''}`}>
                                View all
                            </button>
                            <button className="db-button">Status</button>
                            <button className="db-button">Category</button>
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
                            <button className="db-button">
                                <i className="fi fi-rr-filter"></i>
                                <span>Filters</span>
                            </button>
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
                                            checked={selectedItems.size === reports.length}
                                        />
                                    </th>
                                    <th>File name</th>
                                    <th>Category</th>
                                    <th>Created by</th>
                                    <th>Date created</th>
                                    <th>Report</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {reports.map((report) => (
                                    <tr key={report.id}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.has(report.id)}
                                                onChange={() => handleSelectItem(report.id)}
                                            />
                                        </td>
                                        <td>
                                            <div className="db-table-cell">
                                                <div className="db-icon-container">
                                                    <i className="fi fi-rr-file db-icon"></i>
                                                </div>
                                                {report.name}
                                            </div>
                                        </td>
                                        <td>
                                            <span className="db-category" data-category={report.category}>
                                                {report.category}
                                            </span>
                                        </td>
                                        <td>{report.createdBy}</td>
                                        <td>{report.dateCreated}</td>
                                        <td>
                                            <button className="db-button-link">Download</button>
                                        </td>
                                        <td>
                                            <div className="db-actions">
                                                <button className="db-action-button">
                                                    <i className="fi fi-rr-menu-dots-vertical"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        {/* Pagination */}
                        <div className="db-pagination">
                            <div className="db-pagination-info">Page 1 of 10</div>
                            <div className="db-pagination-buttons">
                                <button className="db-button" disabled>Previous</button>
                                <button className="db-button">Next</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}