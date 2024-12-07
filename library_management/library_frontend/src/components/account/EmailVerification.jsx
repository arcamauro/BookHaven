import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { verifyEmail } from '../../services/api';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';

// Component to verify the user's email and handle the verification process
const EmailVerification = () => {
  const { uidb64, token } = useParams();
  const [status, setStatus] = useState('verifying');
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await verifyEmail(uidb64, token);
        setStatus('success');
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } catch (error) {
        setStatus('error');
      }
    };

    if (uidb64 && token) {
      verify();
    }
  }, [uidb64, token, navigate]);

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      mt: 4 
    }}>
      {status === 'verifying' && (
        <>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Verifying your email...</Typography>
        </>
      )}
      {status === 'success' && (
        <Alert severity="success">
          Email verified successfully! Redirecting to home page...
        </Alert>
      )}
      {status === 'error' && (
        <Alert severity="error">
          Failed to verify email. The link may be invalid or expired.
        </Alert>
      )}
    </Box>
  );
};

export default EmailVerification; 