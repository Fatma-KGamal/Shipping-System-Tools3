const axios = require('axios');

// URLs to test
const registerUrl = 'http://localhost:4300/register';
const loginUrl = 'http://localhost:4300/login';

// Register test cases
const registerTests = [
    { description: "Valid Registration", data: { username: 'testuser102', email: 'testuser102@example.com', phone: '1234567890', password: 'password123' }},
    { description: "Username Already Taken", data: { username: 'testuser100', email: 'testuser100@example.com', phone: '1234567890', password: 'password123' }},
    { description: "Empty Username", data: { username: '', email: 'testuser101@example.com', phone: '1234567890', password: 'password123' }},
    { description: "Empty Email", data: { username: 'testuser101', email: '', phone: '1234567890', password: 'password123' }},
    { description: "Empty Phone", data: { username: 'testuser101', email: 'testuser101@example.com', phone: '', password: 'password123' }},
    { description: "Password Less Than 6 Characters", data: { username: 'testuser111', email: 'testuser111@example.com', phone: '1234567890', password: '1254' }},
    { description: "Invalid Email Format", data: { username: 'testuser111', email: 'testuser111example', phone: '1234567890', password: 'password123' }},
];

// Login test cases
const loginTests = [
    { description: "Valid Login", data: { email: 'testuser102@example.com', password: 'password123' }},
    { description: "Invalid Email", data: { email: 'testuser120@example.com', password: 'password123' }},
    { description: "Invalid Password", data: { email: 'testuser100@example.com', password: 'password12345' }},
    { description: "Empty Email", data: { email: '', password: 'password123' }},
    { description: "Empty Password", data: { email: 'testuser100@example.com', password: '' }},
];

// Smoke test function for the register endpoint
async function testRegister() {
    console.log('Testing Register Endpoint...');
    for (const test of registerTests) {
        try {
            const response = await axios.post(registerUrl, test.data, {
                headers: { 'Content-Type': 'application/json' }
            });
            console.log(`${test.description} succeeded:`, response.status, response.data);
        } catch (error) {
            console.error(`${test.description} failed:`, error.response?.status, error.response?.data);
        }
    }
}

// Smoke test function for the login endpoint
async function testLoginFunction() {
    console.log('Testing Login Endpoint...');
    for (const test of loginTests) {
        try {
            const response = await axios.post(loginUrl, test.data, {
                headers: { 'Content-Type': 'application/json' }
            });
            console.log(`${test.description} succeeded:`, response.status, response.data);
        } catch (error) {
            console.error(`${test.description} failed:`, error.response?.status, error.response?.data);
        }
    }
}

// Execute smoke tests
async function runSmokeTests() {
    console.log('Running smoke tests...');
    await testRegister();
    await testLoginFunction();
    console.log('Smoke tests completed.');
}

runSmokeTests();
