import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import {
  TextField, Button, Stack, Typography, AppBar, Toolbar,
  IconButton, Box, MenuItem, Alert, Snackbar, CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function EditClient() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState({
    name: '', industry: '', address: '', poc_name: '', poc_email: '', poc_phone: '', status: 'active'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await api.get(`/clients/${id}`);
        setClient(response.data);
      } catch (err) {
        setError('Failed to fetch client details');
        console.error('Error fetching client:', err);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchClient();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClient(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await api.put(`/clients/${id}`, client);
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update client');
      console.error('Error updating client:', err);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate(-1)} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Edit Client</Typography>
          <Button color="inherit" onClick={() => navigate('/')}>Home</Button>
        </Toolbar>
      </AppBar>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ maxWidth: 700, margin: '2rem auto', background: '#fff', padding: '2rem', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>Edit Client</Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Client updated successfully!
          </Alert>
        )}

        <Stack spacing={2}>
          <TextField 
            name="name" 
            label="Client Name" 
            value={client.name} 
            onChange={handleChange} 
            fullWidth 
            required
          />
          <TextField 
            name="industry" 
            label="Industry" 
            value={client.industry} 
            onChange={handleChange} 
            fullWidth 
          />
          <TextField 
            name="address" 
            label="Address" 
            value={client.address} 
            onChange={handleChange} 
            fullWidth 
          />
          <TextField 
            name="poc_name" 
            label="POC Name" 
            value={client.poc_name} 
            onChange={handleChange} 
            fullWidth 
            required
          />
          <TextField 
            name="poc_email" 
            label="POC Email" 
            value={client.poc_email} 
            onChange={handleChange} 
            fullWidth 
            required
            type="email"
          />
          <TextField 
            name="poc_phone" 
            label="POC Phone" 
            value={client.poc_phone} 
            onChange={handleChange} 
            fullWidth 
          />
          <TextField
            select
            name="status"
            label="Status"
            value={client.status}
            onChange={handleChange}
            fullWidth
            required
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </TextField>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Client'}
          </Button>
        </Stack>
      </form>
    </Box>
  );
}

export default EditClient;
