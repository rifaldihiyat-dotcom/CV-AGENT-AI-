import { useState, useEffect } from "react";
import { Sparkles, Key, AlertCircle, RefreshCw } from "lucide-react";

interface ServiceStatus {
  status: string;
  hasApiKey: boolean;
  message: string;
}

export default function StatusBanner() {
  const [status, setStatus] = useState<ServiceStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/status");
      const data = await res.json();
      setStatus(data);
    } catch (err) {
      console.error("Gagal mengambil status server:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-3 mb-6 bg-slate-50 border border-slate-300 rounded-2xl text-xs text-slate-500 animate-pulse">
        <RefreshCw className="w-3.5 h-3.5 mr-2 animate-spin text-slate-400" />
        Memeriksa konektivitas Gemini AI...
      </div>
    );
  }

  if (!status) return null;

  return (
    <div 
      id="status-banner"
      className={`p-4 mb-6 rounded-2xl border-2 text-sm transition-all duration-300 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 ${
        status.hasApiKey 
          ? "bg-emerald-50/70 border-emerald-300 text-emerald-900" 
          : "bg-amber-50/70 border-amber-300 text-amber-900"
      }`}
    >
      <div className="flex items-start gap-3">
        {status.hasApiKey ? (
          <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700 shrink-0 border border-emerald-200">
            <Sparkles className="w-4 h-4" />
          </div>
        ) : (
          <div className="p-2 bg-amber-100 rounded-lg text-amber-700 shrink-0 border border-amber-200">
            <AlertCircle className="w-4 h-4" />
          </div>
        )}
        <div>
          <h4 className="font-bold text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">
            {status.hasApiKey ? "Gemini AI API Terhubung" : "Mode Simulasi Aktif"}
          </h4>
          <p className="text-xs leading-relaxed opacity-90 font-medium">
            {status.message}
          </p>
        </div>
      </div>

      {!status.hasApiKey && (
        <div className="flex items-center text-xs bg-white text-slate-800 px-3 py-1.5 rounded-xl border border-amber-350 hover:bg-amber-100/50 transition-colors shrink-0">
          <Key className="w-3.5 h-3.5 mr-1.5 text-amber-600 font-bold" />
          <span>Atur <strong>GEMINI_API_KEY</strong> di Secrets</span>
        </div>
      )}
    </div>
  );
}
