// Test frontend-backend connection
const testConnection = async () => {
  try {
    console.log('Testing backend connection...');
    
    // Test 1: Basic health check
    const healthResponse = await fetch('http://localhost:5002/health');
    console.log('Health check status:', healthResponse.status);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Backend is running:', healthData);
    }
    
    // Test 2: Test simple recharge endpoint
    const rechargeData = {
      phoneNumber: '9876543210',
      amount: 100,
      operator: 'Airtel',
      planName: 'Test Plan'
    };
    
    console.log('Testing recharge with data:', rechargeData);
    
    const rechargeResponse = await fetch('http://localhost:5002/api/recharge/simple', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(rechargeData)
    });
    
    console.log('Recharge response status:', rechargeResponse.status);
    
    if (rechargeResponse.ok) {
      const rechargeResult = await rechargeResponse.json();
      console.log('✅ Recharge successful:', rechargeResult);
    } else {
      const error = await rechargeResponse.json();
      console.log('❌ Recharge failed:', error);
    }
    
  } catch (error) {
    console.log('❌ Connection test failed:', error.message);
  }
};

testConnection();