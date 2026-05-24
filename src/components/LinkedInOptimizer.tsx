import { useState } from "react";
import { Linkedin, Zap, Check, Copy, ArrowRight, ArrowLeft, RefreshCw, Sparkles, Sliders } from "lucide-react";
import { LinkedInOptimization } from "../types";

export default function LinkedInOptimizer() {
  const [headline, setHeadline] = useState("");
  const [summary, setSummary] = useState("");
  const [targetRole, setTargetRole] = useState("UI/UX Designer Intern");
  const [loading, setLoading] = useState(false);
  const [optimization, setOptimization] = useState<LinkedInOptimization | null>(null);
  const [errorLocal, setErrorLocal] = useState<string | null>(null);
  const [copiedHeadline, setCopiedHeadline] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Quick fills to let student test features easily
  const templates = [
    {
      role: "SEO content writer",
      headline: "Mahasiswa S1 Sastra Inggris | Suka Menulis",
      summary: "Halo, saya suka sekali menulis artikel di waktu senggang. Saya mahasiswa semester akhir mencari magang."
    },
    {
      role: "Backend Engineer",
      headline: "Mencari lowongan IT | Junior Developer",
      summary: "Saya hobi belajar java dan database mysql. Ingin join startup rintisan lokal baru."
    }
  ];

  const triggerOptimization = async () => {
    if (!headline.trim() && !summary.trim()) {
      setErrorLocal("Silakan isi draf Headline atau Summary LinkedIn Anda saat ini.");
      return;
    }

    setLoading(true);
    setOptimization(null);
    setErrorLocal(null);
    setCopiedHeadline(false);
    setCopiedSummary(false);

    try {
      const response = await fetch("/api/linkedin-optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentHeadline: headline,
          currentSummary: summary,
          targetRole
        })
      });

      if (!response.ok) throw new Error("Gagal mengoptimalkan tulisan profil.");
      const data = await response.json();
      setOptimization(data);
    } catch (err) {
      setErrorLocal("Operasi optimasi terhambat. Silakan coba sesaat lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, type: "headline" | "summary") => {
    navigator.clipboard.writeText(text);
    if (type === "headline") {
      setCopiedHeadline(true);
      setTimeout(() => setCopiedHeadline(false), 2000);
    } else {
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2000);
    }
  };

  const fillTemplate = (tmp: typeof templates[0]) => {
    setHeadline(tmp.headline);
    setSummary(tmp.summary);
    setTargetRole(tmp.role);
    setErrorLocal(null);
  };

  return (
    <div id="linkedin-optimizer" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* SEKTOR KIRI - CURRENT PROFILE DETAILS */}
      <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-[0_10px_35px_-4px_rgba(30,41,59,0.07),0_4px_12px_-2px_rgba(30,41,59,0.04)]">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800">LinkedIn Profile Optimizer</h3>
            <p className="text-xs text-slate-500 leading-relaxed mt-1">
              Optimalkan tajuk utama (Headline) dan ringkasan profil (Summary) Anda agar ramah mesin pencari perekrut (SEO Recruitment LinkedIn).
            </p>
          </div>
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl border border-blue-300 shrink-0">
            <Linkedin className="w-5 h-5" />
          </div>
        </div>

        {/* Quick Fills */}
        <div className="mb-4 bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Isi Contoh Mahasiswa:
          </label>
          <div className="flex flex-col gap-2">
            {templates.map((tmp, idx) => (
              <button
                key={idx}
                type="button"
                id={`linkedin-tmpl-${idx}`}
                onClick={() => fillTemplate(tmp)}
                className="text-left text-xs bg-white hover:bg-blue-50/50 text-slate-600 hover:text-blue-800 border border-slate-350 p-2.5 rounded-xl transition duration-150 cursor-pointer"
              >
                <div className="font-semibold">{tmp.role} Aspirant</div>
                <div className="text-[10px] text-slate-400 mt-0.5 truncate italic">"{tmp.headline}"</div>
              </button>
            ))}
          </div>
        </div>

        {/* Form Inputs */}
        <div className="space-y-4">
          <div>
            <label htmlFor="target-role-linkedin" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Pekerjaan Impian (Peluang Target):
            </label>
            <input
              id="target-role-linkedin"
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="Contoh: Junior Mobile Dev, Content Writer..."
              className="w-full text-sm border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-hidden bg-slate-50/50 px-4 py-2.5 rounded-xl transition"
            />
          </div>

          <div>
            <label htmlFor="headline-input" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Headline LinkedIn Saat Ini:
            </label>
            <input
              id="headline-input"
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="Contoh: Student at Universitas Indonesia, looking for opportunities..."
              className="w-full text-xs font-semibold border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-hidden bg-slate-50/50 px-4 py-2.5 rounded-xl transition"
            />
          </div>

          <div>
            <label htmlFor="summary-textarea" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Summary (Tentang Saya / About Section) Saat Ini:
            </label>
            <textarea
              id="summary-textarea"
              rows={6}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Contoh: Saya adalah mahasiswa semester akhir yang ramah, sopan, rajin menabung, suka menulis bahasa javascript dan berniat magang di startup IT..."
              className="w-full text-xs border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-hidden bg-slate-50/50 p-4 rounded-xl resize-y"
            />
          </div>
        </div>

        {errorLocal && (
          <p className="text-xs text-red-600 mt-3 bg-red-50 border-2 border-red-300 p-2.5 rounded-xl">
            {errorLocal}
          </p>
        )}

        <button
          type="button"
          id="optimize-profile-btn"
          disabled={loading}
          onClick={triggerOptimization}
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-sm py-3 px-4 rounded-xl transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Merevisi Profil Personal Brand Anda...
            </>
          ) : (
            "Menulis Ulang Profil AI"
          )}
        </button>
      </div>

      {/* SEKTOR KANAN - COMPARE BOARD (Side-by-Side) */}
      <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-[0_10px_35px_-4px_rgba(30,41,59,0.07),0_4px_12px_-2px_rgba(30,41,59,0.04)] min-h-[440px] flex flex-col justify-between">
        {optimization ? (
          <div id="compare-board" className="space-y-6">
            <div className="border-b-2 border-slate-350 pb-4">
              <span className="text-[10px] font-bold bg-blue-50 text-blue-700 border-2 border-blue-300 px-2.5 py-1 rounded-full uppercase tracking-wider">
                Optimasi Strategis Profeisonal: {targetRole}
              </span>
              <h4 className="text-base font-bold text-slate-800 mt-2.5">Papan Perbandingan Sebelum & Sesudah</h4>
            </div>

            {/* COMPARE SECTION: HEADLINE */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                1. LinkedIn Headline (Maksimal 220 Karakter)
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* BEFORE */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1 mb-1.5">
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>Sebelum:
                  </div>
                  <p className="text-xs text-slate-500 italic">
                    {optimization.originalHeadline || "(kosong)"}
                  </p>
                </div>

                {/* AFTER */}
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-200 relative group">
                  <div className="text-[10px] text-blue-600 uppercase font-bold flex items-center gap-1 mb-1.5 justify-between">
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>Rekomendasi Sukses (SEO):
                    </div>
                    <button
                      type="button"
                      id="copy-headline-btn"
                      onClick={() => handleCopy(optimization.optimizedHeadline, "headline")}
                      className="text-slate-400 hover:text-blue-700 p-1 rounded-sm bg-white/80 border border-slate-300 hover:border-blue-400 transition"
                      title="Salin headline"
                    >
                      {copiedHeadline ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 leading-relaxed pr-8">
                    {optimization.optimizedHeadline}
                  </p>
                  {copiedHeadline && (
                    <span className="absolute right-4 bottom-2 text-[9px] bg-emerald-600 text-white px-2 py-0.5 rounded-sm animate-fade-in">
                      Tersalin!
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* COMPARE SECTION: SUMMARY */}
            <div className="space-y-3 pt-2">
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                2. LinkedIn Summary (Bagian "About")
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* BEFORE */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1 mb-1.5">
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>Sebelum:
                  </div>
                  <p className="text-xs text-slate-500 whitespace-pre-line leading-relaxed italic truncate-summary max-h-[140px] overflow-y-auto">
                    {optimization.originalSummary || "(kosong)"}
                  </p>
                </div>

                {/* AFTER */}
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-200 relative group">
                  <div className="text-[10px] text-blue-600 uppercase font-bold flex items-center gap-1 mb-1.5 justify-between">
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>Rekomendasi Sukses (SEO):
                    </div>
                    <button
                      type="button"
                      id="copy-summary-btn"
                      onClick={() => handleCopy(optimization.optimizedSummary, "summary")}
                      className="text-slate-400 hover:text-blue-700 p-1 rounded-sm bg-white/80 border border-slate-300 hover:border-blue-400 transition"
                      title="Salin summary"
                    >
                      {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed pr-8 max-h-[160px] overflow-y-auto scrollbar-thin">
                    {optimization.optimizedSummary}
                  </p>
                  {copiedSummary && (
                    <span className="absolute right-4 bottom-2 text-[9px] bg-emerald-600 text-white px-2 py-0.5 rounded-sm animate-fade-in">
                      Tersalin!
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* EXPLANATIONS OF KEYS CHANGES */}
            <div className="bg-emerald-50/20 border border-emerald-200 p-5 rounded-2xl space-y-3">
              <div className="text-xs font-semibold text-emerald-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Mengapa Hasil Teks Ini Lebih Unggul?
              </div>
              <ul className="space-y-3">
                {optimization.keyChanges.map((change, i) => (
                  <li key={i} className="text-xs text-slate-700 flex items-start gap-1.5 leading-relaxed bg-white/80 border border-slate-200 p-2.5 rounded-xl">
                    <span className="text-emerald-500 font-bold mt-0.5">•</span>
                    <span>{change}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* BRANDING TIPS */}
            <div className="bg-blue-50/20 border border-blue-200 p-5 rounded-2xl">
              <div className="text-xs font-semibold text-blue-950 flex items-center gap-1.5 mb-2.5">
                <Sliders className="w-4 h-4 text-blue-600 animate-spin-slow" />
                Saran Tambahan Mengisi Profil LinkedIn:
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600">
                {optimization.brandingTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-1.5 leading-relaxed">
                    <span className="text-blue-500 font-extrabold text-[12px]">{i+1}.</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="my-auto text-center py-12 px-6">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <Linkedin className="w-8 h-8 text-slate-300" />
            </div>
            <h4 className="font-bold text-slate-700 mb-1.5">Pengoptimalan Belum Dieksekusi</h4>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
              Silakan tulis atau salin isian draf digital LinkedIn Anda di sebelah kiri, pilih Peran Bidang Kerja impian Anda, dan ketuk tombol optimasi untuk memulai penulisan ulang berbasis kata kunci pencarian HR.
            </p>
          </div>
        )}

        <div className="border-t border-slate-100 pt-4 mt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <span>Studi SEO merujuk pada standar relevansi algoritma rekrutmen LinkedIn 2026.</span>
          <span>Versi Mesin SEO: v3.2</span>
        </div>
      </div>
    </div>
  );
}
