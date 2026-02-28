import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { setupProfile } from "../services/citizenService";
import { useTranslation } from "react-i18next";

// ── ON-SCREEN KEYBOARD LAYOUT ──────────────────────────────────────────────────
const ROWS_EN = [
  ["1","2","3","4","5","6","7","8","9","0"],
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L"],
  ["Z","X","C","V","B","N","M"],
];

const ROWS_HI = [
  ["१","२","३","४","५","६","७","८","९","०"],
  ["क","ख","ग","घ","च","छ","ज","झ","ट","ठ"],
  ["ड","ढ","त","थ","द","ध","न","प","फ"],
  ["ब","भ","म","य","र","ल","व","स","ह"],
];

const CITY_OPTIONS = [
  "Bhopal","Indore","Jabalpur","Gwalior","Ujjain",
  "Sagar","Rewa","Satna","Dewas","Ratlam",
  "Chhindwara","Singrauli","Vidisha","Hoshangabad","Balaghat",
];

function Key({ label, onClick, wide, accent }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: wide ? "18px 28px" : "18px 0",
        width: wide ? "auto" : "72px",
        minWidth: wide ? 100 : 72,
        background: accent
          ? "linear-gradient(135deg,#2563EB,#1D4ED8)"
          : "white",
        color: accent ? "white" : "#1e293b",
        border: accent ? "none" : "2px solid #e2e8f0",
        borderRadius: 16,
        fontSize: wide ? 18 : 22,
        fontWeight: 700,
        cursor: "pointer",
        boxShadow: accent
          ? "0 4px 14px rgba(37,99,235,0.35)"
          : "0 2px 8px rgba(0,0,0,0.06)",
        transition: "transform 0.08s, box-shadow 0.08s",
        userSelect: "none",
        letterSpacing: 0,
        fontFamily: "'Noto Sans', 'Segoe UI', sans-serif",
      }}
      onMouseDown={e => { e.currentTarget.style.transform = "scale(0.93)"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.08)"; }}
      onMouseUp={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = accent ? "0 4px 14px rgba(37,99,235,0.35)" : "0 2px 8px rgba(0,0,0,0.06)"; }}
      onTouchStart={e => { e.currentTarget.style.transform = "scale(0.93)"; }}
      onTouchEnd={e => { e.currentTarget.style.transform = "scale(1)"; }}
    >
      {label}
    </button>
  );
}

function OnScreenKeyboard({ value, onChange, lang }) {
  const ROWS = lang === "hi" ? ROWS_HI : ROWS_EN;

  const press = useCallback((char) => {
    onChange(prev => prev + char);
  }, [onChange]);

  const backspace = useCallback(() => {
    onChange(prev => prev.slice(0, -1));
  }, [onChange]);

  const space = useCallback(() => {
    onChange(prev => prev + " ");
  }, [onChange]);

  return (
    <div style={{
      background: "#f1f5f9",
      borderRadius: 24,
      padding: "20px 16px 16px",
      border: "2px solid #e2e8f0",
      boxShadow: "inset 0 2px 8px rgba(0,0,0,0.04)",
    }}>
      {ROWS.map((row, ri) => (
        <div key={ri} style={{
          display: "flex",
          justifyContent: "center",
          gap: 8,
          marginBottom: 8,
        }}>
          {row.map(char => (
            <Key key={char} label={char} onClick={() => press(char)} />
          ))}
        </div>
      ))}

      {/* Bottom row: Space + Backspace */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 4 }}>
        <Key label="⌫" wide onClick={backspace} />
        <button
          onClick={space}
          style={{
            flex: 1,
            maxWidth: 380,
            padding: "18px 0",
            background: "white",
            color: "#94a3b8",
            border: "2px solid #e2e8f0",
            borderRadius: 16,
            fontSize: 15,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            letterSpacing: 2,
          }}
          onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"}
          onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
        >
          SPACE
        </button>
        <Key label="CLEAR" wide accent onClick={() => onChange("")} />
      </div>
    </div>
  );
}

