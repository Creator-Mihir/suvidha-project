export default function GlassCard({ icon: Icon, title, desc, color, onClick }) {
    return (
      <div
        onClick={onClick}
        className="bg-white/95 backdrop-blur-xl border border-slate-200 p-8 rounded-[2rem] cursor-pointer flex flex-col items-center text-center transition-all hover:-translate-y-1 hover:shadow-xl hover:border-blue-400 group"
      >
        <div className={`w-20 h-20 ${color} rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
          <Icon size={36} className="text-slate-700" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">{title}</h3>
        <p className="text-sm text-slate-500 mt-2">{desc}</p>
      </div>
    );
  }