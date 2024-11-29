import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import React, { useState, useEffect } from 'react';
import LoginModal from '../account/LoginModal';
import RegisterModal from '../account/RegisterModal';
import { checkStaffStatus } from '../../services/api';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isRegisterOpen, setRegisterOpen] = useState(false);
  const [isStaff, setIsStaff] = useState(false);

  useEffect(() => {
    const fetchStaffStatus = async () => {
      if (user) {
        try {
          const isStaff = await checkStaffStatus();
          setIsStaff(isStaff);
        } catch (error) {
          console.error('Error fetching staff status:', error);
        }
      }
    };

    fetchStaffStatus();
  }, [user]);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Library Management
        </Typography>
        
        <Button color="inherit" onClick={() => navigate('/')}>
          Home
        </Button>
        <Button color="inherit" onClick={() => navigate('/search')}>
          Search a book
        </Button>
        {user ? (
          <>
            <Button color="inherit" onClick={() => navigate('/account')}>
              Account
            </Button>
            {isStaff && (
              <Button color="inherit" onClick={() => navigate('/users-books')}>
                Manage users' books
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
