// ─── Find Available Gemini Models ────────────────────────────────────────────
// Location: backend/gemini-service/test-available-models.js
// Run this to see which models work with your API key

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const GEMINI_API_KEY = 'AIzaSyB_ke2cpCG9jGRVcC9IgTOvaNumAdEkeaE';

// Try different model names and versions
const modelsToTest = [
  // Try v1 (stable)
  {
    name: 'gemini-pro',
    url: `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
    version: 'v1'
  },
  {
    name: 'gemini-1.5-pro',
    url: `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`,
    version: 'v1'
  },
  {
    name: 'gemini-1.5-flash',
    url: `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    version: 'v1'
  },
  // Try v1beta (beta)
  {
    name: 'gemini-1.5-pro',
    url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`,
    version: 'v1beta'
  },
  {
    name: 'gemini-1.5-flash',
    url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    version: 'v1beta'
  },
  {
    name: 'gemini-pro',
    url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
    version: 'v1beta'
  },
];

console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║       🔍 FINDING AVAILABLE GEMINI MODELS                      ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

const testModels = async () => {
  let successCount = 0;
  let results = [];

  for (const model of modelsToTest) {
    process.stdout.write(`Testing ${model.name} (${model.version})... `);

    try {
      const response = await fetch(model.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: 'Hello' }],
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 100,
          },
        }),
      });

      if (response.ok) {
        console.log('✅ WORKS!');
        successCount++;
        results.push({
          name: model.name,
          version: model.version,
          url: model.url,
          status: 'AVAILABLE'
        });
      } else {
        const error = await response.json();
        console.log(`❌ ${error.error.code}: ${error.error.message.substring(0, 60)}...`);
        results.push({
          name: model.name,
          version: model.version,
          status: 'NOT AVAILABLE',
          code: error.error.code
        });
      }
    } catch (err) {
      console.log(`❌ ERROR: ${err.message.substring(0, 60)}`);
      results.push({
        name: model.name,
        version: model.version,
        status: 'ERROR',
        error: err.message
      });
    }
  }

  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║                    📊 SUMMARY                                 ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  if (successCount === 0) {
    console.log('❌ No models found! Possible issues:');
    console.log('   1. API key is invalid');
    console.log('   2. Gemini API is not enabled');
    console.log('   3. API key has no permissions\n');
  } else {
    console.log(`✅ Found ${successCount} working model(s):\n`);
    results.forEach(r => {
      if (r.status === 'AVAILABLE') {
        console.log(`   ✅ ${r.name} (${r.version})`);
        console.log(`      URL: ${r.url.substring(0, 100)}...`);
        console.log(`      USE THIS: gemini-${r.name}:${r.version}\n`);
      }
    });
  }

  console.log('\nFull Results:');
  console.table(results);

  console.log('\n╚════════════════════════════════════════════════════════════════╝\n');
};

testModels();