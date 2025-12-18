const axios = require('axios');

async function debugConnection() {
  console.log('🔍 Debugging Frontend-Backend Connection...\n');
  
  try {
    // 1. Test basic backend connectivity
    console.log('1. Testing backend health...');
    const health = await axios.get('http://localhost:5000/health');
    console.log('✅ Backend is running:', health.data);
    
    // 2. Test registration
    console.log('\n2. Testing user registration...');
    const registerData = {
      firstName: 'Debug',
      lastName: 'User',
      email: 'debug@test.com',
      phone: '9876543210',
      password: 'debug123',
      role: 'customer'
    };
    
    let token = null;
    try {
      const registerResponse = await axios.post('http://localhost:5000/api/auth/register', registerData);
      console.log('✅ Registration successful');
      token = registerResponse.data.token;
    } catch (error) {
      if (error.response?.data?.message?.includes('already exists')) {
        console.log('ℹ️ User exists, trying login...');
        
        // Try login instead
        const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
          email: 'debug@test.com',
          password: 'debug123'
        });
        console.log('✅ Login successful');
        token = loginResponse.data.token;
      } else {
        throw error;
      }
    }
    
    // 3. Test authenticated recharge request
    console.log('\n3. Testing recharge with authentication...');
    const rechargeData = {
      phoneNumber: '9876543210',
      amount: 99,
      operator: 'Airtel',
      planName: 'Test Plan'
    };
    
    const rechargeResponse = await axios.post('http://localhost:5000/api/recharge', rechargeData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Recharge successful:', rechargeResponse.data);
    
    console.log('\n🎉 All tests passed! Backend-Frontend connection is working.');
    
  } catch (error) {
    console.error('\n❌ Connection Error:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data?.message || error.message);
    console.error('URL:', error.config?.url);
    
    if (error.response?.data) {
      console.error('Full error response:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

debugConnection();