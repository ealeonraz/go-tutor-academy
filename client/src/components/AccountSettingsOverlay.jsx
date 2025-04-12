import React from 'react';
import './Overlay.css';

const AccountSettingsOverlay = ({ title, children, onClose }) => {
  return (
    <div className="settings-overlay">
      <div className="settings-overlay-content">
        <h2>{title}</h2>
        {children}
        <button className="close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default AccountSettingsOverlay;