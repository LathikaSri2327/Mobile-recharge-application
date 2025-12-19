import React, { useState, useEffect } from 'react';
import { generateTransactionId, generateReferenceNumber } from '../utils/tokenGenerator';
import './CustomerDashboard.css';

const CustomerDashboard = () => {
  const [walletBalance, setWalletBalance] = useState(0);
  const [addAmount, setAddAmount] = useState('');
  const [rechargeHistory, setRechargeHistory] = useState([]);

  const [loading, setLoading] = useState(false);
  const [billData, setBillData] = useState({
    billType: '',
    amount: '',
    consumerNumber: ''
  });
  const [billLoading, setBillLoading] = useState(false);
  const [rechargeData, setRechargeData] = useState({
    phoneNumber: '',
    amount: '',
    operator: ''
  });
  const [rechargeLoading, setRechargeLoading] = useState(false);
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPlans, setShowPlans] = useState(false);

  useEffect(() => {
    fetchWalletBalance();
    fetchRechargeHistory();
    fetchPlans();
    
    // Auto-populate phone number from user data
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser?.phone) {
      setRechargeData(prev => ({
        ...prev,
        phoneNumber: currentUser.phone
      }));
    }
    
    // Listen for recharge completion events
    const handleRechargeCompleted = () => {
      fetchRechargeHistory();
      fetchWalletBalance();
    };
    
    window.addEventListener('rechargeCompleted', handleRechargeCompleted);
    
    return () => {
      window.removeEventListener('rechargeCompleted', handleRechargeCompleted);
    };
  }, []);

  const fetchWalletBalance = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/wallet/balance', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setWalletBalance(data.balance || 0);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const fetchRechargeHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/recharge/history', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setRechargeHistory(data);
    } catch (error) {
      console.error('Error fetching recharge history:', error);
    }
  };

  const fetchPlans = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/plans', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setPlans(data);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const selectPlan = (plan) => {
    setSelectedPlan(plan);
    setRechargeData(prev => ({
      ...prev,
      amount: plan.amount
    }));
    setShowPlans(false);
  };



  const addMoneyToWallet = async (e) => {
    e.preventDefault();
    
    const amount = parseFloat(addAmount);
    if (!addAmount || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    if (amount < 10) {
      alert('Minimum amount is ₹10');
      return;
    }
    
    if (amount > 50000) {
      alert('Maximum amount is ₹50,000');
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/wallet/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount: amount })
      });

      if (response.ok) {
        const data = await response.json();
        const transactionId = generateTransactionId();
        const referenceNumber = generateReferenceNumber();
        
        setWalletBalance(data.balance);
        
        alert(`💰 Money Added Successfully!\n\n💵 Amount: ₹${addAmount}\n💳 New Balance: ₹${data.balance}\n\n🔢 Transaction ID: ${transactionId}\n📋 Reference: ${referenceNumber}\n\n⏰ Date: ${new Date().toLocaleString('en-IN')}`);
        
        // Clear form field after successful transaction
        setAddAmount('');
        
        // Update user data in localStorage
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
          currentUser.wallet = { balance: data.balance, transactions: [] };
          localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
        
        fetchWalletBalance();
        fetchRechargeHistory();
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to add money');
      }
    } catch (error) {
      console.error('Error adding money:', error);
    } finally {
      setLoading(false);
    }
  };

  const payBill = async (e) => {
    e.preventDefault();
    setBillLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/bills/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(billData)
      });

      if (response.ok) {
        alert('Bill payment successful!');
        // Clear form fields after successful payment
        setBillData({ billType: '', amount: '', consumerNumber: '' });
        fetchRechargeHistory();
        fetchWalletBalance();
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Bill payment failed');
      }
    } catch (error) {
      console.error('Error paying bill:', error);
      alert('Error paying bill');
    } finally {
      setBillLoading(false);
    }
  };

  const processRecharge = async (e) => {
    e.preventDefault();
    setRechargeLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/recharge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(rechargeData)
      });

      if (response.ok) {
        alert('Recharge successful!');
        // Clear form fields after successful recharge (keep phone number for convenience)
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        setRechargeData({ 
          phoneNumber: currentUser?.phone || '', 
          amount: '', 
          operator: '' 
        });
        fetchRechargeHistory();
        fetchWalletBalance();
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Recharge failed');
      }
    } catch (error) {
      console.error('Error processing recharge:', error);
      alert('Error processing recharge');
    } finally {
      setRechargeLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusClass = {
      completed: 'status-success',
      success: 'status-success',
      pending: 'status-warning',
      failed: 'status-error'
    };
    return <span className={`status-badge ${statusClass[status]}`}>{status}</span>;
  };



  return (
    <div className="customer-dashboard">
      <div className="dashboard-header">
        <h1>Customer Dashboard</h1>
        <p>Manage your wallet and track your recharges</p>
      </div>

      <div className="dashboard-content">
        {/* Wallet Section */}
        <div className="wallet-section">
          <div className="card wallet-card">
            <div className="wallet-header">
              <h2>Wallet Balance</h2>
              <div className="balance-display">
                <span className="currency">₹</span>
                <span className="amount">{walletBalance.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="card add-money-card">
            <div className="card-header">
              <h3>Add Money to Wallet</h3>
            </div>
            <form onSubmit={addMoneyToWallet} className="add-money-form">
              <div className="amount-input-group">
                <span className="currency-symbol">₹</span>
                <input
                  type="number"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="10"
                  max="50000"
                  required
                />
              </div>
              <button type="submit" className="add-money-btn" disabled={loading}>
                {loading ? 'Adding...' : 'Add Money'}
              </button>
            </form>
          </div>
        </div>

        {/* Recharge Section */}
        <div className="recharge-section">
          <div className="card recharge-card">
            <div className="card-header">
              <h3>Mobile Recharge</h3>
            </div>
            <form onSubmit={processRecharge} className="recharge-form">
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={rechargeData.phoneNumber}
                  onChange={(e) => setRechargeData({...rechargeData, phoneNumber: e.target.value})}
                  placeholder="Enter 10-digit mobile number"
                  pattern="[0-9]{10}"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Operator</label>
                <select
                  value={rechargeData.operator}
                  onChange={(e) => setRechargeData({...rechargeData, operator: e.target.value})}
                  required
                >
                  <option value="">Select Operator</option>
                  <option value="Airtel">Airtel</option>
                  <option value="Jio">Jio</option>
                  <option value="Vi">Vi</option>
                  <option value="BSNL">BSNL</option>
                </select>
              </div>

              <div className="form-group">
                <label>Amount</label>
                <div className="amount-selection">
                  <input
                    type="number"
                    value={rechargeData.amount}
                    onChange={(e) => setRechargeData({...rechargeData, amount: e.target.value})}
                    placeholder="Enter amount or select plan"
                    min="10"
                    required
                  />
                  <button 
                    type="button" 
                    className="browse-plans-btn"
                    onClick={() => setShowPlans(!showPlans)}
                  >
                    Browse Plans
                  </button>
                </div>
              </div>

              {selectedPlan && (
                <div className="selected-plan">
                  <h4>Selected Plan</h4>
                  <div className="plan-details">
                    <span className="plan-name">{selectedPlan.name}</span>
                    <span className="plan-amount">₹{selectedPlan.amount}</span>
                    <span className="plan-validity">{selectedPlan.validity}</span>
                    <span className="plan-data">{selectedPlan.data}</span>
                  </div>
                </div>
              )}

              <button type="submit" className="recharge-btn" disabled={rechargeLoading}>
                {rechargeLoading ? 'Processing...' : 'Recharge Now'}
              </button>
            </form>
          </div>

          {showPlans && (
            <div className="card plans-card">
              <div className="card-header">
                <h3>Available Plans</h3>
                <button 
                  className="close-plans-btn"
                  onClick={() => setShowPlans(false)}
                >
                  ×
                </button>
              </div>
              <div className="plans-grid">
                {plans.map((plan) => (
                  <div 
                    key={plan._id} 
                    className={`plan-card ${selectedPlan?._id === plan._id ? 'selected' : ''}`}
                    onClick={() => selectPlan(plan)}
                  >
                    <div className="plan-header">
                      <h4>{plan.name}</h4>
                      <span className="plan-price">₹{plan.amount}</span>
                    </div>
                    <div className="plan-details">
                      <div className="plan-info">
                        <span className="validity">📅 {plan.validity}</span>
                        <span className="data">📱 {plan.data}</span>
                      </div>
                      {plan.description && (
                        <p className="plan-description">{plan.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Transactions & History Section */}
        <div className="history-section">


          {/* Recharge History */}
          <div className="card history-card">
            <div className="card-header">
              <h3>Recharge History</h3>
              <span className="record-count">{rechargeHistory.length} recharges</span>
            </div>
            
            <div className="table-container">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Phone</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rechargeHistory.length > 0 ? (
                    rechargeHistory.map((recharge, index) => (
                      <tr key={index} className="table-row">
                        <td className="phone-cell">
                          {recharge.phoneNumber || recharge.phone}
                        </td>
                        <td className="amount-cell">
                          ₹{recharge.amount}
                        </td>
                        <td className="date-cell">
                          {new Date(recharge.createdAt).toLocaleDateString('en-IN')}
                        </td>
                        <td className="status-cell">
                          {getStatusBadge(recharge.status)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="no-data">
                        No recharge history found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>






        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;