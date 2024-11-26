import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import React, { useState } from 'react';
import LoginModal from '../account/LoginModal';
import RegisterModal from '../account/RegisterModal';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isRegisterOpen, setRegisterOpen] = useState(false);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Library Management
        </Typography>
        
        <Button color="inherit" onClick={() => navigate('/')}>
          Home
        </Button>
        
        {user ? (
          <>
            <Button color="inherit" onClick={() => navigate('/borrow')}>
              Borrow
            </Button>
            <Button color="inherit" onClick={() => navigate('/account')}>
              Account
            </Button>
            {user.is_staff && (
              <Button color="inherit" onClick={() => navigate('/librarian')}>
                Librarian
              </Button>
            )}
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" onClick={() => setLoginOpen(true)}>
              Login
            </Button>
            <Button color="inherit" onClick={() => setRegisterOpen(true)}>
              Register
            </Button>
          </>
        )}
      </Toolbar>
      <LoginModal open={isLoginOpen} handleClose={() => setLoginOpen(false)} />
      <RegisterModal open={isRegisterOpen} handleClose={() => setRegisterOpen(false)} />
    </AppBar>
  );
}
