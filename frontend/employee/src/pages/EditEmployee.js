import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import {
  TextField, Button, Stack, Typography, AppBar, Toolbar,
  IconButton, Box, MenuItem, Alert, Snackbar
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({
    name: '',
    email: '',
    role: '',
    base_salary: '',
    salary_type: '',
    active: true
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await api.get(`/employees/${id}`);
        setEmployee(response.data);
      } catch (err) {
        setError('Failed to fetch employee details');
        console.error('Error fetching employee:', err);
      }
    };
    fetchEmployee();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({
      ...prev,
      [name]: name === 'active' ? value === 'true' : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await api.put(`/employees/${id}`, employee);
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update employee');
      console.error('Error updating employee:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate(-1)} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Edit Employee</Typography>
          <Button color="inherit" onClick={() => navigate('/')}>Home</Button>
        </Toolbar>
      </AppBar>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ maxWidth: 700, margin: '2rem auto', background: '#fff', padding: '2rem', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>Edit Employee</Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Employee updated successfully!
          </Alert>
        )}

        <Stack spacing={2}>
          <TextField 
            name="name" 
            label="Name" 
            value={employee.name} 
            onChange={handleChange} 
            fullWidth 
            required
          />
          <TextField 
            name="email" 
            label="Email" 
            value={employee.email} 
            onChange={handleChange} 
            fullWidth 
            required
            type="email"
          />
          <TextField 
            name="role" 
            label="Role" 
            value={employee.role} 
            onChange={handleChange} 
            fullWidth 
            required
          />
          <TextField 
            name="base_salary" 
            label="Base Salary" 
            type="number" 
            value={employee.base_salary} 
            onChange={handleChange} 
            fullWidth 
            required
          />
          <TextField
            select
            name="salary_type"
            label="Salary Type"
            value={employee.salary_type}
            onChange={handleChange}
            fullWidth
            required
          >
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="hourly">Hourly</MenuItem>
          </TextField>
          <TextField
            select
            name="active"
            label="Active"
            value={employee.active.toString()}
            onChange={handleChange}
            fullWidth
            required
          >
            <MenuItem value="true">Yes</MenuItem>
            <MenuItem value="false">No</MenuItem>
          </TextField>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Employee'}
          </Button>
        </Stack>
      </form>
    </Box>
  );
}

export default EditEmployee;
