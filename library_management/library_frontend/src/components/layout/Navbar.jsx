import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material';
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
    <AppBar 
      position="static" 
      sx={{ 
        backgroundColor: '#14213D',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Logo/Brand Section */}
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 'bold',
            color: '#FFFFFF',
            cursor: 'pointer',
            '&:hover': { opacity: 0.9 }
          }}
          onClick={() => navigate('/')}
        >
          ReadHaven
        </Typography>

        {/* Navigation Links */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button 
            onClick={() => navigate('/')} 
            sx={{ 
              color: '#FFFFFF',
              '&:hover': { 
                backgroundColor: 'rgba(255,255,255,0.1)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            Home
          </Button>
          
          <Button 
            onClick={() => navigate('/search')} 
            sx={{ 
              color: '#FFFFFF',
              '&:hover': { 
                backgroundColor: 'rgba(255,255,255,0.1)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            Search Books
          </Button>

          {/* Auth Buttons */}
          {user ? (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                onClick={() => navigate('/account')} 
                sx={{ 
                  color: '#14213D',
                  backgroundColor: '#FFBA08',
                  fontWeight: 'bold',
                  '&:hover': { 
                    backgroundColor: '#ffc534',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                Account
              </Button>
              
              {isStaff && (
                <Button 
                  onClick={() => navigate('/librarian-page')} 
                  sx={{ 
                    color: '#14213D',
                    backgroundColor: '#FFBA08',
                    fontWeight: 'bold',
                    '&:hover': { 
                      backgroundColor: '#ffc534',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  Librarian
                </Button>
              )}
              
              <Button 
                onClick={logout} 
                sx={{ 
                  color: '#14213D',
                  backgroundColor: '#FFBA08',
                  fontWeight: 'bold',
                  '&:hover': { 
                    backgroundColor: '#ffc534',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                Logout
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                onClick={() => setLoginOpen(true)} 
                sx={{ 
                  color: '#14213D',
                  backgroundColor: '#FFBA08',
                  fontWeight: 'bold',
                  '&:hover': { 
                    backgroundColor: '#ffc534',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                Login
              </Button>
              
              <Button 
                onClick={() => setRegisterOpen(true)} 
                sx={{ 
                  color: '#14213D',
                  backgroundColor: '#FFBA08',
                  fontWeight: 'bold',
                  '&:hover': { 
                    backgroundColor: '#ffc534',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
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
