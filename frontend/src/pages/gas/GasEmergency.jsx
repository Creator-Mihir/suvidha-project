export default function GasEmergency({ setView }) {
  return (
    <div className="fixed inset-0 bg-red-600 z-[200] p-6 text-white overflow-y-auto flex items-start justify-center">
      <div className="max-w-xl w-full pt-10 pb-20 text-center">
        <div className="w-32 h-32 bg-white text-red-600 rounded-full flex items-center justify-center text-6xl mx-auto mb-6 shadow-2xl animate-bounce">🚨</div>
        <h2 className="text-5xl font-black mb-2 uppercase tracking-tighter">Gas Leak Alert</h2>
        <p className="text-xl font-bold opacity-80 mb-10">Follow Safety Instructions Immediately</p>
        <div className="text-left space-y-4">
          <div className="bg-white/10 p-6 rounded-[2.5rem] border border-white/20">
            <p className="font-black text-2xl mb-4">Critical Steps:</p>
            <ul className="space-y-4 font-bold">
              <li className="flex gap-4"><span>🏠</span> Open all windows & doors for ventilation.</li>
              <li className="flex gap-4"><span>⭕</span> Turn OFF the main gas regulator.</li>
              <li className="flex gap-4"><span>💡</span> Do NOT operate any electrical switches.</li>
              <li className="flex gap-4"><span>🔥</span> Extinguish all open flames (Candles/Incense).</li>
            </ul>
          </div>
          <div className="bg-white p-8 rounded-[3rem] text-center text-red-600 shadow-2xl">
            <p className="text-xs font-black uppercase tracking-widest mb-1">Emergency Helpline</p>
            <a href="tel:1906" className="text-6xl font-black block">1906</a>
          </div>
          <button
            onClick={() => setView('menu')}
            className="w-full py-6 text-white font-bold opacity-50 underline"
          >
            Instructions Followed - Exit
          </button>
        </div>
      </div>
    </div>
  );
}