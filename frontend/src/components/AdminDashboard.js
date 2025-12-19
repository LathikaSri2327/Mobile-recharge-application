import React, { useState, useEffect } from 'react';
import { apiController } from '../controller/apiController';
import './AdminDashboard.css';
import './PlanEditor.css';
import './UserManagement.css';
import './FeedbackViewer.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [plans, setPlans] = useState([]);
  const [editingPlan, setEditingPlan] = useState(null);
  const [planForm, setPlanForm] = useState({ name: '', amount: '', validity: '', data: '', type: 'prepaid' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUserList, setShowUserList] = useState(false);
  const [feedback, setFeedback] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const response = await fetch('http://localhost:5002/api/feedback');
      const data = await response.json();
      setFeedback(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      setFeedback([]);
    }
  };

  const loadData = async () => {
    try {
      const [usersData, statsData] = await Promise.all([
        apiController.getAllUsers(),
        apiController.getSystemStats()
      ]);
      setUsers(usersData);
      setStats(statsData);
      await fetchPlans();
    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5002/api/plans', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setPlans(data);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const handleEditPlan = (plan) => {
    setEditingPlan(plan._id);
    setPlanForm({
      name: plan.name,
      amount: plan.amount,
      validity: plan.validity,
      data: plan.data,
      type: plan.type || 'prepaid'
    });
  };

  const handleAddPlan = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5002/api/plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(planForm)
      });
      
      if (response.ok) {
        alert('Plan added successfully!');
        setShowAddForm(false);
        setPlanForm({ name: '', amount: '', validity: '', data: '', type: 'prepaid' });
        fetchPlans();
      }
    } catch (error) {
      console.error('Error adding plan:', error);
    }
  };

  const handleDeletePlan = async (planId) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5002/api/plans/${planId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          alert('Plan deleted successfully!');
          fetchPlans();
        }
      } catch (error) {
        console.error('Error deleting plan:', error);
      }
    }
  };

  const handleSavePlan = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5002/api/plans/${editingPlan}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(planForm)
      });
      
      if (response.ok) {
        alert('Plan updated successfully!');
        // Clear form fields after successful update
        setEditingPlan(null);
        setPlanForm({ name: '', amount: '', validity: '', data: '', type: 'prepaid' });
        fetchPlans();
        window.dispatchEvent(new CustomEvent('plansUpdated'));
      }
    } catch (error) {
      console.error('Error updating plan:', error);
    }
  };

  const handleStatusChange = async (userId, status) => {
    try {
      await apiController.updateUserStatus(userId, status);
      loadData();
    } catch (error) {
      console.error('Failed to update user status:', error);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      active: 'status-badge status-active',
      inactive: 'status-badge status-inactive',
      suspended: 'status-badge status-suspended'
    };
    return statusClasses[status] || 'status-badge';
  };

  const getRoleBadge = (role) => {
    const roleClasses = {
      admin: 'role-badge role-admin',
      agent: 'role-badge role-agent',
      customer: 'role-badge role-customer'
    };
    return roleClasses[role] || 'role-badge';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <p className="dashboard-subtitle">Manage users and monitor system performance</p>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card stat-primary">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Users</h3>
            <p className="stat-number">{stats.totalUsers || 0}</p>
          </div>
        </div>
        <div className="stat-card stat-success">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Active Users</h3>
            <p className="stat-number">{stats.activeUsers || 0}</p>
          </div>
        </div>
        <div className="stat-card stat-info">
          <div className="stat-icon">📱</div>
          <div className="stat-content">
            <h3>Total Recharges</h3>
            <p className="stat-number">{stats.totalRecharges || 0}</p>
          </div>
        </div>
        <div className="stat-card stat-warning">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Total Revenue</h3>
            <p className="stat-number">₹{stats.totalRevenue || 0}</p>
          </div>
        </div>
      </div>

      <div className="users-section">
        <div className="section-header">
          <h2>User Management</h2>
          <button 
            className="toggle-users-btn"
            onClick={() => setShowUserList(!showUserList)}
          >
            {showUserList ? 'Hide User List' : `View User List (${users.length} users)`}
          </button>
        </div>
        
        {showUserList && (
          <div className="table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id} className="user-row">
                    <td className="user-name">
                      <div className="name-container">
                        <div className="avatar">
                          {(user.firstName?.[0] || user.email[0]).toUpperCase()}
                        </div>
                        <span>{user.firstName} {user.lastName}</span>
                      </div>
                    </td>
                    <td className="user-email">{user.email}</td>
                    <td>
                      <span className={getRoleBadge(user.role)}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={getStatusBadge(user.status)}>
                        {user.status}
                      </span>
                    </td>
                    <td>
                      <select 
                        className="status-select"
                        value={user.status} 
                        onChange={(e) => handleStatusChange(user._id, e.target.value)}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="plans-section">
        <div className="section-header">
          <h2>Recharge Plans Management</h2>
          <button 
            className="add-plan-btn"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Cancel' : 'Add New Plan'}
          </button>
        </div>

        {showAddForm && (
          <div className="plan-form-card">
            <h3>Add New Plan</h3>
            <div className="plan-form-grid">
              <input
                type="text"
                value={planForm.name}
                onChange={(e) => setPlanForm({...planForm, name: e.target.value})}
                placeholder="Plan Name"
                className="plan-input"
              />
              <input
                type="number"
                value={planForm.amount}
                onChange={(e) => setPlanForm({...planForm, amount: e.target.value})}
                placeholder="Amount (₹)"
                className="plan-input"
              />
              <input
                type="text"
                value={planForm.validity}
                onChange={(e) => setPlanForm({...planForm, validity: e.target.value})}
                placeholder="Validity (e.g., 28 Days)"
                className="plan-input"
              />
              <input
                type="text"
                value={planForm.data}
                onChange={(e) => setPlanForm({...planForm, data: e.target.value})}
                placeholder="Data (e.g., 1GB/day)"
                className="plan-input"
              />
              <select
                value={planForm.type}
                onChange={(e) => setPlanForm({...planForm, type: e.target.value})}
                className="plan-select"
              >
                <option value="prepaid">Prepaid</option>
                <option value="postpaid">Postpaid</option>
              </select>
              <button onClick={handleAddPlan} className="save-plan-btn">
                Add Plan
              </button>
            </div>
          </div>
        )}
        
        <div className="plans-grid">
          {plans.map((plan) => (
            <div key={plan._id} className="plan-card">
              {editingPlan === plan._id ? (
                <div className="edit-plan-form">
                  <h4>Edit Plan</h4>
                  <div className="plan-form-grid">
                    <input
                      type="text"
                      value={planForm.name}
                      onChange={(e) => setPlanForm({...planForm, name: e.target.value})}
                      placeholder="Plan Name"
                      className="plan-input"
                    />
                    <input
                      type="number"
                      value={planForm.amount}
                      onChange={(e) => setPlanForm({...planForm, amount: e.target.value})}
                      placeholder="Amount"
                      className="plan-input"
                    />
                    <input
                      type="text"
                      value={planForm.validity}
                      onChange={(e) => setPlanForm({...planForm, validity: e.target.value})}
                      placeholder="Validity"
                      className="plan-input"
                    />
                    <input
                      type="text"
                      value={planForm.data}
                      onChange={(e) => setPlanForm({...planForm, data: e.target.value})}
                      placeholder="Data"
                      className="plan-input"
                    />
                    <select
                      value={planForm.type}
                      onChange={(e) => setPlanForm({...planForm, type: e.target.value})}
                      className="plan-select"
                    >
                      <option value="prepaid">Prepaid</option>
                      <option value="postpaid">Postpaid</option>
                    </select>
                  </div>
                  <div className="plan-actions">
                    <button onClick={handleSavePlan} className="save-plan-btn">Save</button>
                    <button onClick={() => setEditingPlan(null)} className="cancel-btn">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="plan-display">
                  <div className="plan-header">
                    <h4>{plan.name}</h4>
                    <span className={`plan-type ${plan.type}`}>{plan.type}</span>
                  </div>
                  <div className="plan-details">
                    <div className="plan-detail">
                      <span className="label">Amount:</span>
                      <span className="value">₹{plan.amount}</span>
                    </div>
                    <div className="plan-detail">
                      <span className="label">Validity:</span>
                      <span className="value">{plan.validity}</span>
                    </div>
                    <div className="plan-detail">
                      <span className="label">Data:</span>
                      <span className="value">{plan.data}</span>
                    </div>
                  </div>
                  <div className="plan-actions">
                    <button onClick={() => handleEditPlan(plan)} className="edit-btn">Edit</button>
                    <button onClick={() => handleDeletePlan(plan._id)} className="delete-btn">Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Customer Feedback Section */}
      <div className="feedback-section">
        <div className="section-header">
          <h2>Customer Feedback</h2>
          <button 
            className="toggle-feedback-btn"
            onClick={() => setShowFeedback(!showFeedback)}
          >
            {showFeedback ? 'Hide Feedback' : `View Feedback (${Array.isArray(feedback) ? feedback.length : 0})`}
          </button>
        </div>
        
        {showFeedback && (
          <div className="feedback-grid">
            {Array.isArray(feedback) && feedback.map((item) => (
              <div key={item._id} className="feedback-card">
                <div className="feedback-header">
                  <h4>{item.name}</h4>
                  <div className="rating">
                    {'★'.repeat(item.rating)}{'☆'.repeat(5-item.rating)}
                  </div>
                </div>
                <div className="feedback-meta">
                  <span className="category">{item.category}</span>
                  <span className="date">{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="feedback-message">{item.message}</p>
                <div className="feedback-contact">{item.email}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;