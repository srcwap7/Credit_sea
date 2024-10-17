import React, { useState } from 'react';
import { 
  Button, Modal, Box, TextField, MenuItem, Typography, 
  Select, InputLabel, FormControl 
} from '@mui/material';

// Modal styling
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '8px'
};

function TakeLoanForm() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullname: '',
    amount: '',
    tenure: '',
    password: '',
    empstatus: 'Employed', // Default value
    empaddress: '',
    applicationId: ''
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    // You can call an API here to submit the loan application
    handleClose();
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Take A Loan
      </Button>

      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" mb={2} align="center">
            Apply for Loan
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Full Name"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Loan Amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Tenure (Months)"
              name="tenure"
              type="number"
              value={formData.tenure}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Employment Status</InputLabel>
              <Select
                name="empstatus"
                value={formData.empstatus}
                onChange={handleChange}
              >
                <MenuItem value="Employed">Employed</MenuItem>
                <MenuItem value="Not Employed">Not Employed</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              margin="normal"
              label="Employment Address"
              name="empaddress"
              value={formData.empaddress}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Application ID"
              name="applicationId"
              value={formData.applicationId}
              onChange={handleChange}
              required
            />
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              fullWidth 
              sx={{ mt: 2 }}
            >
              Submit Application
            </Button>
          </form>
        </Box>
      </Modal>
    </>
  );
}

export default TakeLoanForm;
