import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Mic, MicOff, Sparkles, Loader2, RotateCcw } from 'lucide-react';
import { sendToGemini, getQuickReplies } from '../../services/geminiService';

const SuvidhaAI = () => {
  const [isOpen, setIsOpen]           = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [userInput, setUserInput]     = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', text: 'नमस्ते! मैं आपकी कैसे सहायता कर सकता हूँ?\n\nHello! How can I help you today? 🙏', id: 0 }
  ]);
  const [loading, setLoading]             = useState(false);
  const [voiceError, setVoiceError]       = useState('');
  const [quickReplies, setQuickReplies]   = useState(['Pay a bill', 'Track complaint', 'New connection']);

  const bottomRef      = useRef(null);
  const recognitionRef = useRef(null);

  // Auto scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // ── Send message to Gemini ──────────────────────────────────────────────────
  const handleSend = async (text = userInput.trim()) => {
    if (!text || loading) return;

    const userMsg    = { role: 'user', text, id: Date.now() };
    const loadingMsg = { role: 'ai', text: '', loading: true, id: Date.now() + 1 };

    setChatHistory(prev => [...prev, userMsg, loadingMsg]);
    setUserInput('');
    setLoading(true);

    // Build history for Gemini context (skip loading msgs + initial greeting)
    const history = chatHistory
      .filter(m => !m.loading)
      .slice(1)
      .map(m => ({ role: m.role, text: m.text }));

    try {
      console.log('[SuvidhaAI] Calling sendToGemini...');
      const reply = await sendToGemini(text, history);
      
      console.log('[SuvidhaAI] Got reply:', reply);
      
      setChatHistory(prev => [
        ...prev.filter(m => !m.loading),
        { role: 'ai', text: reply, id: Date.now() + 2 }
      ]);
      setQuickReplies(getQuickReplies(reply));
    } catch (error) {
      console.error('[SuvidhaAI] Error:', error);
      setChatHistory(prev => [
        ...prev.filter(m => !m.loading),
        { 
          role: 'ai', 
          text: `Sorry, technical issue. ${error.message || 'Thodi der baad try karein.'} 🙏`, 
          id: Date.now() + 2 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ── Voice Input (Web Speech API) ────────────────────────────────────────────
  const handleVoice = () => {
    setVoiceError('');

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceError('Voice not supported. Please use Chrome.');
      return;
    }

    const recognition        = new SpeechRecognition();
    recognitionRef.current   = recognition;
    recognition.continuous    = false;
    recognition.interimResults = true;
    recognition.lang          = 'hi-IN';

    recognition.onstart  = () => setIsListening(true);

    recognition.onresult = (e) => {
      const transcript = Array.from(e.results)
        .map(r => r[0].transcript)
        .join('');
      setUserInput(transcript);
    };

    recognition.onend = () => setIsListening(false);

    recognition.onerror = (e) => {
      setIsListening(false);
      setVoiceError(
        e.error === 'not-allowed' ? 'Microphone permission denied.' : 'Voice error. Try again.'
      );
    };

    recognition.start();
  };

  // ── Clear chat ──────────────────────────────────────────────────────────────
  const handleClear = () => {
    setChatHistory([
      { role: 'ai', text: 'नमस्ते! मैं आपकी कैसे सहायता कर सकता हूँ?\n\nHello! How can I help you today? 🙏', id: 0 }
    ]);
    setQuickReplies(['Pay a bill', 'Track complaint', 'New connection']);
    setVoiceError('');
  };

  return (
    <div className="fixed bottom-0 left-5 z-50 flex flex-col items-start mb-10">

      {/* ── 1. Chat Panel ── */}
      {isOpen && (
        <div className=" w-[500px] h-[580px] bg-slate-900/95 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.5)] border-4 border-blue-500/20 overflow-hidden flex flex-col animate-in slide-in-from-bottom-20 pointer-events-auto">

          {/* Header */}
          <div className="p-8 flex justify-between items-center bg-blue-600 flex-shrink-0">
            <div className="flex items-center gap-4">
              <Bot size={40} className="text-white" />
              <div>
                <h2 className="text-white text-2xl font-bold leading-tight">Suvidha AI</h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-blue-100 text-xs">Online • Gemini powered</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Clear chat */}
              <button
                onClick={handleClear}
                className="bg-white/20 p-2 rounded-full text-white active:scale-90 transition-transform"
                title="Clear chat"
              >
                <RotateCcw size={20} />
              </button>
              {/* Close */}
              <button
                onClick={() => setIsOpen(false)}
                className="bg-white/20 p-3 rounded-full text-white active:scale-90 transition-transform"
              >
                <X size={32} />
              </button>
            </div>
          </div>

          {/* Chat messages */}
          <div className="flex-1 p-8 overflow-y-auto space-y-6 bg-slate-50" style={{ minHeight: 0 }}>
            {chatHistory.map((msg, i) => (
              <div key={msg.id || i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-5 rounded-3xl text-xl shadow-sm whitespace-pre-line ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-white text-slate-800 rounded-tl-none border'
                }`}>
                  {msg.loading ? (
                    /* Typing dots */
                    <span className="flex items-center gap-1.5 py-1">
                      <span className="w-2.5 h-2.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2.5 h-2.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2.5 h-2.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                  ) : msg.text}
                </div>
              </div>
            ))}

            {/* Quick reply chips */}
            {quickReplies.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {quickReplies.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(r)}
                    className="bg-white border border-blue-200 text-blue-600 text-sm font-semibold px-4 py-2 rounded-full hover:bg-blue-50 active:scale-95 transition-all shadow-sm"
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Voice error */}
          {voiceError && (
            <div className="px-8 py-2 bg-red-50 text-red-500 text-sm font-semibold flex-shrink-0">
              ⚠️ {voiceError}
            </div>
          )}

          {/* Input Panel */}
          <div className="p-6 bg-white border-t-2 border-slate-200 flex-shrink-0">
            <div className="flex flex-col gap-4">
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="यहाँ लिखें या बोलें..."
                className="w-full h-24 bg-slate-100 rounded-2xl p-4 text-xl outline-none focus:ring-4 focus:ring-blue-500/20 resize-none"
              />
              <div className="flex gap-4">
                {/* Voice button */}
                <button
                  onClick={handleVoice}
                  className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-2xl text-white font-bold text-xl active:scale-95 transition-all ${
                    isListening ? 'bg-red-500 animate-pulse' : 'bg-slate-700'
                  }`}
                >
                  {isListening ? <MicOff size={28} /> : <Mic size={28} />}
                  <span>{isListening ? 'Listening...' : 'Voice'}</span>
                </button>

                {/* Send button */}
                <button
                  onClick={() => handleSend()}
                  disabled={!userInput.trim() || loading}
                  className="flex-1 bg-blue-600 flex items-center justify-center gap-3 py-5 rounded-2xl text-white font-bold text-xl active:scale-95 transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
                >
                  {loading ? <Loader2 size={28} className="animate-spin" /> : <Send size={28} />}
                  <span>{loading ? 'Thinking...' : 'Send'}</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ── 2. Floating AI Button ── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`pointer-events-auto relative group flex items-center justify-center transition-all duration-500 ${
          isOpen ? 'opacity-0 scale-50' : 'opacity-100 scale-100'
        }`}
      >
        <div className="absolute inset-0 bg-blue-500 rounded-full blur-2xl opacity-40 group-active:opacity-80 animate-pulse" />
        <div className="relative bg-gradient-to-tr from-blue-600 to-indigo-700 p-8 rounded-full border-4 border-white/30 shadow-2xl flex flex-col items-center gap-1 active:scale-90">
          <Sparkles className="text-white absolute -top-2 -right-2 animate-bounce" size={24} />
          <Bot size={56} className="text-white" />
          <span className="text-white font-black text-xs uppercase tracking-tighter">AI Help</span>
        </div>
      </button>

    </div>
  );
};

export default SuvidhaAI;