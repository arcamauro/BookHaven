import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, IconButton, InputAdornment, Alert, Collapse } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { requestPasswordReset } from '../../services/api';

// Modal component to handle the login process
export default function LoginModal({ open, handleClose, onRegisterClick }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });
  const { login } = useAuth();

  // Function to handle the login process
  const handleLogin = async () => {
    try {
      const success = await login(username, password);
      if (success) {
        setUsername('');
        setPassword('');
        handleClose();
      } else {
        setAlert({
          show: true,
          message: 'Login failed. Please check your credentials.',
          severity: 'error'
        });
      }
    } catch (error) {
      setAlert({
        show: true,
        message: 'An error occurred. Please try again.',
        severity: 'error'
      });
    }
  };

  // Function to handle the password reset process
  const handlePasswordReset = async () => {
    try {
      await requestPasswordReset(resetEmail);
      setAlert({
        show: true,
        message: 'If an account exists with this email, you will receive password reset instructions.',
        severity: 'success'
      });
      // Clear the form after 3 seconds and return to login
      setTimeout(() => {
        setShowForgotPassword(false);
        setResetEmail('');
        setAlert({ show: false, message: '', severity: 'success' });
      }, 3000);
    } catch (error) {
      setAlert({
        show: true,
        message: 'An error occurred. Please try again.',
        severity: 'error'
      });
    }
  };

  // Function to reset the form
  const resetForm = () => {
    setAlert({ show: false, message: '', severity: 'success' });
    setUsername('');
    setPassword('');
    setResetEmail('');
    setShowForgotPassword(false);
    handleClose();
  };

  // Render the login modal with the login form and the password reset form
  return (
    <Modal open={open} onClose={resetForm}>
      <Box className="rh-auth-modal">
        <Collapse in={alert.show}>
          <Alert 
            severity={alert.severity}
            className="rh-auth-alert"
            onClose={() => setAlert({ ...alert, show: false })}
          >
            {alert.message}
          </Alert>
        </Collapse>

        {!showForgotPassword ? (
          <>
            <Typography className="rh-auth-title">
              Login
            </Typography>
            <TextField
              className="rh-auth-input"
              label="Username"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              className="rh-auth-input"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            <Button 
              className="rh-auth-submit"
              variant="contained" 
              fullWidth 
              onClick={handleLogin}
            >
              Login
            </Button>
            <Typography 
              className="rh-auth-link" 
              onClick={() => setShowForgotPassword(true)}
            >
              Forgot Password?
            </Typography>
            <Typography 
              className="rh-auth-link" 
              onClick={() => {
                resetForm();
                onRegisterClick();
              }}
            >
              Are you new? Register here
            </Typography>
          </>
        ) : (
          <>
            <Typography className="rh-auth-title">
              Reset Password
            </Typography>
            <TextField
              className="rh-auth-input"
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />
            <Button 
              className="rh-auth-submit"
              variant="contained" 
              fullWidth 
              onClick={handlePasswordReset}
            >
              Send Reset Link
            </Button>
            <Typography 
              className="rh-auth-link" 
              onClick={() => setShowForgotPassword(false)}
            >
              Back to Login
            </Typography>
          </>
        )}
      </Box>
    </Modal>
  );
} 