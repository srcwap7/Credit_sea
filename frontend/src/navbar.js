// Navbar.js
import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee'; // Uncomment for Rupee
import AccountCircle from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import PaymentIcon from '@mui/icons-material/Payment';

const Navbar = () => {
  return (
    <AppBar 
      position="static" 
      sx={{ 
        backgroundColor: '#fff', 
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)' 
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', padding: '0 2rem' }}>
        
        {/* Left Section - Nav Links */}
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Button 
            startIcon={<HomeIcon />} 
            sx={navButtonStyle} 
            href="#home"
          >
            Home
          </Button>


          <Button 
            startIcon={<CurrencyRupeeIcon />} 
            sx={navButtonStyle} 
            href="#payment"
          >
            Payment
          </Button> 

          <Button
            startIcon={<PaymentIcon />}
            sx={navButtonStyle}
            href="#cards"
          >
            Cards
          </Button>
        </Box>

        {/* Right Section - User Icons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <IconButton sx={iconButtonStyle}>
            <AccountCircle />
          </IconButton>
          <IconButton sx={iconButtonStyle}>
            <SettingsIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

// Custom Styles
const navButtonStyle = {
  color: '#333',
  fontWeight: 600,
  fontSize: '1rem',
  '&:hover': {
    backgroundColor: '#f0f0f0',
    transform: 'scale(1.05)',
    transition: 'all 0.2s',
  },
};

const iconButtonStyle = {
  color: '#333',
  '&:hover': {
    backgroundColor: '#f0f0f0',
    borderRadius: '50%',
    transition: 'all 0.3s',
  },
};

export default Navbar;
