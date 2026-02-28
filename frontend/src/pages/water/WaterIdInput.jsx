import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { getWaterConnections } from '../../services/waterService';

const Numpad = ({ onInput, onClear, onDelete }) => {
  const keys = ['1','2','3','4','5','6','7','8','9','C','0','DEL'];
  return (
    <div className="grid grid-cols-3 gap-3">
      {keys.map(key => (
        <button key={key}
          onClick={() => { if (key === 'C') onClear(); else if (key === 'DEL') onDelete(); else onInput(key); }}
          className={`py-6 rounded-2xl text-2xl font-bold transition-all border border-slate-200
            ${key === 'C' ? 'text-red-500 bg-white hover:bg-red-50' :
              key === 'DEL' ? 'text-orange-500 bg-white hover:bg-orange-50' :
              'bg-white hover:bg-slate-50 text-slate-800'}
            active:scale-95 shadow-sm`}>
          {key}
        </button>
      ))}
    </div>
  );
};

export default function WaterIdInput({ connId, setConnId, setView, handleNumpadInput, formatId }) {
  const [savedConns, setSavedConns] = useState([]);
  const [loadingConns, setLoadingConns] = useState(true);

  useEffect(() => {
    getWaterConnections()
      .then(res => setSavedConns(res.data?.connections || []))
      .catch(() => {})
      .finally(() => setLoadingConns(false));
  }, []);

  const handleSavedClick = (id) => {
    setConnId(id);
    setView('bill');
  };

  return (
    <div className="bg-white p-10 rounded-[40px] shadow-lg max-w-5xl mx-auto w-full">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Enter Connection ID</h2>
        <p className="text-slate-500">Connection number dalein ya neeche se chunein</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <input type="text" readOnly value={connId} placeholder="____-____-___"
            className="w-full text-center text-3xl font-bold tracking-[0.2em] py-6 px-4 bg-slate-50 border-2 border-slate-200 rounded-[25px] text-blue-600 outline-none" />
          <Numpad
            onInput={handleNumpadInput}
            onClear={() => setConnId('')}
            onDelete={() => setConnId(prev => formatId(prev.replace(/-/g, '').slice(0, -1)))}
          />
          <button
            onClick={() => connId.length >= 10 && setView('bill')}
            disabled={connId.length < 10}
            className="w-full py-6 bg-blue-600 text-white rounded-3xl font-bold text-2xl shadow-xl active:scale-95 transition-transform disabled:opacity-50">
            Proceed
          </button>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs uppercase font-bold text-slate-400 tracking-widest px-2">Saved Connections</h4>
          {loadingConns ? (
            <div className="flex items-center justify-center py-8 gap-2 text-slate-400">
              <Loader2 className="animate-spin" size={20} /><span>Loading...</span>
            </div>
          ) : (
            savedConns.map((conn, i) => (
              <div key={i}
                onClick={() => handleSavedClick(conn.connectionId)}
                className={`p-6 rounded-3xl cursor-pointer transition-colors ${i === 0 ? 'bg-blue-50 border-2 border-blue-200 hover:bg-blue-100' : 'bg-slate-50 border-2 border-transparent hover:border-slate-200'}`}>
                <p className={`font-bold ${i === 0 ? 'text-blue-900' : 'text-slate-800'}`}>{conn.label}</p>
                <p className={`text-sm ${i === 0 ? 'text-blue-600' : 'text-slate-500'}`}>ID: {conn.connectionId}</p>
                <p className="text-xs text-slate-400">{conn.address}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}