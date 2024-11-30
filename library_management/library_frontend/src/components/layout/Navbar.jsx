import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import LoginModal from '../account/LoginModal';
import RegisterModal from '../account/RegisterModal';
import { checkStaffStatus } from '../../services/api';
import './Navbar.css';

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
    <AppBar 
      position="static" 
      elevation={0} 
      className="navbar"
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Logo/Brand Section */}
        <Typography 
          variant="h5" 
          className="navbar-brand"
          onClick={() => navigate('/')}
        >
          ReadHaven
        </Typography>

        {/* Navigation Links */}
        <Box className="nav-links">
          <Button 
            onClick={() => navigate('/')} 
            className="nav-button"
          >
            Home
          </Button>
          
          <Button 
            onClick={() => navigate('/search')} 
            className="nav-button"
          >
            Search Books
          </Button>

          {/* Auth Buttons */}
          {user ? (
            <Box className="auth-buttons">
              <Button 
                onClick={() => navigate('/account')} 
                className="nav-button"
              >
                Account
              </Button>
              
              {isStaff && (
                <Button 
                  onClick={() => navigate('/librarian-page')} 
                  className="nav-button"
                >
                  Librarian
                </Button>
              )}
              
              <Button 
                onClick={logout} 
                className="nav-button"
              >
                Logout
              </Button>
            </Box>
          ) : (
            <Box className="auth-buttons">
              <Button 
                onClick={() => setLoginOpen(true)} 
                className="nav-button nav-button-bold"
              >
                Login
              </Button>
              
              <Button 
                onClick={() => setRegisterOpen(true)} 
                className="nav-button nav-button-bold"
              >
                Register
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
      <LoginModal open={isLoginOpen} handleClose={() => setLoginOpen(false)} />
      <RegisterModal open={isRegisterOpen} handleClose={() => setRegisterOpen(false)} />
    </AppBar>
  );
}
