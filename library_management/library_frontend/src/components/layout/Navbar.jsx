import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LoginModal from '../account/LoginModal';
import RegisterModal from '../account/RegisterModal';
import { checkStaffStatus } from '../../services/api';
import './Navbar.css';

//Component for the navbar to navigate the user through the website
export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isRegisterOpen, setRegisterOpen] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // useEffect hook to fetch the staff status of the user
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
    // Fetch the staff status of the user
    fetchStaffStatus();
  }, [user]);

  //Function to check if the current path is the same as the path passed in
  const isActive = (path) => {
    return location.pathname === path;
  };

  //Function to navigate the user to the path passed in
  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  //Function to logout the user
  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  //Function to render the navigation links
  const renderNavLinks = (isMobile = false) => {
    const buttonClass = isMobile ? 'rh-nav-button-mobile' : 'rh-nav-button';
    
    //Part of the navbar where the buttons for the navigation links are displayed
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
          //If the user is logged in, display the account and, if it's also staff, display the librarian button
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
          //If the user is not logged in, display the login and register buttons
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

  //Main component where the navbar is displayed
  //There are two parts to the navbar, the desktop and the mobile part
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

        
        <Box className="rh-nav-links desktop-only">
          {renderNavLinks()}
        </Box>

        <IconButton
          className="rh-mobile-menu-icon"
          onClick={() => setMobileMenuOpen(true)}
        >
          <MenuIcon />
        </IconButton>

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
      <LoginModal 
        open={isLoginOpen} 
        handleClose={() => setLoginOpen(false)} 
        onRegisterClick={() => {
          setLoginOpen(false);
          setRegisterOpen(true);
        }}
      />
      <RegisterModal open={isRegisterOpen} handleClose={() => setRegisterOpen(false)} />
    </AppBar>
  );
}
