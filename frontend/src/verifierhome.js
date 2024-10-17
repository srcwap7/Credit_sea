import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

function buttonStyle(color) {
    return {
      padding: '10px 20px',
      backgroundColor: color,
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      width: '30%',
    };
}

const VerifierHomePage = () => {
  const [searchParams] = useSearchParams();
  const verifierId = searchParams.get('verifier');
  const [loans, setLoans] = useState([]);
  const [error, setError] = useState(null);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRowClick = (loan) => {
    setSelectedLoan(loan);
    setIsModalOpen(true);
  };


  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLoan(null);
  };

  const handleLoanAction = async (action) => {
    const apiUrl = `https://credit-sea.onrender.com/${action}loan`; // Dynamic endpoint
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId: selectedLoan._id }),
      });
      if (response.ok) {
        const data = await response.json();
        alert(`${action.charAt(0).toUpperCase() + action.slice(1)} successful!`);
        closeModal();
        window.location.reload();
      } else {
        alert(`Failed to ${action} loan.`);
      }
    } catch (error) {
      alert(`Error: Unable to ${action} loan.`);
    }
  };

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await fetch("https://credit-sea.onrender.com/verifierhomepage",{
            method:'POST',
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({verifierId:verifierId})
        });

        if (response.status === 200) {
          const data = await response.json();
          setLoans(data.approval);
        } else {
          setError('Failed to fetch loan data.');
        }
      } catch (err) {
        console.error(err);
        setError('Unexpected error occurred.');
      }
    };

    if (verifierId) {
      fetchLoans();
    } else {
      setError('Missing verifier ID in URL.');
    }
  }, [verifierId]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
  <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>
    Verifier Loan Approvals
  </h1>

  {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

  <table
    style={{
      width: '100%',
      borderCollapse: 'collapse',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
      marginTop: '20px',
    }}
  >
    <thead>
      <tr style={{ backgroundColor: '#4CAF50', color: 'white' }}>
        <th style={{ padding: '12px', textAlign: 'left' }}>Full Name</th>
        <th style={{ padding: '12px', textAlign: 'left' }}>Tenure (Months)</th>
        <th style={{ padding: '12px', textAlign: 'left' }}>Amount (₹)</th>
        <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
      </tr>
    </thead>
    <tbody>
          {loans.length > 0 ? (
            loans.map((loan) => (
              <tr
                key={loan._id}
                style={{ backgroundColor: '#f2f2f2', cursor: 'pointer' }}
                onClick={() => handleRowClick(loan)}
              >
                <td style={{ padding: '12px' }}>{loan.fullname}</td>
                <td style={{ padding: '12px' }}>{loan.tenure}</td>
                <td style={{ padding: '12px' }}>{loan.amount}</td>
                <td
                  style={{
                    padding: '12px',
                    color:
                      loan.status === 'approved'
                        ? 'green'
                        : loan.status === 'pending'
                        ? 'orange'
                        : loan.status === "verified"
                        ? 'blue'
                        : 'red',
                    fontWeight: 'bold',
                  }}
                >
                  {loan.status}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: '12px' }}>
                No loans assigned.
              </td>
            </tr>
          )}
        </tbody>
  </table>
  {isModalOpen && selectedLoan && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '30px',
            width: '500px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            zIndex: 1000,
            borderRadius: '8px',
          }}
        >
          <h2>Loan Details</h2>
          <p><strong>Full Name:</strong> {selectedLoan.fullname}</p>
          <p><strong>Employment Status:</strong> {selectedLoan.empstatus}</p>
          <p><strong>Employee Address:</strong> {selectedLoan.empaddress}</p>
          <p><strong>Tenure:</strong> {selectedLoan.tenure} months</p>
          <p><strong>Amount:</strong> ₹{selectedLoan.amount}</p>
          <p><strong>Status:</strong> {selectedLoan.status}</p>

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
            <button
              onClick={() => handleLoanAction('verify')}
              style={buttonStyle('blue')}
            >
              Verify
            </button>
            <button
              onClick={() => handleLoanAction('approve')}
              style={buttonStyle('green')}
            >
              Approve
            </button>
            <button
              onClick={() => handleLoanAction('reject')}
              style={buttonStyle('red')}
            >
              Reject
            </button>
          </div>

          <button
            onClick={closeModal}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            Close
          </button>
        </div>
      )}

      {/* Modal Overlay */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
          }}
          onClick={closeModal}
        />
      )}
</div>

  );
};

export default VerifierHomePage;
