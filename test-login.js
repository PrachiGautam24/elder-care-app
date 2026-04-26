const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing login endpoint...');
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test@family.com',
      password: 'password123'
    });
    console.log('✅ Login successful!');
    console.log('Response:', response.data);
  } catch (error) {
    console.log('❌ Login failed!');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data);
    } else if (error.request) {
      console.log('No response from server. Is the server running?');
    } else {
      console.log('Error:', error.message);
    }
  }
}

testLogin();
