import React from 'react';
import { NavLink } from 'react-router-dom';
import { AiOutlineHome, AiOutlineBarChart, AiOutlineBell, AiOutlineDatabase } from 'react-icons/ai';
import { FaHeadset } from 'react-icons/fa';
import '../styles/Sidebar.css';
import Logo from '../assets/Logo.svg';
import ProfileImage from '../assets/profileimage.png'; // Add your profile image here

const Sidebar = () => {
    return (
        <div className="sidebar">
            {/* Top Section */}
            <div className="sidebar-top">
                <div className="logo">
                    <img src={Logo} alt="Logo" className="logo-image" />
                </div>
            </div>

            {/* Menu Section */}
            <div className="sidebar-menu">
            <NavLink
                to="/dashboard"
                className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}
                end
            >
                {({ isActive }) => (
                    <AiOutlineHome 
                        size={24} 
                        className={`icon ${isActive ? "active" : ""}`}
                        style={{ color: isActive ? '#007bff' : '#46555F' }}
                    />
                )}
            </NavLink>
            <NavLink to="/database" className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}>
                <AiOutlineDatabase size={24} className="icon" />
            </NavLink>
            <NavLink to="/reports" className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}>
                <AiOutlineBarChart size={24} className="icon" />
            </NavLink>
        </div>

            {/* Notification Section */}
            <div className="sidebar-notification">
                <NavLink to="/notifications" className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}>
                    <AiOutlineBell size={24} className="icon" />
                    <span className="badge"></span>
                </NavLink>
                <NavLink to="/support" className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}>
                    <FaHeadset size={24} className="icon" />
                </NavLink>
            </div>

            {/* Logout Button */}
            <div className="sidebar-bottom">
                <NavLink to="/logout" className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}>
                    <img src={ProfileImage} alt="Profile" className="profile-image" />
                </NavLink>
            </div>
        </div>
    );
};

export default Sidebar;
