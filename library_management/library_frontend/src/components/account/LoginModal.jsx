import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

export default function LoginModal({ open, handleClose, onRegisterClick }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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

  return (
    <Modal open={open} onClose={handleClose}>
      <Box className="rh-auth-modal">
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
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          onClick={() => {
            handleClose();
            onRegisterClick();
          }}
        >
          Are you new? Register here
        </Typography>
      </Box>
    </Modal>
  );
} 