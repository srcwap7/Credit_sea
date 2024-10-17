import React, { useEffect, useState } from 'react';
import Navbar from './navbar';
import { 
  Container, Typography, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, 
  Paper, CircularProgress 
} from '@mui/material';
import { 
  Button, Modal, Box, TextField, MenuItem,
  Select, InputLabel, FormControl 
} from '@mui/material';
import { useSearchParams } from 'react-router-dom';

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

function HomePage() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('user');

  const [loanDetails, setLoanDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullname: '',
    amount: '',
    tenure: '',
    password: '',
    empstatus: 'Employed', 
    empaddress: '',
    applicationId: ''
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
     e.preventDefault();
     console.log(userId);
     const response = await fetch('http://localhost:5000/applyforloan',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({fullname:formData.fullname,amount:formData.amount,tenure:formData.tenure,empstatus:formData.empstatus,empaddress:formData.empaddress,purpose:formData.purpose,applicantId:userId})
     })
     if (response.ok){
      console.log("Good To Go");
      window.location.reload();
     }
     else{
      console.log("Loan Application Failed");
     }
  };

  useEffect(() => {
    const fetchLoanDetails = async () => {
      try {
        const response = await fetch("http://localhost:5000/gethomepage", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: userId })
        });
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const payload = await response.json(); // Await the JSON response
        const array = payload.loanApplications || []; // Ensure it's an array
        setLoanDetails(array);
      } catch (error) {
        console.log("Error fetching loan details:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };
    
    fetchLoanDetails();
  }, [userId]); // Add userId as a dependency

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <>
      <Navbar />
      <Container style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',marginTop:'20px'}}>
        <Typography variant="h4" align="center">Loan Application Dashboard</Typography>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Take A Loan
        </Button>
        
        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Application ID</strong></TableCell>
                <TableCell><strong>Full Name</strong></TableCell>
                <TableCell><strong>Amount</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loanDetails.map((loan) =>
                loan ? (
                  <TableRow key={loan._id}> {/* Use loan.id or loan._id based on your data */}
                  <TableCell>{loan._id}</TableCell>
                  <TableCell>{loan.fullname}</TableCell>
                  <TableCell>{loan.amount}</TableCell>
                  <TableCell>{loan.status}</TableCell>
                </TableRow>
              ):null
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Modal for loan application form */}
        <Modal open={open} onClose={handleClose}>
          <Box sx={modalStyle}>
            <Typography variant="h6" component="h2" align="center">Apply for a Loan</Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                name="fullname"
                label="Full Name"
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                name="amount"
                label="Loan Amount"
                type="number"
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                name="tenure"
                label="Tenure (in months)"
                type="number"
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <FormControl fullWidth margin="normal" required>
                <InputLabel id="employment-status-label">Employment Status</InputLabel>
                <Select
                  labelId="employment-status-label"
                  name="empstatus"
                  value={formData.empstatus}
                  onChange={handleChange}
                >
                  <MenuItem value="Employed">Employed</MenuItem>
                  <MenuItem value="Not Employed">Not Employed</MenuItem>
                </Select>
              </FormControl>
              <TextField
                name="purpose"
                label="Purpose"
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                name="empaddress"
                label="Employment Address"
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '16px' }}>
                Submit
              </Button>
            </form>
          </Box>
        </Modal>
      </Container>
    </>
  );
}

export default HomePage;