const axios = require('axios');

async function testSignup() {
  try {
    console.log('Testing signup endpoint...');
    const response = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Test Nurse',
      email: 'testnurse@example.com',
      password: 'password123',
      phone: '1234567890',
      role: 'nurse'
    });
    console.log('✅ Signup successful!');
    console.log('Response:', response.data);
  } catch (error) {
    console.log('❌ Signup failed!');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data);
    } else if (error.request) {
      console.log('No response from server. Is the server running?');
      console.log('Make sure to run: npm run dev:watch');
    } else {
      console.log('Error:', error.message);
    }
  }
}

testSignup();
