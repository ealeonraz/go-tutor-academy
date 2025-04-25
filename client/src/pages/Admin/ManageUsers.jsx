import React, { useEffect, useState } from 'react';
import {
  Box, Checkbox, FormControlLabel, FormGroup,
  TextField, Grid, Card, CardContent, Typography, Button
} from '@mui/material';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [filters, setFilters] = useState({ student: true, tutor: true });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/users', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setDisplayedUsers(data); // initially show all
      })
      .catch(err => console.error('Error fetching users:', err));
  }, []);

  // Filtering logic
  useEffect(() => {
    let filtered = users.filter(user => {
      const hasRole = user.roles.some(r => filters[r.role]);
      const nameMatch =
        user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchQuery.toLowerCase());
      return hasRole && nameMatch;
    });
    setDisplayedUsers(filtered);
  }, [filters, searchQuery, users]);

  const handleRoleChange = (event) => {
    setFilters({ ...filters, [event.target.name]: event.target.checked });
  };

  const handleDelete = async (userId) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;

    const res = await fetch(`/api/users/${userId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    if (res.ok) {
      setUsers(users.filter(u => u._id !== userId));
    } else {
      alert("Failed to delete user.");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Manage Users</Typography>

      <FormGroup row sx={{ mb: 2 }}>
        <FormControlLabel
          control={<Checkbox checked={filters.student} onChange={handleRoleChange} name="student" />}
          label="Students"
        />
        <FormControlLabel
          control={<Checkbox checked={filters.tutor} onChange={handleRoleChange} name="tutor" />}
          label="Tutors"
        />
        <TextField
          label="Search by name"
          variant="outlined"
          size="small"
          sx={{ ml: 2 }}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </FormGroup>

      <Grid container spacing={3}>
        {displayedUsers.map(user => (
          <Grid item xs={12} md={6} lg={4} key={user._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{user.firstName} {user.lastName}</Typography>
                <Typography>Email: {user.email}</Typography>
                <Typography>Role: {user.roles.map(r => r.role).join(', ')}</Typography>
                <Box sx={{ mt: 2 }}>
                  <Button variant="outlined" color="primary" sx={{ mr: 1 }}>
                    Edit
                  </Button>
                  <Button variant="outlined" color="error" onClick={() => handleDelete(user._id)}>
                    Delete
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ManageUsers;
