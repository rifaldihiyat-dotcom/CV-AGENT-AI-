import { useState } from "react";
import { Compass, ListTodo, GraduationCap, ChevronRight, CheckCircle2, RefreshCw, AlertCircle, ArrowUpRight, Mail } from "lucide-react";
import { RoadmapStep, SkillGapAnalysis } from "../types";

export default function SkillGapAnalyzer() {
  const [careerGoal, setCareerGoal] = useState("Product Manager");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<SkillGapAnalysis | null>(null);
  const [errorLocal, setErrorLocal] = useState<string | null>(null);
  const [activeStepId, setActiveStepId] = useState<string | null>("step-1");

  // Quick suggestions for students to click
  const quickCareerSuggestions = [
    "UI/UX Designer",
    "Data Scientist",
    "Digital Marketer",
    "Backend Engineer",
    "Product Manager"
  ];

  const triggerAnalysis = async (customGoal?: string) => {
    const goalToCheck = customGoal || careerGoal;
    if (!goalToCheck.trim()) {
      setErrorLocal("Aspirasi karier atau cita-cita tidak boleh kosong.");
      return;
    }

    setLoading(true);
    setAnalysis(null);
    setErrorLocal(null);

    try {
      const response = await fetch("/api/skill-gap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ careerGoal: goalToCheck })
      });
      if (!response.ok) throw new Error("Gagal memperoleh data roadmap.");
      const data = await response.json();
      setAnalysis(data);
      if (data.roadmap && data.roadmap.length > 0) {
        setActiveStepId(data.roadmap[0].id);
      }
    } catch (err: any) {
      setErrorLocal("Terjadi kendala saat menganalisis gap keterampilan. Silakan coba sesaat lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStepCheckbox = (stepId: string, milestoneIndex: number) => {
    if (!analysis) return;
    const updatedRoadmap = analysis.roadmap.map(step => {
      if (step.id === stepId) {
        const updatedMilestones = [...step.milestones];
        // Visual strike-through toggle Simulation
        if (updatedMilestones[milestoneIndex].startsWith("✅ ")) {
          updatedMilestones[milestoneIndex] = updatedMilestones[milestoneIndex].replace("✅ ", "");
        } else {
          updatedMilestones[milestoneIndex] = "✅ " + updatedMilestones[milestoneIndex];
        }
        return { ...step, milestones: updatedMilestones };
      }
      return step;
    });

    setAnalysis({
      ...analysis,
      roadmap: updatedRoadmap
    });
  };

  return (
    <div id="skill-gap-analyzer" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* SEKTOR KIRI - ASPIRATION FORM */}
      <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-[0_10px_35px_-4px_rgba(30,41,59,0.07),0_4px_12px_-2px_rgba(30,41,59,0.04)]">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-800">Gap Analyzer & Peta Jalan Karier</h3>
          <p className="text-xs text-slate-500 leading-relaxed mt-1">
            Metakan kesenjangan kemampuan Anda hari ini dengan kriteria kompetensi wajib yang dituntut oleh industri masa kini.
          </p>
        </div>

        {/* Career Input */}
        <div className="space-y-4">
          <div>
            <label htmlFor="goal-input" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Apa Cita-cita Karier Anda?
            </label>
            <div className="relative">
              <Compass className="absolute left-3.5 top-3.5 w-4 h-4 text-emerald-600" />
              <input
                id="goal-input"
                type="text"
                value={careerGoal}
                onChange={(e) => setCareerGoal(e.target.value)}
                placeholder="Misal: UI/UX Designer, HR Officer..."
                className="w-full text-sm border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 outline-hidden bg-slate-50/50 pl-10 pr-4 py-3 rounded-2xl transition"
              />
            </div>
          </div>

          {/* Quick Recommendations Selectors */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Rekomendasi Jabatan Populer:
            </label>
            <div className="flex flex-wrap gap-2">
              {quickCareerSuggestions.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  id={`career-tag-${tag.replace(" ", "-")}`}
                  onClick={() => {
                    setCareerGoal(tag);
                    triggerAnalysis(tag);
                  }}
                  className="text-xs bg-emerald-50/50 hover:bg-emerald-50 text-emerald-800 border-2 border-emerald-300 px-3 py-1.5 rounded-xl transition duration-150 flex items-center gap-1 cursor-pointer"
                >
                  <span>{tag}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {errorLocal && (
          <p className="text-xs text-red-600 mt-3 bg-red-50 border-2 border-red-300 p-2.5 rounded-xl">
            {errorLocal}
          </p>
        )}

        <button
          type="button"
          id="analyze-skills-btn"
          disabled={loading}
          onClick={() => triggerAnalysis()}
          className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold text-sm py-3 px-4 rounded-xl transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Menghitung Kesenjangan Keterampilan...
            </>
          ) : (
            "Analisis Roadmap Kompetensi"
          )}
        </button>
      </div>

      {/* SEKTOR KANAN - LEARNING ROADMAP TIMELINE */}
      <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-[0_10px_35px_-4px_rgba(30,41,59,0.07),0_4px_12px_-2px_rgba(30,41,59,0.04)] min-h-[420px] flex flex-col justify-between">
        {analysis ? (
          <div id="roadmap-container" className="space-y-6">
            <div className="border-b-2 border-slate-300 pb-4">
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border-2 border-emerald-300 px-2.5 py-1 rounded-full uppercase tracking-wider">
                Karir Arah: {analysis.careerGoal}
              </span>
              <h4 className="text-base font-bold text-slate-800 mt-2.5">Bagan Peta Jalan Penyelesaian Kompetensi</h4>
            </div>

            {/* Assessment Block */}
            <div className="bg-slate-50 border border-slate-200 px-4 py-3.5 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold text-slate-700">Analisa Hambatan Mahasiswa:</h5>
                <p className="text-xs text-slate-600 leading-relaxed mt-0.5">{analysis.currentSkillsAssessment}</p>
              </div>
            </div>

            {/* Essential Skills Badge List */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                5 Keahlian Kunci Harus Dikuasai:
              </label>
              <div className="flex flex-wrap gap-2">
                {analysis.essentialSkillsToLearn.map((sk, idx) => (
                  <span 
                    key={idx} 
                    className="text-xs font-semibold bg-blue-50 text-blue-800 border-2 border-blue-300 px-3 py-1 rounded-xl"
                  >
                    🚀 {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* INTERACTIVE TIMELINE SCROLLER */}
            <div className="space-y-4">
              <label className="block text-xs font-semibold text-slate-400 tracking-wider uppercase">
                Garis Waktu Studi Bertahap (Klik Untuk Memantau Milestones):
              </label>

              <div className="relative pl-6 border-l-[3px] border-slate-300 space-y-5">
                {analysis.roadmap.map((step, idx) => {
                  const isActive = activeStepId === step.id;
                  return (
                    <div 
                      key={step.id} 
                      id={`roadmap-step-${step.id}`}
                      className="relative group transition-all"
                    >
                      {/* Circle indicator on timeline */}
                      <span className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 transition-colors ${
                        isActive 
                          ? "bg-emerald-600 border-white ring-4 ring-emerald-100" 
                          : "bg-white border-slate-300 group-hover:border-slate-400"
                      }`} />

                      <div 
                        onClick={() => setActiveStepId(step.id)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                          isActive 
                            ? "border-emerald-400 bg-emerald-50/20 shadow-xs" 
                            : "border-slate-200 hover:border-slate-350 bg-slate-50/20"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2.5 mb-1.5">
                          <h5 className="text-xs font-bold text-slate-800 leading-snug">
                            No.{idx+1}: {step.title}
                          </h5>
                          <span className="text-[10px] bg-slate-100 text-slate-500 border border-slate-200 px-2 py-0.5 rounded-md shrink-0">
                            ⏱️ {step.duration}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          {step.description}
                        </p>

                        {/* Interactive Milestone targets within ACTIVE row */}
                        {isActive && (
                          <div id={`milestones-sub-${step.id}`} className="mt-4 pt-3 border-t-2 border-dashed border-slate-300 animate-slide-down">
                            <h6 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 mb-2">
                              <ListTodo className="w-3 h-3 text-blue-600" />
                              Target Taktis Tahap Ini (Klik Selesai):
                            </h6>
                            <div className="space-y-2">
                              {step.milestones.map((ms, mIdx) => {
                                const isChecked = ms.startsWith("✅ ");
                                return (
                                  <div 
                                    key={mIdx}
                                    onClick={(e) => {
                                      e.stopPropagation(); // prevent collapsing
                                      handleToggleStepCheckbox(step.id, mIdx);
                                    }}
                                    className="flex items-center gap-2.5 p-2 bg-white/80 border-2 border-slate-200 rounded-xl hover:bg-white transition-colors cursor-pointer text-left"
                                  >
                                    <div className={`w-4 h-4 rounded-md border-2 flex items-center justify-center shrink-0 ${
                                      isChecked ? "bg-emerald-600 border-emerald-600 text-white" : "border-slate-300 bg-slate-50"
                                    }`}>
                                      {isChecked && (
                                        <svg className="w-2.5 h-2.5 stroke-2 stroke-current" fill="none" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                      )}
                                    </div>
                                    <span className={`text-xs ${
                                      isChecked ? "line-through text-slate-400" : "text-slate-600"
                                    }`}>
                                      {ms.replace("✅ ", "")}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* VIRTUAL MAILROOM INTERACTION ZONE */}
            <div className="mt-8 border-t-2 border-slate-200 pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1 px-2.5 bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-black uppercase rounded-lg tracking-wider">
                    Virtual Mailroom
                  </div>
                  <span className="text-xs font-bold text-slate-800">Secure Notifications Gateway</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold uppercase">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span>SMTP Secure Tunnel</span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-md">
                {/* Simulated Mail Header */}
                <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 px-4 py-3 text-white border-b border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-rose-500 rounded-full"></div>
                    <div className="w-2.5 h-2.5 bg-amber-500 rounded-full"></div>
                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>
                    <span className="text-[10px] text-slate-400 font-mono ml-2 truncate">sandbox_secure@career.ai</span>
                  </div>
                  <span className="text-[10px] font-mono text-blue-400 bg-blue-900/40 px-2 py-0.5 rounded-md border border-blue-500/20">TLS/SSL v1.3</span>
                </div>

                <div className="p-4 bg-white space-y-3 font-sans">
                  {/* Subject and To */}
                  <div className="text-xs border-b border-slate-200 pb-2 space-y-1 text-slate-500">
                    <div><strong className="text-slate-700">From:</strong> system-notifications@career.ai</div>
                    <div><strong className="text-slate-700">To:</strong> user@career.ai</div>
                    <div><strong className="text-slate-700">Subject:</strong> Secure Update: Learning Milestone status for <span className="text-blue-600 font-bold">{careerGoal} Roadmap</span></div>
                  </div>

                  {/* Mail Body in dynamic template generation aligning with dark-blue palette */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden text-slate-800 max-w-lg mx-auto shadow-2xs">
                    {/* Header alignment with Dark Blue space slate gradient */}
                    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-4 text-white text-center border-b-2 border-blue-600">
                      <div className="inline-flex p-1.5 bg-white/10 rounded-full border border-white/20 mb-2">
                        <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <h4 className="text-xs font-black tracking-widest text-blue-300 uppercase">MILESTONE SECURE SYNC</h4>
                      <p className="text-[10px] text-slate-300 font-medium">Laporan Kemajuan Studi Mahasiswa</p>
                    </div>

                    <div className="p-4 space-y-3.5 bg-white text-xs">
                      <p className="leading-relaxed">
                        Halo <strong>rigguzan234@gmail.com</strong>,
                      </p>
                      <p className="leading-relaxed text-slate-600">
                        Kami mendeteksi perubahan status kesiapan belajar Anda untuk jalur profesi <strong className="text-blue-600">{careerGoal}</strong>. Data progres akademis Anda telah tersinkronisasi dan diamankan menggunakan enkripsi internal kami.
                      </p>

                      {/* Learning Progress Stats indicator */}
                      <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-3 flex justify-between items-center text-left">
                        <div>
                          <span className="block text-[9px] text-slate-400 uppercase font-black">Spesialisasi Target</span>
                          <span className="text-xs font-bold text-slate-800">{careerGoal}</span>
                        </div>
                        <div className="text-right">
                          <span className="block text-[9px] text-slate-400 uppercase font-black">Status Milestones</span>
                          <span className="text-xs font-bold text-blue-700 bg-blue-100/60 px-2.5 py-1 rounded-md border border-blue-200">
                            Sinkron!
                          </span>
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-400 leading-relaxed text-center italic border-t border-slate-150 pt-3">
                        Email ini dikirim oleh CareerAI otomatis. Jangan membalas email ini secara langsung. Keamanan data Anda terlindungi enkripsi TLS SHA-256 secara penuh.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {analysis.fallback && (
              <div className="text-center pt-2">
                <span className="text-[10px] bg-slate-100 text-slate-500 font-mono px-2 py-0.5 rounded-md">
                  * Berjalan dalam mode mockup cerdas (klik kustom tag untuk menghasilkan kurikulum baru langsung)
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="my-auto text-center py-12 px-6">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <GraduationCap className="w-8 h-8 text-slate-300" />
            </div>
            <h4 className="font-bold text-slate-700 mb-1.5">Roadmap Belum Ditentukan</h4>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
              Tulis peran impian Anda (misalnya Cloud Architect, HR Executive, dsb), lalu tekan Analisis untuk merintis silabus belajar mandiri yang sistematis.
            </p>
          </div>
        )}

        <div className="border-t border-slate-100 pt-4 mt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <span>Roadmap disesuaikan kurikulum standar industri EdTech Indonesia.</span>
          <span>Versi Mesin Roadmap: v2.1.0</span>
        </div>
      </div>
    </div>
  );
}
