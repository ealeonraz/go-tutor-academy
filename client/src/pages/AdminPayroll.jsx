import React, { useState, useEffect } from 'react';
import Navbar from '../components/LoggedInNavbar';
import DashboardNavbar from '../components/DashboardNavbar'; 
import Footer from '../components/Footer';
import './AdminPayroll.css';

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
    <div className="admin-dashboard-container">
      <Navbar />
      <DashboardNavbar />
      <div className="admin-dashboard-content">
        
        {/* Payroll Summary Section */}
        <h2>Payroll Overview</h2>
        <div className="payroll-summary">
          <p><strong>Total Payroll this Period:</strong> ${totalPayroll.toFixed(2)}</p>
          {/* Breakdown by subject */}
          <div>
            <strong>Expenditures by Subject:</strong>
            <ul>
              {Object.entries(breakdownBySubject).map(([subject, amount]) => (
                <li key={subject}>
                  {subject}: ${amount.toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Employees Payroll Table */}
        <table className="payroll-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Subject</th>
              <th>Students Taught</th>
              <th>Pay Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.id}>
                <td>{emp.name}</td>
                <td>{emp.subject}</td>
                <td>{emp.students}</td>
                <td>${emp.pay.toFixed(2)}</td>
                <td style={{ fontWeight: 'bold', color: emp.paid ? 'green' : 'red' }}>
                  {emp.paid ? 'Paid' : 'Unpaid'}
                </td>
                <td>
                  {!emp.paid ? (
                    <button 
                      onClick={() => markAsPaid(emp.id)} 
                      className="submit-pay-btn"
                      title="Mark as paid"
                    >
                      Submit Pay
                    </button>
                  ) : (
                    <span style={{ color: 'gray' }}>✔︎</span>  
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Toggle to view payment history */}
        <div>
          <button 
            onClick={() => setShowHistory(prev => !prev)} 
            title="View Pay History"
          >
            {showHistory ? 'Hide History' : 'View Pay History'}
          </button>
        </div>

        {/* Payment History Section (optional) */}
        {showHistory && (
          <div className="pay-history">
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
