// AdminFeedback.jsx
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './AptFeedback.css';

function AdminFeedback() {
    const [feedbackData, setFeedbackData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTutor, setSelectedTutor] = useState('All');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedReview, setSelectedReview] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = [
                    { date: '2024-03-01', rating: 4, tutor: 'Mr. Smith', review: 'Good session' },
                    { date: '2024-03-02', rating: 5, tutor: 'Ms. Johnson', review: 'Excellent teaching' },
                    { date: '2024-03-03', rating: 3, tutor: 'Mr. Smith', review: 'Could explain better' },
                    { date: '2024-03-04', rating: 4.5, tutor: 'Dr. Lee', review: 'Very knowledgeable' },
                    { date: '2024-03-05', rating: 4, tutor: 'Mr. Smith', review: 'Helpful and patient' },
                    { date: '2024-03-06', rating: 2, tutor: 'Ms. Johnson', review: 'Not very helpful' },
                    { date: '2024-03-07', rating: 5, tutor: 'Dr. Lee', review: 'Amazing session' },
                ];
                setFeedbackData(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredData = feedbackData.filter(item => {
        const dateFilter = (!startDate || new Date(item.date) >= new Date(startDate)) &&
            (!endDate || new Date(item.date) <= new Date(endDate));
        const tutorFilter = selectedTutor === 'All' || item.tutor === selectedTutor;
        return dateFilter && tutorFilter;
    });

    const tutors = ['All', ...new Set(feedbackData.map(item => item.tutor))];

    const handleViewReview = (review) => {
        setSelectedReview(review);
        setShowReviewModal(true);
    };

    if (loading) {
        return (
            <div className="apt-feedback-page">
                <Navbar />
                <div className="apt-feedback-container">
                    <p>Loading feedback data...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="apt-feedback-page">
                <Navbar />
                <div className="apt-feedback-container">
                    <p>Error loading feedback data: {error.message}</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="apt-feedback-page">
            <Navbar />
            <div className="apt-feedback-container">
                <h2>Admin Feedback Dashboard</h2>

                <div>
                    <label>Filter by Tutor:</label>
                    <select value={selectedTutor} onChange={e => setSelectedTutor(e.target.value)}>
                        {tutors.map(tutor => (
                            <option key={tutor} value={tutor}>{tutor}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Start Date:</label>
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                    <label>End Date:</label>
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                </div>

                <div className="data-display">
                    <h3>Overall Feedback Ratings</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Rating</th>
                                <th>Tutor</th>
                                <th>Review</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((item) => (
                                <tr key={item.date}>
                                    <td>{item.date}</td>
                                    <td>{item.rating}</td>
                                    <td>{item.tutor}</td>
                                    <td>
                                        <button onClick={() => handleViewReview(item.review)}>View</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {showReviewModal && (
                    <div className="review-modal">
                        <div className="review-content">
                            <p>{selectedReview}</p>
                            <button onClick={() => setShowReviewModal(false)}>Close</button>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default AdminFeedback;