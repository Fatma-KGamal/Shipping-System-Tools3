const axios = require('axios');

// URLs to test
const registerUrl = 'http://localhost:4300/register';
const loginUrl = 'http://localhost:4300/login';

// Sample data for testing
const testUser = {
    username: 'testuser',
    email: 'testuser@example.com',
    phone: '1234567890',
    password: 'password123'
};

const testLogin = {
    username: 'u',
    password: 'u'
};

// Smoke test function for the register endpoint
async function testRegister() {
    try {
        const response = await axios.post(registerUrl, testUser, {
            headers: { 'Content-Type': 'application/json' }
        });
        console.log('Register endpoint is working:', response.status, response.data);
    } catch (error) {
        console.error('Register endpoint failed:', error.response?.status, error.response?.data);
    }
}

// Smoke test function for the login endpoint
async function testLoginFunction() {  // Renamed to avoid duplication
    try {
        const response = await axios.post(loginUrl, testLogin, {
            headers: { 'Content-Type': 'application/json' }
        });
        console.log('Login endpoint is working:', response.status, response.data);
    } catch (error) {
        console.error('Login endpoint failed:', error.response?.status, error.response?.data);
    }
}

// Execute smoke tests
async function runSmokeTests() {
    console.log('Running smoke tests...');
    await testRegister();
    await testLoginFunction(); // Call the renamed function
    console.log('Smoke tests completed.');
}

runSmokeTests();
