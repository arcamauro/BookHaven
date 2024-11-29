import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

export default function LoginModal({ open, handleClose }) {
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
      <Box sx={{ 
        position: 'absolute', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)', 
        width: 300,
        bgcolor: 'background.paper', 
        boxShadow: 24, 
        p: 4 
      }}>
        <Typography variant="h6" component="h2">
          Login
        </Typography>
        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button 
          variant="contained" 
          sx={{ 
            backgroundColor: '#FFBA08', 
            color: '#000000', 
            '&:hover': { backgroundColor: '#e0a806' } 
          }}
          fullWidth 
          onClick={handleLogin}
        >
          Login
        </Button>
      </Box>
    </Modal>
  );
} 