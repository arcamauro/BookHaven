import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, Alert } from '@mui/material';
import { registerUser } from '../../services/api';

export default function RegisterModal({ open, handleClose }) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    password: '',
    confirm_password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await registerUser(formData);
      if (response.success) {
        setSuccess(response.success);
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          username: '',
          password: '',
          confirm_password: ''
        });
        setTimeout(() => {
          handleClose();
        }, 3000);
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (Array.isArray(error.error)) {
        setError(error.error.join(' '));
      } else if (error.error) {
        setError(error.error);
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box component="form" onSubmit={handleRegister} sx={{ 
        position: 'absolute', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)', 
        width: 400, 
        bgcolor: 'background.paper', 
        boxShadow: 24, 
        p: 4 
      }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Register
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <TextField
          name="first_name"
          label="First Name"
          fullWidth
          margin="normal"
          value={formData.first_name}
          onChange={handleChange}
          required
        />
        <TextField
          name="last_name"
          label="Last Name"
          fullWidth
          margin="normal"
          value={formData.last_name}
          onChange={handleChange}
          required
        />
        <TextField
          name="email"
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <TextField
          name="username"
          label="Username"
          fullWidth
          margin="normal"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <TextField
          name="password"
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <TextField
          name="confirm_password"
          label="Confirm Password"
          type="password"
          fullWidth
          margin="normal"
          value={formData.confirm_password}
          onChange={handleChange}
          required
        />
        <Button 
          variant="contained" 
          color="primary" 
          fullWidth 
          type="submit"
        >
          Register
        </Button>
      </Box>
    </Modal>
  );
} 