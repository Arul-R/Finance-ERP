import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import {
  Box, Typography, Paper, CircularProgress, AppBar, Toolbar, IconButton, Button, Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ViewClient = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await api.get(`/clients/${id}`);
        setClient(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch client details');
        console.error('Error fetching client:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
        <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={() => navigate(-1)} sx={{ mr: 2 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Client Details
            </Typography>
            <Button color="inherit" onClick={() => navigate('/')}>Home</Button>
          </Toolbar>
        </AppBar>
        <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        </Box>
      </Box>
    );
  }

  if (!client) {
    return (
      <Box sx={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
        <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={() => navigate(-1)} sx={{ mr: 2 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Client Details
            </Typography>
            <Button color="inherit" onClick={() => navigate('/')}>Home</Button>
          </Toolbar>
        </AppBar>
        <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4 }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            Client not found
          </Alert>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      {/* Navbar */}
      <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate(-1)} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Client Details
          </Typography>
          <Button color="inherit" onClick={() => navigate('/')}>Home</Button>
        </Toolbar>
      </AppBar>

      {/* Client Details Card */}
      <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4 }}>
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#333' }}>
            {client.name}
          </Typography>

          {[
            { label: 'Industry', value: client.industry },
            { label: 'Address', value: client.address },
            { label: 'POC Name', value: client.poc_name },
            { label: 'POC Email', value: client.poc_email },
            { label: 'POC Phone', value: client.poc_phone },
            { label: 'Status', value: client.status },
            { label: 'Created At', value: new Date(client.createdAt).toLocaleString() },
            { label: 'Updated At', value: new Date(client.updatedAt).toLocaleString() },
          ].map((item, index) => (
            <Typography key={index} sx={{ mb: 1 }}>
              <strong>{item.label}:</strong> {item.value || 'N/A'}
            </Typography>
          ))}
        </Paper>
      </Box>
    </Box>
  );
};

export default ViewClient;
