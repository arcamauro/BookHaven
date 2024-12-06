import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, IconButton, InputAdornment } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { requestPasswordReset } from '../../services/api';

export default function LoginModal({ open, handleClose, onRegisterClick }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    const success = await login(username, password);
    if (success) {
      setUsername('');
      setPassword('');
      handleClose();
    } else {
      alert('Login failed. Please check your credentials.');
    }
  };

  const handlePasswordReset = async () => {
    try {
      await requestPasswordReset(resetEmail);
      alert('If an account exists with this email, you will receive password reset instructions.');
      setShowForgotPassword(false);
      setResetEmail('');
    } catch (error) {
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box className="rh-auth-modal">
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
                handleClose();
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