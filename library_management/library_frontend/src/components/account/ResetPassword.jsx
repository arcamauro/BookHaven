import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {Box, Typography, TextField, Button, Container, Alert, Collapse, CircularProgress} from '@mui/material';
import { confirmPasswordReset } from '../../services/api';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);
  const { uidb64, token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ show: false, message: '', severity: 'success' });

    if (newPassword !== confirmPassword) {
      setAlert({
        show: true,
        message: 'Passwords do not match',
        severity: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      await confirmPasswordReset(uidb64, token, newPassword);
      setAlert({
        show: true,
        message: 'Password reset successful! You will be redirected to home...',
        severity: 'success'
      });
      
      // Redirect after showing success message
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      setAlert({
        show: true,
        message: error.response?.data?.error || 'An error occurred. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5" className="rh-auth-title">
          Reset Your Password
        </Typography>

        <Collapse in={alert.show} sx={{ width: '100%', mb: 2 }}>
          <Alert 
            severity={alert.severity}
            onClose={() => setAlert({ ...alert, show: false })}
          >
            {alert.message}
          </Alert>
        </Collapse>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            className="rh-auth-input"
            margin="normal"
            required
            fullWidth
            name="password"
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={loading}
          />
          <TextField
            className="rh-auth-input"
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            className="rh-auth-submit"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Reset Password'
            )}
          </Button>
        </Box>
      </Box>
    </Container>
  );
} 