// ── MAIN COMPONENT ─────────────────────────────────────────────────────────────
function WelcomeSetup() {
  const navigate = useNavigate();
  const { t } = useTranslation("welcome");

  const [step, setStep]         = useState("name");   // "name" | "city"
  const [fullName, setFullName] = useState("");
  const [city, setCity]         = useState("");
  const [lang, setLang]         = useState("en");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handleContinueFromName = () => {
    if (fullName.trim().length < 2) {
      setError(lang === "hi" ? "कृपया अपना नाम दर्ज करें" : "Please enter your name (min 2 letters)");
      return;
    }
    setError("");
    setStep("city");
  };

  const handleFinish = async (selectedCity) => {
    setLoading(true);
    setError("");
    try {
      await setupProfile({ fullName: fullName.trim(), city: selectedCity || city });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || (lang === "hi" ? "कुछ गलत हो गया" : "Something went wrong"));
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("suvidha_user") || "{}");
      await setupProfile({ fullName: `User ${user.mobile?.slice(-4) || ""}` });
      navigate("/dashboard");
    } catch {
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg,#EFF6FF 0%,#F0F9FF 50%,#F5F3FF 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px 16px",
      fontFamily: "'Noto Sans', 'Segoe UI', sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* Background blobs */}
      <div style={{ position:"absolute", top:"-80px", right:"-80px", width:400, height:400, background:"#BFDBFE", borderRadius:"50%", filter:"blur(80px)", opacity:0.5, pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:"-80px", left:"-80px", width:350, height:350, background:"#C7D2FE", borderRadius:"50%", filter:"blur(80px)", opacity:0.4, pointerEvents:"none" }} />

      {/* Language toggle */}
      <div style={{ position:"absolute", top:20, right:20, display:"flex", background:"white", borderRadius:14, padding:4, boxShadow:"0 2px 12px rgba(0,0,0,0.08)", border:"2px solid #e2e8f0", zIndex:10 }}>
        {["en","hi"].map(l => (
          <button key={l} onClick={() => setLang(l)} style={{
            padding:"10px 20px", border:"none", borderRadius:10, cursor:"pointer",
            background: lang===l ? "#2563EB" : "transparent",
            color: lang===l ? "white" : "#64748b",
            fontWeight:700, fontSize:14, transition:"all 0.2s",
          }}>{l === "en" ? "EN" : "हि"}</button>
        ))}
      </div>

      {/* Card */}
      <div style={{
        background: "white",
        borderRadius: 32,
        padding: "36px 40px 32px",
        width: "100%",
        maxWidth: 860,
        boxShadow: "0 32px 64px rgba(0,0,0,0.10)",
        border: "2px solid rgba(255,255,255,0.8)",
        position: "relative",
        zIndex: 1,
      }}>

        {/* ── STEP 1: NAME ── */}
        {step === "name" && (
          <>
            {/* Header */}
            <div style={{ textAlign:"center", marginBottom:28 }}>
              <div style={{ width:72, height:72, background:"#EFF6FF", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, margin:"0 auto 16px" }}>👤</div>
              <h2 style={{ fontSize:30, fontWeight:900, color:"#0f172a", margin:"0 0 8px" }}>
                {lang === "hi" ? "आपका नाम क्या है?" : "What's your name?"}
              </h2>
              <p style={{ color:"#64748b", fontSize:16, margin:0 }}>
                {lang === "hi" ? "नीचे से अपना नाम टाइप करें" : "Tap the letters below to type your name"}
              </p>
            </div>

            {/* Name display box */}
            <div style={{
              background: "#F8FAFC",
              border: "3px solid #2563EB",
              borderRadius: 20,
              padding: "20px 28px",
              marginBottom: 20,
              minHeight: 72,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <span style={{
                fontSize: 32,
                fontWeight: 800,
                color: fullName ? "#0f172a" : "#cbd5e1",
                letterSpacing: 1,
                flex: 1,
              }}>
                {fullName || (lang === "hi" ? "आपका नाम यहाँ दिखेगा..." : "Your name appears here...")}
              </span>
              {/* Blinking cursor */}
              {fullName.length > 0 && (
                <span style={{ width:3, height:36, background:"#2563EB", display:"inline-block", borderRadius:2, animation:"blink 1s infinite", marginLeft:4 }} />
              )}
            </div>

            {/* Error */}
            {error && (
              <div style={{ background:"#FEF2F2", border:"2px solid #FCA5A5", borderRadius:14, padding:"12px 18px", marginBottom:16, color:"#DC2626", fontWeight:700, fontSize:14, display:"flex", alignItems:"center", gap:8 }}>
                ⚠️ {error}
              </div>
            )}

            {/* Keyboard */}
            <OnScreenKeyboard value={fullName} onChange={setFullName} lang={lang} />

            {/* Action buttons */}
            <div style={{ display:"flex", gap:12, marginTop:20 }}>
              <button onClick={handleSkip} disabled={loading} style={{
                flex:1, padding:"18px", background:"#F1F5F9", color:"#64748b",
                border:"2px solid #e2e8f0", borderRadius:18, fontSize:16, fontWeight:700,
                cursor:"pointer", transition:"all 0.2s",
              }}>
                {lang === "hi" ? "छोड़ें" : "Skip"}
              </button>
              <button
                onClick={handleContinueFromName}
                disabled={fullName.trim().length < 2 || loading}
                style={{
                  flex:3, padding:"18px", fontSize:20, fontWeight:900,
                  background: fullName.trim().length >= 2
                    ? "linear-gradient(135deg,#2563EB,#1D4ED8)"
                    : "#E2E8F0",
                  color: fullName.trim().length >= 2 ? "white" : "#94a3b8",
                  border:"none", borderRadius:18, cursor: fullName.trim().length >= 2 ? "pointer" : "not-allowed",
                  boxShadow: fullName.trim().length >= 2 ? "0 8px 24px rgba(37,99,235,0.3)" : "none",
                  transition:"all 0.3s",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:10,
                }}
              >
                {lang === "hi" ? "आगे बढ़ें →" : "Continue →"}
              </button>
            </div>
          </>
        )}

        {/* ── STEP 2: CITY (tap to select, no keyboard needed) ── */}
        {step === "city" && (
          <>
            <div style={{ textAlign:"center", marginBottom:28 }}>
              <div style={{ width:72, height:72, background:"#F0FDF4", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, margin:"0 auto 16px" }}>📍</div>
              <h2 style={{ fontSize:28, fontWeight:900, color:"#0f172a", margin:"0 0 8px" }}>
                {lang === "hi" ? "आपका शहर?" : "Your City?"}
              </h2>
              <p style={{ color:"#64748b", fontSize:16, margin:0 }}>
                {lang === "hi" ? "अपना शहर चुनें या छोड़ें" : "Tap your city or skip"}
              </p>

              {/* Selected name reminder */}
              <div style={{ marginTop:14, background:"#EFF6FF", borderRadius:14, padding:"10px 20px", display:"inline-block" }}>
                <span style={{ color:"#1D4ED8", fontWeight:700, fontSize:16 }}>👤 {fullName}</span>
              </div>
            </div>

            {/* City grid — big tap targets, no keyboard needed */}
            <div style={{
              display:"grid",
              gridTemplateColumns:"repeat(4, 1fr)",
              gap:10,
              marginBottom:20,
              maxHeight:320,
              overflowY:"auto",
            }}>
              {CITY_OPTIONS.map(c => (
                <button
                  key={c}
                  onClick={() => { setCity(c); handleFinish(c); }}
                  disabled={loading}
                  style={{
                    padding:"16px 8px",
                    background: city===c ? "#2563EB" : "#F8FAFC",
                    color: city===c ? "white" : "#334155",
                    border: city===c ? "2px solid #2563EB" : "2px solid #e2e8f0",
                    borderRadius:16,
                    fontSize:15,
                    fontWeight:700,
                    cursor:"pointer",
                    transition:"all 0.15s",
                    boxShadow: city===c ? "0 4px 14px rgba(37,99,235,0.25)" : "none",
                  }}
                  onMouseEnter={e => { if(city!==c){ e.currentTarget.style.background="#EFF6FF"; e.currentTarget.style.borderColor="#93C5FD"; }}}
                  onMouseLeave={e => { if(city!==c){ e.currentTarget.style.background="#F8FAFC"; e.currentTarget.style.borderColor="#e2e8f0"; }}}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Error */}
            {error && (
              <div style={{ background:"#FEF2F2", border:"2px solid #FCA5A5", borderRadius:14, padding:"12px 18px", marginBottom:16, color:"#DC2626", fontWeight:700, fontSize:14 }}>
                ⚠️ {error}
              </div>
            )}

            {/* Actions */}
            <div style={{ display:"flex", gap:12 }}>
              <button onClick={() => setStep("name")} style={{
                flex:1, padding:"18px", background:"#F1F5F9", color:"#64748b",
                border:"2px solid #e2e8f0", borderRadius:18, fontSize:16, fontWeight:700, cursor:"pointer",
              }}>
                ← {lang === "hi" ? "वापस" : "Back"}
              </button>
              <button
                onClick={() => handleFinish("")}
                disabled={loading}
                style={{
                  flex:2, padding:"18px", fontSize:18, fontWeight:800,
                  background:"linear-gradient(135deg,#2563EB,#1D4ED8)",
                  color:"white", border:"none", borderRadius:18, cursor:"pointer",
                  boxShadow:"0 8px 24px rgba(37,99,235,0.3)",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                }}
              >
                {loading
                  ? (lang === "hi" ? "⏳ सहेज रहे हैं..." : "⏳ Saving...")
                  : (lang === "hi" ? "✅ शुरू करें" : "✅ Get Started")}
              </button>
            </div>
          </>
        )}

      </div>

      {/* Kiosk hint */}
      <p style={{ marginTop:20, color:"#94a3b8", fontSize:13, fontWeight:600, zIndex:1 }}>
        {lang === "hi" ? "💡 स्क्रीन पर टैप करके टाइप करें" : "💡 Tap the on-screen keys to type"}
      </p>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default WelcomeSetup;