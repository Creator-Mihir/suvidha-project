import React, { useState } from 'react';
import { Delete, ArrowRight } from 'lucide-react';

const KioskKeypad = ({ onConfirm, title = "Enter Mobile Number" }) => {
  const [value, setValue] = useState("");

  const addNumber = (num) => {
    if (value.length < 10) setValue(value + num);
  };

  const removeNumber = () => {
    setValue(value.slice(0, -1));
  };

  return (
    <div className="flex flex-col items-center bg-white p-10 rounded-[3rem] shadow-2xl border-4 border-slate-100 w-full max-w-lg mx-auto">
      <h2 className="text-3xl font-black text-slate-800 mb-8">{title}</h2>
      
      {/* Number Display Area */}
      <div className="w-full bg-slate-100 rounded-2xl py-6 px-8 mb-10 text-center border-2 border-blue-200">
        <span className="text-5xl font-mono font-bold tracking-[0.5em] text-blue-700">
          {value.padEnd(10, "·")}
        </span>
      </div>

      {/* Grid - Extra Large for Kiosk Touch */}
      <div className="grid grid-cols-3 gap-6 w-full">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => addNumber(num)}
            className="h-24 bg-slate-50 hover:bg-blue-50 active:bg-blue-600 active:text-white rounded-2xl text-4xl font-bold text-slate-700 border-2 border-slate-200 transition-all shadow-sm"
          >
            {num}
          </button>
        ))}
        <button 
          onClick={removeNumber}
          className="h-24 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center border-2 border-red-100 active:bg-red-600 active:text-white"
        >
          <Delete size={40} />
        </button>
        <button
          onClick={() => addNumber(0)}
          className="h-24 bg-slate-50 hover:bg-blue-50 rounded-2xl text-4xl font-bold text-slate-700 border-2 border-slate-200"
        >
          0
        </button>
        <button
          onClick={() => onConfirm(value)}
          disabled={value.length < 10}
          className="h-24 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 disabled:opacity-50 disabled:bg-slate-300"
        >
          <ArrowRight size={40} />
        </button>
      </div>
    </div>
  );
};

export default KioskKeypad;