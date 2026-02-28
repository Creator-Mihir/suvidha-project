// ─── Gemini AI Service (Frontend) ────────────────────────────────────────────
// Location: frontend/src/services/geminiService.js
// Calls API Gateway which routes to Gemini Microservice
// WITH DEBUGGING: Shows exactly what's going wrong

// In React, environment variables must start with REACT_APP_
// Get API Gateway URL - uses current domain
const API_GATEWAY_URL = window.location.origin;
const GEMINI_CHAT_URL = 'http://localhost:5008/api/gemini/chat';

console.log('[Gemini Service] Initialized');
console.log('[Gemini Service] API Gateway URL:', API_GATEWAY_URL);
console.log('[Gemini Service] Chat URL:', GEMINI_CHAT_URL);

// ─── Send message to Gemini (via API Gateway) ────────────────────────────────
export const sendToGemini = async (userMessage, conversationHistory = []) => {
  try {
    console.log('[Gemini Service] ============================================');
    console.log('[Gemini Service] sendToGemini called');
    console.log('[Gemini Service] User message:', userMessage);
    console.log('[Gemini Service] Conversation history length:', conversationHistory.length);

    const requestBody = {
      userMessage,
      conversationHistory,
    };

    console.log('[Gemini Service] Request body:', JSON.stringify(requestBody, null, 2));
    console.log('[Gemini Service] Sending fetch request to:', GEMINI_CHAT_URL);

    const response = await fetch(GEMINI_CHAT_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('[Gemini Service] Response received');
    console.log('[Gemini Service] Response Status:', response.status);
    console.log('[Gemini Service] Response OK:', response.ok);
    console.log('[Gemini Service] Response Headers:', {
      'content-type': response.headers.get('content-type'),
      'content-length': response.headers.get('content-length'),
    });

    // Get the response text first to debug
    const responseText = await response.text();
    console.log('[Gemini Service] Response Text (raw):', responseText);
    console.log('[Gemini Service] Response Text Length:', responseText.length);

    // Check if response is empty
    if (!responseText || responseText.trim() === '') {
      console.error('[Gemini Service] Response is empty!');
      throw new Error('Server returned an empty response. Make sure Gemini Service is running on port 5008.');
    }

    // Try to parse JSON
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('[Gemini Service] Response parsed successfully:', data);
    } catch (jsonError) {
      console.error('[Gemini Service] JSON Parse Error:', jsonError.message);
      console.error('[Gemini Service] Response was:', responseText);
      throw new Error(`Invalid JSON response: ${jsonError.message}\n\nServer said: ${responseText.substring(0, 200)}`);
    }

    // Check if response was successful
    if (!response.ok) {
      console.error('[Gemini Service] Response not OK (status:', response.status + ')');
      console.error('[Gemini Service] Error response:', data);
      throw new Error(data.error || data.message || `API Error: ${response.status}`);
    }

    // Check if data has success flag
    if (data.success === false) {
      console.error('[Gemini Service] Server returned success: false');
      console.error('[Gemini Service] Error:', data.error);
      throw new Error(data.error || 'Server returned an error');
    }

    // Extract reply from nested data structure
    const reply = data.data?.reply || data.reply;
    
    if (!reply) {
      console.error('[Gemini Service] No reply in response!');
      console.error('[Gemini Service] Full response:', data);
      throw new Error('No reply received from server. Response structure: ' + JSON.stringify(data));
    }

    console.log('[Gemini Service] Reply extracted:', reply);
    console.log('[Gemini Service] ============================================');
    
    return reply;
  } catch (error) {
    console.error('[Gemini Service] ✗ CATCH ERROR');
    console.error('[Gemini Service] Error message:', error.message);
    console.error('[Gemini Service] Error stack:', error.stack);
    console.error('[Gemini Service] ============================================');
    throw error;
  }
};

// ─── Get quick reply suggestions ──────────────────────────────────────────────
export const getQuickReplies = (lastBotMessage = '') => {
  const msg = lastBotMessage.toLowerCase();

  if (msg.includes('electricity') || msg.includes('bijli'))
    return ['Pay electricity bill', 'New connection', 'File complaint'];
  if (msg.includes('gas') || msg.includes('cylinder'))
    return ['Pay gas bill', 'Book cylinder', 'Gas complaint'];
  if (msg.includes('water') || msg.includes('paani'))
    return ['Pay water bill', 'New connection', 'Water complaint'];
  if (msg.includes('municipality') || msg.includes('nagar'))
    return ['Property tax', 'Birth certificate', 'File complaint'];
  if (msg.includes('payment') || msg.includes('bill'))
    return ['Payment history', 'Download receipt', 'Track status'];

  // Default quick replies
  return ['Pay a bill', 'Track complaint', 'New connection'];
};