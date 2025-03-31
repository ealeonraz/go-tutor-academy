import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/logged-in-main-navbar';
import Footer from '../components/Footer';
import './SearchResults.css'; // Optional CSS for styling

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:4000/search?q=${encodeURIComponent(query)}`);
        if (response.ok) {
          const data = await response.json();
          setResults(data);
        } else {
          setError('Failed to fetch search results');
        }
      } catch (err) {
        console.error('Error fetching search results:', err);
        setError('Error fetching search results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="search-results-page">
      <Navbar />
      <div className="search-results-container">
        <h1>Search Results for "{query}"</h1>
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && results.length === 0 && <p>No tutors found.</p>}
        <ul>
          {results.map((tutor) => (
            <li key={tutor._id}>
              <h3>{tutor.firstName} {tutor.lastName}</h3>
              <p>Email: {tutor.email}</p>
              {/* Add more details (e.g., subjects, bio) as needed */}
            </li>
          ))}
        </ul>
      </div>
      <Footer />
    </div>
  );
}

export default SearchResults;
