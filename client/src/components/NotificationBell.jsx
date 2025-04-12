import React, { useState, useEffect, useRef } from 'react';

import './Component.css';
//Julio accidently uploaded this file on my behalf, this code was written by Zeke. This is for task DT-91
function NotificationBell() {
  // Hardcoded notifications with detailed appointment and feedback info
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message:
        "Upcoming Appointment: You have an appointment on April 10, 2025 at 3:00 PM with Tutor John Doe for Mathematics.",
      read: false,
    },
    {
      id: 2,
      message:
        "New Feedback: Tutor Jane Smith left detailed feedback on your recent English session.",
      read: false,
    },
    {
      id: 3,
      message:
        "Reminder: Your Physics session is scheduled for April 15, 2025 at 1:00 PM.",
      read: true,
    },
  ]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const bellRef = useRef(null);

  // Count unread notifications
  const unreadCount = notifications.filter((notif) => !notif.read).length;

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Mark a single notification as read
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  return (
    <div className="notification-bell" ref={bellRef}>
      {/* Bell Button with Inline SVG */}
      <button className="notification-button" onClick={toggleDropdown}>
        <svg
          className="notification-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
        >
          <path d="M12,2A7,7,0,0,0,5,9V12L3,14V15H21V14L19,12V9A7,7,0,0,0,12,2ZM12,22a2,2,0,0,0,2-2H10A2,2,0,0,0,12,22Z" />
        </svg>
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <strong className="notification-header-title">Notifications</strong>
            {unreadCount > 0 && (
              <button className="notification-mark-read-all" onClick={markAllAsRead}>
                Mark all as read
              </button>
            )}
          </div>
          <hr style={{ margin: 0 }} />
          <div className="notification-list">
            {notifications.length === 0 ? (
              <p style={{ padding: '1rem', margin: 0 }}>No notifications</p>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`notification-item ${notif.read ? 'read' : 'unread'}`}
                >
                  <p>{notif.message}</p>
                  {!notif.read && (
                    <button className="notification-mark-read" onClick={() => markAsRead(notif.id)}>
                      Mark as read
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
