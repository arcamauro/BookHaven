import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, Alert, InputAdornment, IconButton } from '@mui/material';
import { registerUser } from '../../services/api';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import './AuthModals.css';

// Modal component to handle the registration process
export default function RegisterModal({ open, handleClose }) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    password: '',
    confirm_password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  // Function to handle the registration process
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

  // Render the registration modal with the registration form
  return (
    <Modal open={open} onClose={handleClose}>
      <Box className="rh-auth-modal register">
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
            value={formData.first_name}
            onChange={handleChange}
            required
          />
          <TextField
            className="rh-auth-input"
            name="last_name"
            label="Last Name"
            fullWidth
            value={formData.last_name}
            onChange={handleChange}
            required
          />
          <TextField
            className="rh-auth-input full-width"
            name="email"
            label="Email"
            type="email"
            fullWidth
            value={formData.email}
            onChange={handleChange}
            required
          />
          <TextField
            className="rh-auth-input full-width"
            name="username"
            label="Username"
            fullWidth
            value={formData.username}
            onChange={handleChange}
            required
          />
          <TextField
            className="rh-auth-input"
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            value={formData.password}
            onChange={handleChange}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            className="rh-auth-input"
            name="confirm_password"
            label="Confirm Password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            value={formData.confirm_password}
            onChange={handleChange}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <div className="submit-container">
            <Button 
              className="rh-auth-submit"
              variant="contained"
              fullWidth
              type="submit"
            >
              Register
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
} 