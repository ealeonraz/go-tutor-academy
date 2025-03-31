import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/logged-in-main-navbar';
import Footer from '../components/Footer';
import './SearchResults.css';

function SearchResults() {
  // Get initial query from URL, if any
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [subjectFilter, setSubjectFilter] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Function to fetch tutors from backend
  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:4000/api/search?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        // Optionally filter by subject on the client side
        let filteredResults = data;
        if (subjectFilter) {
          filteredResults = filteredResults.filter(tutor => {
            if (tutor.subjects) {
              // tutor.subjects may be a string or an array
              if (Array.isArray(tutor.subjects)) {
                return tutor.subjects
                  .map(s => s.toLowerCase())
                  .includes(subjectFilter.toLowerCase());
              } else {
                return tutor.subjects.toLowerCase().includes(subjectFilter.toLowerCase());
              }
            }
            return false;
          });
        }
        setResults(filteredResults);
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

  // Fetch results when the query changes
  useEffect(() => {
    fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ q: query });
    fetchResults();
  };

  return (
    <div className="search-results-page">
      <Navbar />
      <div className="search-header">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            type="text"
            placeholder="Search tutors..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">Search</button>
          {/* Subject filter select */}
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Subjects</option>
            <option value="Math">Math</option>
            <option value="English">English</option>
            <option value="Science">Science</option>
            <option value="History">History</option>
            {/* Add more subjects as needed */}
          </select>
        </form>
      </div>

      <div className="search-results-container">
        <h1>Search Results</h1>
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && results.length === 0 && <p>No tutors found.</p>}
        <div className="results-grid">
          {results.map((tutor) => (
            <div key={tutor._id} className="tutor-card">
              <img
                src={tutor.profilePic || '/defaultProfilePic.png'}
                alt={`${tutor.firstName} ${tutor.lastName}`}
                className="tutor-img"
              />
              <h3>{tutor.firstName} {tutor.lastName}</h3>
              <p>{tutor.subjects || "No subjects listed"}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default SearchResults;