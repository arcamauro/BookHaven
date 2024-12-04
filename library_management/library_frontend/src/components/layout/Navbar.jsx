import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LoginModal from '../account/LoginModal';
import RegisterModal from '../account/RegisterModal';
import { checkStaffStatus } from '../../services/api';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isRegisterOpen, setRegisterOpen] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  const renderNavLinks = (isMobile = false) => {
    const buttonClass = isMobile ? 'rh-nav-button-mobile' : 'rh-nav-button';
    
    return (
      <>
        <Button 
          onClick={() => handleNavigation('/')} 
          className={`${buttonClass} ${isActive('/') ? 'active' : ''}`}
          fullWidth={isMobile}
        >
          Home
        </Button>
        
        <Button 
          onClick={() => handleNavigation('/search')} 
          className={`${buttonClass} ${isActive('/search') ? 'active' : ''}`}
          fullWidth={isMobile}
        >
          Search Books
        </Button>

        {user ? (
          <>
            <Button 
              onClick={() => handleNavigation('/account')} 
              className={`${buttonClass} ${isActive('/account') ? 'active' : ''}`}
              fullWidth={isMobile}
            >
              Account
            </Button>
            
            {isStaff && (
              <Button 
                onClick={() => handleNavigation('/librarian-page')} 
                className={`${buttonClass} ${isActive('/librarian-page') ? 'active' : ''}`}
                fullWidth={isMobile}
              >
                Librarian
              </Button>
            )}
            
            <Button 
              onClick={handleLogout} 
              className={buttonClass}
              fullWidth={isMobile}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button 
              onClick={() => { setLoginOpen(true); setMobileMenuOpen(false); }} 
              className={`${buttonClass} rh-nav-button-bold`}
              fullWidth={isMobile}
            >
              Login
            </Button>
            
            <Button 
              onClick={() => { setRegisterOpen(true); setMobileMenuOpen(false); }} 
              className={`${buttonClass} rh-nav-button-bold`}
              fullWidth={isMobile}
            >
              Register
            </Button>
          </>
        )}
      </>
    );
  };

  return (
    <AppBar position="static" elevation={0} className="rh-navbar">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography 
          variant="h5" 
          className="rh-navbar-brand"
          onClick={() => handleNavigation('/')}
        >
          ReadHaven
        </Typography>

        {/* Desktop Navigation */}
        <Box className="rh-nav-links desktop-only">
          {renderNavLinks()}
        </Box>

        {/* Mobile Menu Icon */}
        <IconButton
          className="rh-mobile-menu-icon"
          onClick={() => setMobileMenuOpen(true)}
        >
          <MenuIcon />
        </IconButton>

        {/* Mobile Navigation Drawer */}
        <Drawer
          anchor="right"
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          className="rh-mobile-drawer"
        >
          <Box className="rh-mobile-drawer-content">
            <IconButton
              className="rh-mobile-close-button"
              onClick={() => setMobileMenuOpen(false)}
            >
              <CloseIcon />
            </IconButton>
            <List className="rh-mobile-nav-list">
              {renderNavLinks(true)}
            </List>
          </Box>
        </Drawer>
      </Toolbar>
      <LoginModal open={isLoginOpen} handleClose={() => setLoginOpen(false)} />
      <RegisterModal open={isRegisterOpen} handleClose={() => setRegisterOpen(false)} />
    </AppBar>
  );
}
