import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, Alert } from '@mui/material';
import { registerUser } from '../../services/api';
import './AuthModals.css';

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
        }, 2000);
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box className="rh-auth-modal">
        <Typography variant="h5" className="rh-auth-title">
          Create Account
        </Typography>
        
        {error && (
          <Alert severity="error" className="rh-auth-alert">
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" className="rh-auth-alert">
            {success}
          </Alert>
        )}

        <form onSubmit={handleRegister} className="rh-auth-form">
          <TextField
            className="rh-auth-input"
            name="first_name"
            label="First Name"
            fullWidth
            margin="normal"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
          <TextField
            className="rh-auth-input"
            name="last_name"
            label="Last Name"
            fullWidth
            margin="normal"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
          <TextField
            className="rh-auth-input"
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
            className="rh-auth-input"
            name="username"
            label="Username"
            fullWidth
            margin="normal"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <TextField
            className="rh-auth-input"
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
            className="rh-auth-input"
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
            className="rh-auth-submit"
            variant="contained"
            fullWidth
            type="submit"
          >
            Register
          </Button>
        </form>
      </Box>
    </Modal>
  );
} 