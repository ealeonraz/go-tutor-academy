import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbars/LoggedInNavbar';
import DashboardNavbar from '../../components/Navbars/DashboardNavbar';
import Footer from '../../components/Footer';
import profilePic from '../../assets/gohan-pic.webp'; // Default profile image

import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import './Dashboard.css';

function DashboardHome() {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [greeting, setGreeting] = useState('');
    const [timeMessage, setTimeMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Update time greeting
        const updateTime = () => {
            const hour = new Date().getHours();
            if (hour >= 5 && hour < 12) {
                setGreeting('Good Morning, ');
                setTimeMessage("Let's start the day off great in your studies!");
            } else if (hour >= 12 && hour < 18) {
                setGreeting('Good Afternoon, ');
                setTimeMessage("A good study session happens right after lunch.");
            } else {
                setGreeting('Good Evening, ');
                setTimeMessage("The night is still young—keep studying!");
            }
            setCurrentDate(new Date());
        };

        updateTime();
        const intervalId = setInterval(updateTime, 60000); // Update every minute
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        // Fetch user info
        const fetchUserInfo = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setLoading(false);
                    return;
                }

                const response = await fetch('http://localhost:4000/api/user/me', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user info');
                }

                const data = await response.json();
                setUserInfo(data);
            } catch (err) {
                console.error('Error fetching user info:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

    const handleSearch = () => {
        if (searchTerm.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
        }
    };

    if (loading) return <div>Loading account settings...</div>;

    return (
        <div className="Dashboard-container">
            <Navbar />
            <DashboardNavbar />
            <div className="Dashboard-content">
                <div className="welcome-box">
                    <div className="date">
                        <p>{currentDate.toLocaleDateString()}</p>
                    </div>
                    <div className="name-message">
                        <h1>{greeting}{userInfo ? userInfo.firstName : 'Student'}</h1>
                        <h4>{timeMessage}</h4>
                    </div>
                    <div className="user-picture">
                        <img
                            src={userInfo?.avatarURL || profilePic}
                            alt="User Avatar"
                            className="avatar-img"
                        />
                    </div>
                </div>

                {/* Typewriter Effect */}
                <div className="typewriter-container">
                    <p className="typwriter-text">What are we searching for this time?</p>
                </div>

                {/* MUI Search Bar */}
                <div className="search-bar-container">
                    <TextField
                        label="Search for tutors, subjects, or topics..."
                        variant="outlined"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch();
                            }
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleSearch}>
                                        <SearchIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        fullWidth={false}
                        sx={{ width: '100%' }}
                    />
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default DashboardHome;
