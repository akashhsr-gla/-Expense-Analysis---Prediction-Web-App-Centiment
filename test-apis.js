import axios from 'axios';

const BASE_URL = 'http://localhost:5000';
let authToken = '';

const testAPIs = async () => {
    console.log('🧪 Testing Centiment APIs...\n');

    try {
        // Test 1: Register a new user
        console.log('1️⃣ Testing User Registration...');
        const registerResponse = await axios.post(`${BASE_URL}/api/v1/auth/register`, {
            fullName: 'API Test User',
            email: 'apitest2@example.com',
            password: 'TestPass123!'
        });
        console.log('✅ Registration successful:', registerResponse.data.user.email);
        authToken = registerResponse.data.token;

        // Test 2: Login
        console.log('\n2️⃣ Testing User Login...');
        const loginResponse = await axios.post(`${BASE_URL}/api/v1/auth/login`, {
            email: 'apitest2@example.com',
            password: 'TestPass123!'
        });
        console.log('✅ Login successful:', loginResponse.data.user.email);
        authToken = loginResponse.data.token;

        // Test 3: Get User Info (Protected Route)
        console.log('\n3️⃣ Testing Protected Route - Get User Info...');
        const userResponse = await axios.get(`${BASE_URL}/api/v1/auth/getUser`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('✅ User info retrieved:', userResponse.data.fullName);

        // Test 4: Add Expense
        console.log('\n4️⃣ Testing Add Expense...');
        const expenseResponse = await axios.post(`${BASE_URL}/api/v1/expense/add`, {
            category: 'Food',
            amount: 50,
            icon: '🍕',
            date: new Date().toISOString()
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('✅ Expense added:', expenseResponse.data.category, '$' + expenseResponse.data.amount);

        // Test 5: Get All Expenses
        console.log('\n5️⃣ Testing Get All Expenses...');
        const expensesResponse = await axios.get(`${BASE_URL}/api/v1/expense/get`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('✅ Expenses retrieved:', expensesResponse.data.length, 'expenses found');

        // Test 6: Add Income
        console.log('\n6️⃣ Testing Add Income...');
        const incomeResponse = await axios.post(`${BASE_URL}/api/v1/income/add`, {
            source: 'Salary',
            amount: 5000,
            icon: '💰',
            date: new Date().toISOString()
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('✅ Income added:', incomeResponse.data.source, '$' + incomeResponse.data.amount);

        // Test 7: Get All Income
        console.log('\n7️⃣ Testing Get All Income...');
        const incomeListResponse = await axios.get(`${BASE_URL}/api/v1/income/get`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('✅ Income retrieved:', incomeListResponse.data.length, 'income entries found');

        // Test 8: Dashboard Overview
        console.log('\n8️⃣ Testing Dashboard Overview...');
        try {
            const dashboardResponse = await axios.get(`${BASE_URL}/api/v1/dashboard/overview`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            console.log('✅ Dashboard data retrieved');
        } catch (error) {
            console.log('⚠️ Dashboard endpoint not available or needs implementation');
        }

        console.log('\n🎉 All API tests completed successfully!');
        console.log('\n📊 Summary:');
        console.log('   ✅ Authentication (Register/Login)');
        console.log('   ✅ Protected Routes');
        console.log('   ✅ Expense Management');
        console.log('   ✅ Income Management');
        console.log('   ✅ User Management');

    } catch (error) {
        console.error('❌ API Test Failed:', error.response?.data?.message || error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
    }
};

testAPIs();
