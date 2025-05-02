// TutorFeedback.jsx
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbars/Navbar';
import Footer from '../components/Footer';
import './AptFeedback.css';

function TutorFeedback() {
    const [tutorFeedback, setTutorFeedback] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedReview, setSelectedReview] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = [
                    { date: '2024-01-15', rating: 4, tutor: 'Mr. Smith', review: "Great session, very helpful!" },
                    { date: '2024-01-20', rating: 5, tutor: 'Mr. Smith', review: "Excellent explanation, thank you." },
                    { date: '2024-02-05', rating: 3, tutor: 'Mr. Smith', review: "Could improve on clarity." },
                    { date: '2024-02-15', rating: 4.5, tutor: 'Mr. Smith', review: "Very knowledgeable and patient." },
                    { date: '2024-03-01', rating: 4, tutor: 'Mr. Smith', review: "Good session, will book again." },
                    { date: '2024-03-10', rating: 2, tutor: 'Mr. Smith', review: "Not very helpful this time." },
                    { date: '2024-03-20', rating: 5, tutor: 'Mr. Smith', review: "Best tutor I've had so far." },
                    { date: '2024-04-05', rating: 4, tutor: 'Mr. Smith', review: "Clear and concise explanations." },
                    { date: '2024-04-20', rating: 3, tutor: 'Mr. Smith', review: "Average session, nothing special." },
                    { date: '2024-05-01', rating: 5, tutor: 'Mr. Smith', review: "Amazing tutor, highly recommend." },
                    { date: '2024-05-15', rating: 4, tutor: 'Mr. Smith', review: "Helpful, but a bit rushed." },
                    { date: '2024-06-03', rating: 3, tutor: 'Mr. Smith', review: "Okay, but could be better." },
                    { date: '2024-06-20', rating: 4.5, tutor: 'Mr. Smith', review: "Great insights, very useful." },
                    { date: '2024-07-08', rating: 2, tutor: 'Mr. Smith', review: "Didn't understand the concepts." },
                    { date: '2024-07-25', rating: 5, tutor: 'Mr. Smith', review: "Excellent session, very clear." },
                    { date: '2024-08-12', rating: 4, tutor: 'Mr. Smith', review: "Good explanations, thank you." },
                    { date: '2024-08-28', rating: 3, tutor: 'Mr. Smith', review: "Average, not very engaging." },
                    { date: '2024-09-05', rating: 4.5, tutor: 'Mr. Smith', review: "Very helpful, explained well." },
                    { date: '2024-09-22', rating: 5, tutor: 'Mr. Smith', review: "Best tutor ever, great session." },
                    { date: '2024-10-10', rating: 2, tutor: 'Mr. Smith', review: "Confusing session, didn't help." },
                    { date: '2024-10-27', rating: 4, tutor: 'Mr. Smith', review: "Good session, learned a lot." },
                    { date: '2024-11-03', rating: 3, tutor: 'Mr. Smith', review: "Average, needs more clarity." },
                    { date: '2024-11-18', rating: 4.5, tutor: 'Mr. Smith', review: "Excellent, very knowledgeable." },
                    { date: '2024-12-01', rating: 5, tutor: 'Mr. Smith', review: "Perfect session, very helpful." },
                ];
                const tutorName = 'Mr. Smith';
                const tutorData = data.filter(item => item.tutor === tutorName);
                setTutorFeedback(tutorData);

                const currentDate = new Date();
                const currentYear = currentDate.getFullYear();
                const currentMonth = currentDate.getMonth();

                let monthlyData = [];
                for (let i = 11; i >= 0; i--) {
                    const date = new Date(currentYear, currentMonth - i, 1);
                    const month = date.toISOString().substring(0, 7);

                    const monthData = tutorData.filter(item => item.date.substring(0, 7) === month);
                    const reviews = monthData.length;
                    const averageRating = reviews > 0
                        ? monthData.reduce((sum, item) => sum + item.rating, 0) / reviews
                        : 0;

                    monthlyData.push({
                        month: date.toLocaleString('default', { month: 'short' }),
                        reviews,
                        averageRating: averageRating.toFixed(2),
                    });
                }
                setMonthlyData(monthlyData);

            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

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

    const maxReviews = Math.max(...monthlyData.map(item => item.reviews));
    const maxRating = Math.max(...monthlyData.map(item => parseFloat(item.averageRating)));

    return (
        <div className="apt-feedback-page">
            <Navbar />
            <div className="apt-feedback-container">
                <h2>Tutor Feedback Dashboard</h2>
                <div className="chart-container" style={{ backgroundColor: 'white' }}>
                    <h3>Monthly Review Analysis</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', overflowX: 'auto' }}>
                        {monthlyData.map(item => (
                            <div key={item.month} style={{ textAlign: 'center', minWidth: '80px' }}>
                                <div style={{
                                    height: `${(item.reviews / maxReviews) * 100}px`,
                                    backgroundColor: 'lightblue',
                                    marginBottom: '5px',
                                    display: 'flex',
                                    alignItems: 'flex-end',
                                    justifyContent: 'center'
                                }}>
                                    {item.reviews}
                                </div>
                                <div style={{
                                    height: `${(item.averageRating / maxRating) * 100}px`,
                                    backgroundColor: 'lightgreen',
                                    marginBottom: '5px',
                                    display: 'flex',
                                    alignItems: 'flex-end',
                                    justifyContent: 'center'
                                }}>
                                    {item.averageRating}
                                </div>
                                <div>{item.month}</div>
                                <div>Reviews / Avg Rating</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="data-display" style={{ backgroundColor: 'white' }}>
                    <h3>Your Feedback Ratings</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Rating</th>
                                <th>Review</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tutorFeedback.map(item => (
                                <tr key={item.date}>
                                    <td>{item.date}</td>
                                    <td>{item.rating}</td>
                                    <td onClick={() => setSelectedReview(item.review)} style={{ cursor: 'pointer' }}>
                                        {item.review ? 'View Review' : 'No Review'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {selectedReview && (
                    <div className="review-modal" onClick={() => setSelectedReview(null)}>
                        <div className="review-content" onClick={(e) => e.stopPropagation()}>
                            <p>{selectedReview}</p>
                            <button onClick={() => setSelectedReview(null)}>Close</button>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default TutorFeedback;