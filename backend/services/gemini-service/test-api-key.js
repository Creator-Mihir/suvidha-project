// ─── Test Gemini API Key Directly ────────────────────────────────────────────
// Location: backend/gemini-service/test-api-key.js
// Run this to verify your API key works

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// Your API Key - replace with your actual key
const GEMINI_API_KEY = 'AIzaSyB_ke2cpCG9jGRVcC9IgTOvaNumAdEkeaE';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`;

console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║         🧪 TESTING GEMINI API KEY DIRECTLY                   ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

console.log('🔑 API Key:', GEMINI_API_KEY.substring(0, 20) + '...');
console.log('🌐 API URL:', GEMINI_URL.substring(0, 80) + '...\n');

const testRequest = async () => {
  try {
    console.log('⏳ Sending request to Gemini API...\n');

    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: 'Hello, say "API Key is working"' }],
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 100,
        },
      }),
    });

    console.log('📊 Response Status:', response.status);
    console.log('📋 Response Status Text:', response.statusText);
    console.log('📝 Response Headers:');
    console.log('   Content-Type:', response.headers.get('content-type'));
    console.log('   Content-Length:', response.headers.get('content-length'));

    const responseText = await response.text();
    
    console.log('\n📄 Response Text (Raw):');
    console.log(responseText);
    console.log('\n');

    if (!responseText || responseText.trim() === '') {
      console.log('❌ ERROR: Empty response from API!');
      console.log('   Possible reasons:');
      console.log('   1. API key is invalid');
      console.log('   2. API key is disabled');
      console.log('   3. Gemini API is not enabled in Google Cloud');
      console.log('   4. Network issue\n');
      return;
    }

    try {
      const data = JSON.parse(responseText);
      
      if (response.ok) {
        console.log('✅ SUCCESS! API Key is working!\n');
        console.log('Response:');
        console.log(JSON.stringify(data, null, 2));
      } else {
        console.log('❌ ERROR: API returned an error\n');
        console.log('Error Response:');
        console.log(JSON.stringify(data, null, 2));
        
        if (data.error) {
          console.log('\n📌 Error Details:');
          console.log('   Code:', data.error.code);
          console.log('   Message:', data.error.message);
          console.log('   Status:', data.error.status);
        }
      }
    } catch (jsonError) {
      console.log('❌ ERROR: Could not parse JSON response\n');
      console.log('Parse Error:', jsonError.message);
      console.log('Response was:', responseText.substring(0, 200));
    }
  } catch (error) {
    console.log('❌ FATAL ERROR:\n');
    console.log('Error Message:', error.message);
    console.log('Error Stack:', error.stack);
    console.log('\nPossible reasons:');
    console.log('1. Network issue - cannot reach Google API');
    console.log('2. Invalid API key format');
    console.log('3. Firewall blocking outbound requests');
  }

  console.log('\n╚════════════════════════════════════════════════════════════════╝\n');
};

testRequest();