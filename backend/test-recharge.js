const axios = require('axios');

async function testRecharge() {
  console.log('🧪 Testing Recharge Functionality...\n');
  
  const baseURL = 'http://localhost:5002/api';
  
  try {
    // Step 1: Register a test user
    console.log('1. Registering test user...');
    const registerData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@recharge.com',
      phone: '9876543210',
      password: 'test123'
    };
    
    let token;
    try {
      const registerResponse = await axios.post(`${baseURL}/auth/register`, registerData);
      token = registerResponse.data.token;
      console.log('✅ User registered successfully');
    } catch (error) {
      if (error.response?.data?.message?.includes('already exists')) {
        // User exists, try login
        console.log('User exists, trying login...');
        const loginResponse = await axios.post(`${baseURL}/auth/login`, {
          email: registerData.email,
          password: registerData.password
        });
        token = loginResponse.data.token;
        console.log('✅ User logged in successfully');
      } else {
        throw error;
      }
    }
    
    // Step 2: Test recharge
    console.log('\n2. Testing recharge...');
    const rechargeData = {
      phoneNumber: '9876543210',
      amount: 99,
      operator: 'Airtel',
      planName: 'Unlimited Plan'
    };
    
    const rechargeResponse = await axios.post(`${baseURL}/recharge`, rechargeData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Recharge successful:', rechargeResponse.data);
    
    // Step 3: Check recharge history
    console.log('\n3. Checking recharge history...');
    const historyResponse = await axios.get(`${baseURL}/recharge/history`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Recharge history:', historyResponse.data);
    
    console.log('\n🎉 All recharge tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testRecharge();