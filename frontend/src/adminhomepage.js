// src/pages/AdminHomePage.js
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography,CircularProgress, TextField } from '@mui/material';

const AdminHomePage = () => {
  const [searchParams] = useSearchParams();
  const adminId = searchParams.get('admin');

  const [data, setData] = useState({ loans: [], admins: [], verifier: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedVerifier, setSelectedVerifier] = useState(null); // Track selected verifier
  const [dialogOpen, setDialogOpen] = useState(false); // Track dialog state
  const [removalLoading, setRemovalLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);


  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    username: '',
    password: '',
  });



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://credit-sea.onrender.com/adminhomepage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ adminId }),
        });

        if (!response.ok) throw new Error('Failed to fetch data.');
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (err) {
        console.error('API Error:', err);
        setError('Failed to fetch data. Please try again.');
        setLoading(false);
      }
    };

    if (adminId) fetchData();
    else {
      setError('Admin ID is missing in the query.');
      setLoading(false);
    }
  }, [adminId]);

  const handleRowClick = (verifier) => {
    setSelectedVerifier(verifier); // Set the clicked verifier
    setDialogOpen(true); // Open the dialog
  };

  const handleDialogClose = () => {
    setDialogOpen(false); // Close the dialog
    setSelectedVerifier(null); // Reset selected verifier
  };

  const handleRemoveVerifier = async () => {
    if (!selectedVerifier) return;

    setRemovalLoading(true);
    try {
      const response = await fetch('https://credit-sea.onrender.com//removeverifier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verifierId: selectedVerifier[0] }),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Verifier removed successfully!');
        // Remove the verifier from the list in the UI
        setData((prevData) => ({
          ...prevData,
          verifier: prevData.verifier.filter(
            (v) => v[0] !== selectedVerifier[0]
          ),
        }));
        handleDialogClose();
        window.location.reload();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error removing verifier:', error);
      alert('Unexpected error occurred.');
    } finally {
      setRemovalLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form data to add verifier
  const handleSubmit = async () => {
    try {
      const response = await fetch('https://credit-sea.onrender.com/addverifier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to add verifier.');

      const result = await response.json();
      alert(result.message); // Show success message

      // Close the dialog and reset form
      setOpenDialog(false);
      setFormData({ fullname: '', email: '', username: '', password: '' });
      window.location.reload();
    } catch (error) {
      console.error('API Error:', error);
      alert('Error adding verifier.');
    }
  };



  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  const Table = ({ headers, data, onRowClick }) => (
    <table style={styles.table}>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index} style={styles.headerCell}>
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr
            key={index}
            style={styles.row}
            onClick={() => onRowClick(row)}
          >
            {row.map((cell, cellIndex) => (
              <td key={cellIndex} style={styles.cell}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Admin Dashboard</h1>

      <section style={styles.section}>
        <h2>Loans</h2>
        <Table
          headers={['Application ID', 'Applier Name', 'Tenure', 'Amount', 'Status']}
          data={data.loans.map(({ _id, fullname, tenure, amount, status }) => [
            _id,
            fullname,
            tenure,
            amount,
            status,
          ])}
        />
      </section>

      <section style={styles.section}>
        <h2>Verifiers</h2>
        <Table
          headers={['Verifier Id', 'Email', 'Username']}
          data={data.verifier.map(({ _id, email, username }) => [
            _id,
            email,
            username,
          ])}
          onRowClick={(verifier) =>
            handleRowClick(verifier)
          }
        />
      </section>

      <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
        <Button variant="contained" onClick={() => setOpenDialog(true)}>Add Verifier</Button>
      </div>

      <section style={styles.section}>
        <h2>Admins</h2>
        <Table
          headers={['Name', 'Email', 'Username']}
          data={data.admins.map(({ fullname, email, username }) => [
            fullname,
            email,
            username,
          ])}
        />
      </section>

      {/* Verifier Detail Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Verifier Details</DialogTitle>
        <DialogContent>
          {selectedVerifier ? (
            <div>
              <Typography><strong>Id:</strong> {selectedVerifier[0]}</Typography>
              <Typography><strong>Email:</strong> {selectedVerifier[1]}</Typography>
              <Typography><strong>Username:</strong> {selectedVerifier[2]}</Typography>
            </div>
          ) : (
            <p>No verifier selected.</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Close
          </Button>
          <Button
            onClick={handleRemoveVerifier}
            color="secondary"
            disabled={removalLoading}
          >
          {removalLoading ? <CircularProgress size={24} /> : 'Remove'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add Verifier</DialogTitle>
        <DialogContent style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <TextField
            label="Full Name"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          <TextField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
};

// CSS-in-JS styling
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f8f9fa',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#343a40',
  },
  section: {
    marginBottom: '30px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '10px',
    boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
  },
  headerCell: {
    backgroundColor: '#343a40',
    color: '#fff',
    padding: '10px',
    textAlign: 'left',
    fontWeight: 'bold',
  },
  row: {
    backgroundColor: '#fff',
    transition: 'background-color 0.3s',
    cursor: 'pointer',
  },
  cell: {
    padding: '10px',
    borderBottom: '1px solid #ddd',
  },
};

export default AdminHomePage;
