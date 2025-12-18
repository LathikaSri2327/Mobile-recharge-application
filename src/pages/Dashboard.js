import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { authService } from '../services/authService';
import AdminDashboard from '../components/AdminDashboard';
import AgentDashboard from '../components/AgentDashboard';
import CustomerDashboard from '../components/CustomerDashboard';
import { generateRechargeToken, generateTransactionId, generateReferenceNumber } from '../utils/tokenGenerator';
import './Dashboard.css';

const Dashboard = () => {
  const [selectedService, setSelectedService] = useState('');
  const [billDetails, setBillDetails] = useState({
    consumerNumber: '',
    amount: '',
    billType: ''
  });
  const [rechargeProgress, setRechargeProgress] = useState(null);
  const [billProgress, setBillProgress] = useState(null);
  const [rechargePlans, setRechargePlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [rechargeForm, setRechargeForm] = useState({
    phoneNumber: '',
    operator: 'Airtel'
  });

  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    loadPlans();
    
    // Listen for plan updates from admin
    const handlePlansUpdated = () => {
      loadPlans();
    };
    
    window.addEventListener('plansUpdated', handlePlansUpdated);
    
    return () => {
      window.removeEventListener('plansUpdated', handlePlansUpdated);
    };
  }, []);

  const loadPlans = async () => {
    try {
      const response = await fetch('http://localhost:5002/api/plans');
      const plans = await response.json();
      setRechargePlans(plans);
    } catch (error) {
      console.error('Error loading plans:', error);
      setRechargePlans([]);
    } finally {
      setLoading(false);
    }
  };

  const billServices = [
    { id: 'electric', name: 'Electricity Bill', color: '#FFD700' },
    { id: 'water', name: 'Water Bill', color: '#00BFFF' },
    { id: 'dth', name: 'DTH Recharge', color: '#FF4500' },
    { id: 'gas', name: 'Gas Bill', color: '#FF6347' },
    { id: 'internet', name: 'Internet Bill', color: '#32CD32' }
  ];

  const handleRecharge = (plan, planIndex) => {
    setSelectedPlan(plan);
    // Auto-populate phone number from user registration
    const userPhone = currentUser?.phone || '';
    setRechargeForm({ 
      phoneNumber: userPhone, 
      operator: 'Airtel' 
    });
    setShowRechargeModal(true);
  };

  const processRecharge = async (e) => {
    e.preventDefault();
    setRechargeProgress(true);
    
    const rechargeData = {
      planName: selectedPlan.name,
      amount: selectedPlan.amount,
      phoneNumber: rechargeForm.phoneNumber,
      operator: rechargeForm.operator
    };
    
    console.log('🔄 Processing recharge:', rechargeData);
    console.log('🌐 API URL:', 'http://localhost:5002/api/recharge/simple');
    
    try {
      const response = await fetch('http://localhost:5002/api/recharge/simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(rechargeData)
      });
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', response.headers);
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Recharge successful:', result);
        
        const rechargeToken = generateRechargeToken();
        const transactionId = generateTransactionId();
        const referenceNumber = generateReferenceNumber();
        
        alert(`✅ Recharge Successful!\n\n📱 Plan: ${selectedPlan.name}\n💰 Amount: ₹${selectedPlan.amount}\n📞 Phone: ${rechargeForm.phoneNumber}\n📡 Operator: ${rechargeForm.operator}\n\n🎫 Recharge Token: ${rechargeToken}\n🔢 Transaction ID: ${transactionId}\n📋 Reference: ${referenceNumber}\n\n⏰ Date: ${new Date().toLocaleString('en-IN')}`);
        
        window.dispatchEvent(new CustomEvent('rechargeCompleted'));
        setShowRechargeModal(false);
        setRechargeForm({ phoneNumber: '', operator: 'Airtel' });
      } else {
        const errorData = await response.json();
        console.error('❌ Server error:', errorData);
        alert(`Recharge failed: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('❌ Network error:', error);
      alert(`Network error: ${error.message}`);
    } finally {
      setRechargeProgress(false);
    }
  };

  const handleBillSubmit = async (e) => {
    e.preventDefault();
    setBillProgress(selectedService);

    try {
      const token = localStorage.getItem('token');
      const serviceName = billServices.find(s => s.id === selectedService)?.name;
      
      // Store bill payment as recharge record
      const response = await fetch('http://localhost:5002/api/recharge/simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          planName: serviceName,
          amount: parseFloat(billDetails.amount),
          phoneNumber: billDetails.consumerNumber,
          operator: 'Bill Payment'
        })
      });
      
      if (response.ok) {
        alert(`Bill payment successful! Rs.${billDetails.amount} paid for ${serviceName}`);
        setBillDetails({ consumerNumber: '', amount: '' });
        setSelectedService('');
        
        // Notify components about recharge completion
        window.dispatchEvent(new CustomEvent('rechargeCompleted'));
      } else {
        alert('Bill payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Bill payment error:', error);
      alert('Bill payment failed. Please try again.');
    } finally {
      setBillProgress(null);
    }
  };

  return (
    <div className="dashboard">
      <div className="container">
        <motion.div 
          className="dashboard-header"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="dashboard-title">
            Welcome, {currentUser?.firstName} {currentUser?.lastName}
          </h1>
          <div className="user-info">
            <span className={`role-badge ${currentUser?.role}`}>
              {currentUser?.role?.toUpperCase()}
            </span>
            <span className="wallet-balance">
              Wallet: ₹{currentUser?.wallet?.balance || 0}
            </span>
          </div>
        </motion.div>

        {authService.isAdmin() && <AdminDashboard />}
        {authService.isAgent() && <AgentDashboard />}
        {authService.isCustomer() && <CustomerDashboard />}

        <motion.section 
          className="dashboard-section"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2>Mobile Recharge Plans</h2>
          {loading ? (
            <div className="text-center p-4">Loading plans...</div>
          ) : rechargePlans.length === 0 ? (
            <div className="text-center p-4">No plans available</div>
          ) : (
            <div className="plans-grid">
              {rechargePlans.map((plan, index) => (
                <motion.div
                  key={plan._id || index}
                  className="plan-card card"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <h3>{plan.name}</h3>
                  <div className="plan-amount">Rs.{plan.amount}</div>
                  <p>Validity: {plan.validity}</p>
                  <p>Data: {plan.data}</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleRecharge(plan, index)}
                    disabled={false}
                  >
                    Recharge
                  </button>

                </motion.div>
              ))}
            </div>
          )}
        </motion.section>

        <motion.section 
          className="dashboard-section"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2>Bill Payments</h2>
          <div className="bill-services">
            {billServices.map((service) => (
              <motion.div
                key={service.id}
                className="service-card"
                style={{ backgroundColor: service.color }}
                onClick={() => setSelectedService(service.id)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <h3>{service.name}</h3>
              </motion.div>
            ))}
          </div>

          {selectedService && (
            <motion.form
              className="bill-form"
              onSubmit={handleBillSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3>Pay {billServices.find(s => s.id === selectedService)?.name}</h3>
              
              <div className="form-group">
                <label>Consumer Number</label>
                <input
                  type="text"
                  value={billDetails.consumerNumber}
                  onChange={(e) => setBillDetails({...billDetails, consumerNumber: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Amount</label>
                <input
                  type="number"
                  value={billDetails.amount}
                  onChange={(e) => setBillDetails({...billDetails, amount: e.target.value})}
                  required
                />
              </div>
              
              <button
                type="submit"
                className="btn btn-primary"
                disabled={billProgress === selectedService}
              >
                {billProgress === selectedService ? 'Processing...' : 'Pay Bill'}
              </button>
              
              {billProgress === selectedService && (
                <div className="progress-bar">
                  <div className="progress-fill"></div>
                </div>
              )}
            </motion.form>
          )}
        </motion.section>

        {/* Recharge Modal */}
        {showRechargeModal && (
          <div className="modal-overlay" onClick={() => setShowRechargeModal(false)}>
            <div className="recharge-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Complete Recharge</h3>
                <button className="close-btn" onClick={() => setShowRechargeModal(false)}>×</button>
              </div>
              
              <div className="selected-plan">
                <h4>{selectedPlan?.name}</h4>
                <div className="plan-details">
                  <span className="amount">₹{selectedPlan?.amount}</span>
                  <span className="validity">{selectedPlan?.validity}</span>
                  <span className="data">{selectedPlan?.data}</span>
                </div>
              </div>

              <form onSubmit={processRecharge} className="recharge-form">
                <div className="form-group">
                  <label>Phone Number</label>
                  <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                    <input
                      type="tel"
                      value={rechargeForm.phoneNumber}
                      onChange={(e) => setRechargeForm({...rechargeForm, phoneNumber: e.target.value})}
                      placeholder="Enter 10-digit mobile number"
                      pattern="[0-9]{10}"
                      style={{flex: 1}}
                      maxLength="10"
                      required
                    />
                    {currentUser?.phone && rechargeForm.phoneNumber !== currentUser.phone && (
                      <button
                        type="button"
                        onClick={() => setRechargeForm({...rechargeForm, phoneNumber: currentUser.phone})}
                        style={{
                          padding: '8px 12px',
                          background: '#28a745',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        Use My Number
                      </button>
                    )}
                  </div>
                  {currentUser?.phone && (
                    <small style={{color: '#666', fontSize: '0.85rem', marginTop: '5px', display: 'block'}}>
                      Your registered number: {currentUser.phone}
                    </small>
                  )}
                </div>
                
                <div className="form-group">
                  <label>Operator</label>
                  <select
                    value={rechargeForm.operator}
                    onChange={(e) => setRechargeForm({...rechargeForm, operator: e.target.value})}
                    required
                  >
                    <option value="Airtel">Airtel</option>
                    <option value="Jio">Jio</option>
                    <option value="Vi">Vi</option>
                    <option value="BSNL">BSNL</option>
                  </select>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowRechargeModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={rechargeProgress}>
                    {rechargeProgress ? 'Processing...' : `Pay ₹${selectedPlan?.amount}`}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;