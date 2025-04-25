import React, { useState, useEffect } from 'react';
import Navbar from '../components/LoggedInNavbar';
import DashboardNavbar from '../components/DashboardNavbar';  // assumed admin nav component
import Footer from '../components/Footer';

function AdminPayrollPage() {
  // State for current period payroll data
  const [employees, setEmployees] = useState([
    { id: 1, name: "Alice Johnson", subject: "Math", students: 30, pay: 500, paid: false },
    { id: 2, name: "Bob Lee", subject: "Science", students: 25, pay: 450, paid: false },
    { id: 3, name: "Catherine Smith", subject: "History", students: 20, pay: 480, paid: false }
  ]);
  const [history, setHistory] = useState([]);    // to track payment history events (optional)
  const [showHistory, setShowHistory] = useState(false);

  // Effect to fetch payroll data from backend (placeholder)
  useEffect(() => {
    // Example: fetch('/api/payroll/current').then(res => res.json()).then(data => setEmployees(data));
    // For now, using static initial state defined above.
  }, []);

  // Compute total payroll cost for current period
  const totalPayroll = employees.reduce((sum, emp) => sum + emp.pay, 0);

  // Compute breakdown of expenditures by subject
  const breakdownBySubject = employees.reduce((acc, emp) => {
    acc[emp.subject] = (acc[emp.subject] || 0) + emp.pay;
    return acc;
  }, {});

  // Handler to mark an employee as paid
  const markAsPaid = (employeeId) => {
    setEmployees(prev =>
      prev.map(emp => {
        if(emp.id === employeeId) {
          // Mark this employee as paid
          return { ...emp, paid: true };
        }
        return emp;
      })
    );
    // Record this payment in history (with timestamp)
    const paidEmp = employees.find(emp => emp.id === employeeId);
    if(paidEmp) {
      const now = new Date();
      const historyEntry = {
        employee: paidEmp.name,
        amount: paidEmp.pay,
        date: now.toLocaleString()
      };
      setHistory(prev => [...prev, historyEntry]);
    }
  };

  return (
    <div className="admin-dashboard-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <AdminDashboardNavbar />
      <div className="admin-dashboard-content" style={{ flex: 1, backgroundColor: 'var(--primary)', padding: '2em', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Payroll Summary Section */}
        <h2>Payroll Overview</h2>
        <div className="payroll-summary" style={{ marginBottom: '1.5em', textAlign: 'center' }}>
          <p><strong>Total Payroll this Period:</strong> ${totalPayroll.toFixed(2)}</p>
          {/* Breakdown by subject */}
          <div>
            <strong>Expenditures by Subject:</strong>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0.5em 0' }}>
              {Object.entries(breakdownBySubject).map(([subject, amount]) => (
                <li key={subject}>
                  {subject}: ${amount.toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Employees Payroll Table */}
        <table className="payroll-table" style={{ width: '100%', maxWidth: '45em', borderCollapse: 'collapse', backgroundColor: 'white' }}>
          <thead style={{ backgroundColor: 'var(--secondary)', color: 'white' }}>
            <tr>
              <th style={{ padding: '0.5em' }}>Employee</th>
              <th style={{ padding: '0.5em' }}>Subject</th>
              <th style={{ padding: '0.5em' }}>Students Taught</th>
              <th style={{ padding: '0.5em' }}>Pay Amount</th>
              <th style={{ padding: '0.5em' }}>Status</th>
              <th style={{ padding: '0.5em' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.id} style={{ textAlign: 'center', borderBottom: '1px solid #ccc' }}>
                <td style={{ padding: '0.5em' }}>{emp.name}</td>
                <td style={{ padding: '0.5em' }}>{emp.subject}</td>
                <td style={{ padding: '0.5em' }}>{emp.students}</td>
                <td style={{ padding: '0.5em' }}>${emp.pay.toFixed(2)}</td>
                <td style={{ padding: '0.5em', fontWeight: 'bold', color: emp.paid ? 'green' : 'red' }}>
                  {emp.paid ? 'Paid' : 'Unpaid'}
                </td>
                <td style={{ padding: '0.5em' }}>
                  {!emp.paid ? (
                    <button 
                      onClick={() => markAsPaid(emp.id)} 
                      style={{
                        backgroundColor: 'var(--primary)', color: 'black',
                        border: `2px groove var(--secondary)`, borderRadius: '5px',
                        padding: '0.4em 0.8em', cursor: 'pointer', fontWeight: 'bold'
                      }}
                      title="Mark as paid"
                    >
                      Submit Pay
                    </button>
                  ) : (
                    <span style={{ color: 'gray' }}>✔︎</span>  /* checkmark indicating already paid */
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Toggle to view payment history */}
        <div style={{ marginTop: '2em' }}>
          <button 
            onClick={() => setShowHistory(prev => !prev)} 
            style={{
              backgroundColor: 'var(--secondary)', color: 'white', fontWeight: 'bold',
              border: 'none', borderRadius: '4px', padding: '0.5em 1em', cursor: 'pointer'
            }}
          >
            {showHistory ? 'Hide History' : 'View Pay History'}
          </button>
        </div>

        {/* Payment History Section (optional) */}
        {showHistory && (
          <div className="pay-history" style={{ marginTop: '1em', maxWidth: '45em', textAlign: 'left' }}>
            <h3>Past Payment History</h3>
            {history.length === 0 ? (
              <p>No past payments recorded.</p>
            ) : (
              <ul>
                {history.map((entry, index) => (
                  <li key={index}>
                    {entry.employee} – Paid ${entry.amount.toFixed(2)} on {entry.date}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
}

export default AdminPayrollPage;
