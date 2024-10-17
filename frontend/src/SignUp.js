import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // For navigation

const SignupForm = () => {
  const [formData, setFormData] = useState({ username: '', email: '' });
  const [success, setSuccess] = useState(null); 
  const [otpSent, setOtpSent] = useState(false); 
  const [otp, setOtp] = useState(''); 
  const [loading, setLoading] = useState(false); 
  const [timer, setTimer] = useState(0); 

  const navigate = useNavigate(); // For redirecting to the Set Password page

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true); // Show spinner
    setSuccess(null); // Clear previous messages

    try {
      const response = await fetch('https://credit-sea.onrender.com/sendEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: formData.email }),
      });

      if (response.ok) {
        setOtpSent(true);
        setSuccess('OTP sent successfully!');
        setTimer(300); // Start the 300-second timer
      } else {
        setSuccess('Failed to send OTP.');
      }
    } catch (error) {
      setSuccess('An error occurred while sending the OTP.');
    } finally {
      setLoading(false); 
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://credit-sea.onrender.com/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, token: otp }),
      });

      const result = await response.json();
      if (response.status === 200) {
        setSuccess('OTP verified successfully!');
        navigate('/setPassword',{
          state: { email: formData.email, username: formData.username },
        }); 
      } else {
        setSuccess(result || "OTP did not match.");
      }
    } catch (error) {
      setSuccess('An error occurred during OTP verification.');
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval); 
    }
  }, [timer]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box
        component="form"
        onSubmit={handleSendOtp}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          maxWidth: 400,
          margin: 'auto',
          marginTop: 8,
          padding: 3,
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" textAlign="center" gutterBottom>
          Sign Up
        </Typography>
        <TextField
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          required
        />

        {loading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
            <CircularProgress size={24} />
            <Typography variant="body2">Please wait...</Typography>
          </Box>
        ) : (
          <Button type="submit" variant="contained" color="primary" disabled={timer > 0}>
            Send OTP
          </Button>
        )}

        {otpSent && (
          <>
            <TextField
              label="Enter OTP"
              value={otp}
              onChange={handleOtpChange}
              fullWidth
              required
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={handleVerifyOtp}
            >
              Verify OTP
            </Button>
          </>
        )}

        {timer > 0 && (
          <Typography variant="body2" textAlign="center">
            You can resend OTP in {timer} seconds.
          </Typography>
        )}

        {success && (
          <Typography variant="body2" color="error" textAlign="center">
            {success}
          </Typography>
        )}
      </Box>
    </div>
  );
};

export default SignupForm;
