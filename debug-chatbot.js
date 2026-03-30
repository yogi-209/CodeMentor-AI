// Debug script for chatbot API
const API_KEY = 'AIzaS';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

async function testAPI() {
    console.log('Testing Gemini API...');
    console.log('API Key:', API_KEY.substring(0, 10) + '...');
    console.log('API URL:', API_URL);
    
    try {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: "Hello! Please respond with 'API is working' to confirm."
                            }
                        ]
                    }
                ]
            })
        });

        console.log('Response Status:', response.status);
        console.log('Response Headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ API Error:', response.status, response.statusText);
            console.error('Error Details:', errorText);
            return false;
        }

        const data = await response.json();
        console.log('✅ API Response received!');
        console.log('Response Data:', JSON.stringify(data, null, 2));
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const aiResponse = data.candidates[0].content.parts[0].text;
            console.log('🤖 AI Response:', aiResponse);
            return true;
        } else {
            console.error('❌ Unexpected response format:', data);
            return false;
        }

    } catch (error) {
        console.error('❌ Network Error:', error.message);
        return false;
    }
}

// Test with different endpoints
async function testAlternativeEndpoints() {
    const endpoints = [
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent',
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'
    ];

    for (const endpoint of endpoints) {
        console.log(`\nTesting endpoint: ${endpoint}`);
        try {
            const response = await fetch(`${endpoint}?key=${API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: "Hello! Test message."
                                }
                            ]
                        }
                    ]
                })
            });

            console.log(`Status: ${response.status}`);
            if (response.ok) {
                const data = await response.json();
                console.log('✅ This endpoint works!');
                return endpoint;
            } else {
                const errorText = await response.text();
                console.log(`❌ Error: ${errorText}`);
            }
        } catch (error) {
            console.log(`❌ Network error: ${error.message}`);
        }
    }
    return null;
}

// Run tests
async function runTests() {
    console.log('=== Chatbot API Debug Test ===\n');
    
    const success = await testAPI();
    if (!success) {
        console.log('\n=== Testing Alternative Endpoints ===');
        const workingEndpoint = await testAlternativeEndpoints();
        if (workingEndpoint) {
            console.log(`\n✅ Found working endpoint: ${workingEndpoint}`);
        } else {
            console.log('\n❌ No working endpoints found. The API key might be invalid.');
        }
    }
}

// Run if this script is executed directly
if (typeof window === 'undefined') {
    // Node.js environment
    const fetch = require('node-fetch');
    runTests();
} else {
    // Browser environment
    runTests();
}
