import { useState } from "react";
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";

import TopBar from "../../components/TopBar";
import ElectricityMenu from "./ElectricityMenu";
import BillPayment from "./BillPayment";
import NewConnection from "./NewConnection";
import Complaints from "./Complaints";
import Tracking from "./Tracking";

export default function Electricity() {
  const { t } = useTranslation("electricity");
  const [view, setView] = useState("menu");
  const [billStep, setBillStep] = useState("id-input");
  const [connId, setConnId] = useState("");
  const [modal, setModal] = useState(null);
  const [refId, setRefId] = useState("");
  const [trackingId, setTrackingId] = useState("");

  const simulateSuccess = (title, msg, id) => {
    setRefId(id);
    setModal({ title, msg });
  };

  const closeModal = () => {
    setModal(null);
    setView("menu");
    setConnId("");
    setBillStep("id-input");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] font-sans text-slate-800">
      <TopBar />

      <main className="flex-1 p-6 w-full flex flex-col items-center">
        {view === "menu" && (
          <ElectricityMenu setView={setView} setBillStep={setBillStep} />
        )}
        {view === "bill-payment" && (
          <BillPayment
            billStep={billStep}
            setBillStep={setBillStep}
            connId={connId}
            setConnId={setConnId}
            setView={setView}
            simulateSuccess={simulateSuccess}
          />
        )}
        {view === "new-connection" && (
          <NewConnection setView={setView} simulateSuccess={simulateSuccess} />
        )}
        {view === "complaints" && (
          <Complaints setView={setView} simulateSuccess={simulateSuccess} />
        )}
        {view === "tracking" && (
          <Tracking setView={setView} externalTrackingId={trackingId} />
        )}
      </main>

      {modal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-[3rem] p-10 text-center shadow-2xl animate-in zoom-in-95">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={48} />
            </div>
            <h3 className="text-3xl font-black text-slate-800">
              {modal.title}
            </h3>
            <p className="text-slate-500 mt-4 leading-relaxed">{modal.msg}</p>
            <div className="mt-8 space-y-3">
              <button
                onClick={() => {
                  setModal(null);
                  setView("tracking");
                  setTrackingId(refId);
                }}
                className="w-full bg-blue-900 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-blue-800"
              >
                {t("modal.trackNow")}
              </button>
              <button
                onClick={closeModal}
                className="w-full text-slate-500 font-bold py-2 hover:text-slate-700"
              >
                {t("modal.backToMenu")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
