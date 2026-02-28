// ─── AI Service (Groq) ───────────────────────────────────────────────────────
// Location: backend/gemini-service/src/services/gemini.service.js
// Switched from Gemini to Groq — free, fast, no billing required

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is not defined in environment variables");
}const GROQ_URL     = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL        = 'llama-3.3-70b-versatile';

const SYSTEM_PROMPT = `You are "Suvidha AI", a helpful assistant for the SUVIDHA government services portal.

SUVIDHA helps citizens with these 4 departments:
1. ELECTRICITY - Pay bills, new connection, complaints, track status
2. GAS - Pay bills, book cylinder, new connection, complaints, track status
3. WATER - Pay bills, new connection, complaints, track status
4. MUNICIPALITY - Property tax, birth/death/marriage certificates, building approval, trade license, complaints

PAYMENT: All payments via UPI, Card or Netbanking.

YOUR RULES:
- Be friendly and concise
- Respond in Hindi if user writes Hindi, English if English
- Keep responses SHORT — 2-4 lines max
- Never make up bill amounts or account details

EXAMPLES:
User: "bijli bill kaise bharun?"
You: "Bijli ka bill bharne ke liye Dashboard par Electricity section mein jayein. Wahan Connection ID enter karke UPI/Card se pay kar sakte hain. 💡"

User: "How do I book a gas cylinder?"
You: "Go to Gas section on dashboard, select Book Cylinder, choose your connection and confirm — delivery in 48 hours! 🔥"`;

const sendToGemini = async (userMessage, conversationHistory = []) => {
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...conversationHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.text,
    })),
    { role: 'user', content: userMessage },
  ];

  try {
    const response = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({ model: MODEL, messages, max_tokens: 200, temperature: 0.7 }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err?.error?.message || `Groq API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'Sorry, could not generate a response.';

  } catch (error) {
    console.error('[Groq] Error:', error.message);
    throw error;
  }
};

const getQuickReplies = (lastBotMessage = '') => {
  const msg = lastBotMessage.toLowerCase();
  if (msg.includes('electricity') || msg.includes('bijli'))
    return ['Pay electricity bill', 'New connection', 'File complaint'];
  if (msg.includes('gas') || msg.includes('cylinder'))
    return ['Pay gas bill', 'Book cylinder', 'Gas complaint'];
  if (msg.includes('water') || msg.includes('paani'))
    return ['Pay water bill', 'New connection', 'Water complaint'];
  if (msg.includes('municipality') || msg.includes('nagar') || msg.includes('property'))
    return ['Property tax', 'Birth certificate', 'File complaint'];
  if (msg.includes('payment') || msg.includes('bill') || msg.includes('receipt'))
    return ['Payment history', 'Download receipt', 'Track status'];
  return ['Pay a bill', 'Track complaint', 'New connection'];
};

module.exports = { sendToGemini, getQuickReplies };