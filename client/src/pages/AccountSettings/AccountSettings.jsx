import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoggedInMainNavbar from '../../components/Navbars/LoggedInNavbar';
import Footer from '../../components/Footer';
import profilePic from '../../assets/gohan-pic.webp';
import AccountSettingsOverlay from '../../components/Overlay/AccountSettingsOverlay';

import './AccountSettings.css';

function AccountSettings() {
    const [userInfo, setUserInfo] = useState(null);
    const [activeOverlay, setActiveOverlay] = useState(null); // 'email', 'password', etc.
    const navigate = useNavigate();

    useEffect(() => {
        const timeout = setTimeout(() => {
            setUserInfo({
                firstName: "Gohan",
                lastName: "Son",
                email: "gohanson@gmail.com",
                subjects: ["Math", "Science", "History"],
                avatarURL: null
            });
        }, 500);
        return () => clearTimeout(timeout);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const closeOverlay = () => setActiveOverlay(null);

    if (!userInfo) return <div>Loading account settings...</div>;

    return (
        <div className="AccountSettings-page">
            <LoggedInMainNavbar />

            {activeOverlay === "email" && (
                <AccountSettingsOverlay title="Change Email" onClose={closeOverlay}>
                    <input type="email" placeholder="New email" />
                    <button className="settings-update-submit">Submit</button>
                </AccountSettingsOverlay>
            )}

            {activeOverlay === "password" && (
                <AccountSettingsOverlay title="Change Password" onClose={closeOverlay}>
                    <input type="password" placeholder="New password" />
                    <input type="password" placeholder="Confirm password" />
                    <button className="settings-update-submit">Submit</button>
                </AccountSettingsOverlay>
            )}

            {activeOverlay === "avatar" && (
                <AccountSettingsOverlay title="Change Avatar" onClose={closeOverlay}>
                    <input
                        type="text"
                        placeholder="Enter public image URL"
                        onChange={(e) => setUserInfo(prev => ({
                            ...prev,
                            avatarURL: e.target.value
                        }))}
                    />
                    <button className="settings-update-submit" onClick={closeOverlay}>Save</button>
                </AccountSettingsOverlay>
            )}

            {activeOverlay === "subjects" && (
                <AccountSettingsOverlay title="Change Subjects" onClose={closeOverlay}>
                    <input placeholder="Enter new subjects, comma-separated" />
                    <button className="settings-update-submit">Update</button>
                </AccountSettingsOverlay>
            )}

            <div className="settings-container">
                <div className="Title">
                    <div className="title-text">Account Settings</div>
                </div>
                <div className="settings-user-info">
                    <div className="settings-user-avatar">
                        <h3>Current Avatar</h3>
                        <img src={userInfo.avatarURL || profilePic} alt="User Avatar" className="avatar-image" />
                        <button className="settings-change-avatar" onClick={() => setActiveOverlay("avatar")}>Change Avatar</button>
                    </div>
                    <div className="settings-user-email">
                        <h3>Email</h3>
                        <p>{userInfo.email}</p>
                        <button className="settings-change-email" onClick={() => setActiveOverlay("email")}>Change Email</button>
                    </div>
                    <div className="settings-user-password">
                        <h3>Password</h3>
                        <button className="settings-change-password" onClick={() => setActiveOverlay("password")}>Change Password</button>
                    </div>
                    <div className="settings-user-subjects">
                        <h3>Subjects</h3>
                        <p>{userInfo.subjects.join(', ')}</p>
                        <button className="settings-change-subjects" onClick={() => setActiveOverlay("subjects")}>Change Subjects</button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default AccountSettings;
