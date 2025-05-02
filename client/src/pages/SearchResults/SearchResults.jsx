import React, { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, CardMedia,
  Typography, Rating, Checkbox, FormControlLabel,
  FormGroup, Divider, TextField, InputAdornment, IconButton
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';

import defaultProfilePic from '../../assets/gohan-pic.webp'; // Default profile image

import LoggedInMainNav from '../../components/Navbars/LoggedInNavbar';
import NavBar from '../../components/Navbars/Navbar';
import Footer from '../../components/Footer';

function SearchResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const [allSubjects, setAllSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search).get('q');
  const token = localStorage.getItem('token');
  const BASE_URL = import.meta.env.VITE_API_BASE;

  const [searchTerm, setSearchTerm] = useState(query || '');

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/search/subjects`);
        const data = await res.json();
        setAllSubjects(data);
      } catch (err) {
        console.error("Failed to load subject list:", err);
      }
    };

    loadSubjects();
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const params = new URLSearchParams();
        if (searchTerm.trim()) params.append('q', searchTerm.trim());
        selectedSubjects.forEach((s) => params.append('subjects', s));
        selectedRatings.forEach((r) => params.append('ratings', r));
        selectedDays.forEach((a) => params.append('availability', a));

        const res = await fetch(`http://localhost:4000/api/search?${params.toString()}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error(`Request failed: ${res.status}`);
        }

        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error("Error fetching search results:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchTerm, selectedSubjects, selectedRatings, selectedDays, token]);

  const handleCheckboxToggle = (value, setState) => {
    setState((prev) => prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]);
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;

  return (
    <>
      {token ? <LoggedInMainNav /> : <NavBar />}

      <Box sx={{ padding: '1.5rem 3rem', maxWidth: 800 }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Search for tutors, subjects, or topics..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && searchTerm.trim()) {
              navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
            }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => {
                    if (searchTerm.trim()) {
                      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
                    }
                  }}
                >
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', padding: 3 }}>
        {/* Sidebar */}
        <Box sx={{ width: 240, paddingRight: 4, }}>
          <Typography variant="h6" gutterBottom>Subjects</Typography>
          {allSubjects.map((subject) => (
            <FormControlLabel
              key={subject}
              control={
                <Checkbox
                  onChange={() => handleCheckboxToggle(subject, setSelectedSubjects)}
                  checked={selectedSubjects.includes(subject)}
                />
              }
              label={subject}
            />
          ))}

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>Ratings</Typography>
          <FormGroup>
            {[5, 4, 3, 2, 1].map(star => (
              <FormControlLabel
                key={star}
                control={<Checkbox
                  onChange={() => handleCheckboxToggle(star, setSelectedRatings)}
                  checked={selectedRatings.includes(star)}
                />}
                label={`${star} Stars`}
              />
            ))}
          </FormGroup>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>Availability</Typography>
          <FormGroup>
            {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(day => (
              <FormControlLabel key={day} control={<Checkbox
                onChange={() => handleCheckboxToggle(day, setSelectedDays)}
                checked={selectedDays.includes(day)}
              />} label={day} />
            ))}
          </FormGroup>
        </Box>

        {/* Tutor Cards */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {results.map((tutor, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                position: 'relative',
                flexWrap: 'wrap',
                gap: 3,
                flex: '1 3 250px',
                maxWidth: 300,
                minWidth: 250,
                justifyContent: 'center',
                cursor: 'pointer',
                '&:hover .hoverOverlay': { opacity: 1 },
              }}
              onClick={() => handleOpenBookingModal(tutor)}
            >
              <Card
                sx={{
                  width: '100%',
                  maxWidth: 300,
                  height: 350,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: 2,
                  boxShadow: 3,
                  overflow: 'hidden',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={tutor.profileLink || '/default-avatar.webp'}
                  alt={`${tutor.firstName} ${tutor.lastName}`}
                  onError={(e) => {
                    e.target.onerror = null; // prevents looping
                    e.target.src = defaultProfilePic; // fallback image

                  }}
                  sx={{
                    objectFit: 'cover',
                    objectPosition: 'center',
                    width: '100%',
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8
                  }}
                />
                {/* Hover Overlay */}
                <Box
                  className="hoverOverlay"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bgcolor: 'rgba(146, 95, 226, 0.75)', // Purple transparent
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    opacity: 0,
                    transition: 'opacity 0.3s ease-in-out',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    padding: '1rem',
                  }}
                >
                  Check {tutor.firstName}'s availability and book?
                </Box>
                <CardMedia />
                <CardContent sx={{ px: 1, py: .5 }}>
                  <Typography variant="h6" gutterBottom sx={{ mb: 0.5 }}>
                    {tutor.firstName} {tutor.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 0.25 }}>
                    ${tutor.payRate || 20} / hour
                  </Typography>
                  <Rating
                    value={
                      Array.isArray(tutor.ratings) && tutor.ratings.length > 0 ?
                        Math.round(tutor.ratings.reduce((acc, [score]) => acc + parseInt(score), 0) / tutor.ratings.length)
                        : 5
                    }
                    readOnly
                    size="small"
                  />

                  {/* Display the latest comment */}
                  {Array.isArray(tutor.ratings) && tutor.ratings.length > 0 && (
                    <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 1, maxHeight: 40, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      "{tutor.ratings[tutor.ratings.length - 1][1]}"
                    </Typography>
                  )}

                  <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {tutor.subjects?.[0] || 'Brief info on Subject Specialty'}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>

      <Footer />
    </>
  );
}

export default SearchResults;
