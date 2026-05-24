/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { 
  FileText, 
  MessageSquare, 
  GraduationCap, 
  Linkedin, 
  BookOpen, 
  Sparkles, 
  ExternalLink,
  Crown,
  LayoutDashboard,
  CheckCircle2,
  Lock,
  X
} from "lucide-react";

// Import modular child components
import StatusBanner from "./components/StatusBanner";
import CVReviewer from "./components/CVReviewer";
import CVGenerator from "./components/CVGenerator";
import InterviewSimulator from "./components/InterviewSimulator";
import SkillGapAnalyzer from "./components/SkillGapAnalyzer";
import LinkedInOptimizer from "./components/LinkedInOptimizer";
import ProjectExplorer from "./components/ProjectExplorer";

type ActiveTab = "cv" | "cv-generator" | "interview" | "skills" | "linkedin" | "doc";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("cv");
  const [isWelcomeCollapsed, setIsWelcomeCollapsed] = useState(false);

  const tabItems = [
    { id: "cv" as const, label: "CV Reviewer", icon: FileText, desc: "Evaluasi instan & ATS Checker", color: "text-emerald-700 bg-emerald-50 border-emerald-300", hoverColor: "hover:bg-emerald-50/40" },
    { id: "cv-generator" as const, label: "CV Generator", icon: Sparkles, desc: "Pembuat CV otomatis terpolos AI", color: "text-rose-700 bg-rose-50 border-rose-350", hoverColor: "hover:bg-rose-50/40" },
    { id: "interview" as const, label: "Interview Simulator", icon: MessageSquare, desc: "Latihan percakapan dengan HRD", color: "text-sky-700 bg-sky-50 border-sky-300", hoverColor: "hover:bg-sky-50/40" },
    { id: "skills" as const, label: "Skill Gap Analyzer", icon: GraduationCap, desc: "Rintis peta belajar industri", color: "text-blue-700 bg-blue-50 border-blue-300", hoverColor: "hover:bg-blue-50/50" },
    { id: "linkedin" as const, label: "LinkedIn Optimizer", icon: Linkedin, desc: "SEO Headline & Ringkasan profil", color: "text-blue-700 bg-blue-50 border-blue-300", hoverColor: "hover:bg-blue-50/50" },
    { id: "doc" as const, label: "Panduan & Struktur", icon: BookOpen, desc: "Struktur berkas & integrasi", color: "text-slate-700 bg-slate-100 border-slate-350", hoverColor: "hover:bg-slate-100/50" }
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "cv":
        return <CVReviewer />;
      case "cv-generator":
        return <CVGenerator />;
      case "interview":
        return <InterviewSimulator />;
      case "skills":
        return <SkillGapAnalyzer />;
      case "linkedin":
        return <LinkedInOptimizer />;
      case "doc":
        return <ProjectExplorer />;
      default:
        return <CVReviewer />;
    }
  };

  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden bg-slate-50 flex flex-col md:flex-row font-sans text-slate-800 antialiased">
      
      {/* LEFT SIDEBAR NAVIGATION Panel - Desktop only (Premium Obsidian Slate Design) */}
      <aside className="w-68 bg-slate-900 border-r border-slate-800 flex flex-col p-5 shrink-0 hidden md:flex h-full sticky top-0 justify-between shadow-2xl overflow-y-auto w-72">
        <div className="space-y-7">
          {/* Logo Brand Header */}
          <div className="flex items-center gap-3 py-1">
            <div className="w-9 h-9 bg-blue-500/15 border border-blue-500/35 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
            </div>
            <div>
              <span className="font-extrabold text-white tracking-tight text-md">CareerAI</span>
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Career Companion</span>
            </div>
          </div>

          {/* Sidebar Links Description */}
          <div className="space-y-1.5">
            <span className="block text-[10px] font-bold text-slate-500 tracking-widest uppercase mb-2 px-1">Main Utilities</span>
            <nav className="space-y-1">
              {tabItems.map((tab) => {
                const IconComponent = tab.icon;
                const isSelected = activeTab === tab.id;
                
                // Coordinated dynamic styles matching Professional Polish Blue and colors
                let activeStyle = "bg-blue-600/20 text-blue-300 border-blue-500/40 border-2";
                if (tab.id === "cv") {
                  activeStyle = "bg-emerald-500/10 text-emerald-400 border-emerald-500/40 border-2";
                } else if (tab.id === "cv-generator") {
                  activeStyle = "bg-rose-500/10 text-rose-400 border-rose-500/40 border-2";
                }
                
                return (
                  <button
                    key={tab.id}
                    type="button"
                    id={`sidebar-nav-${tab.id}`}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all duration-150 cursor-pointer ${
                      isSelected 
                        ? `${activeStyle} font-bold shadow-xs` 
                        : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 border border-transparent"
                    }`}
                  >
                    <IconComponent className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold block">{tab.label}</span>
                      <span className="text-[9px] text-slate-400 block font-normal mt-0.5">{tab.desc}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Promo Upgrade Account Card */}
        <div className="bg-slate-950/60 border border-slate-850 rounded-2xl p-4 mt-6">
          <div className="flex items-center gap-1.5 text-blue-400 mb-1.5">
            <Crown className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="text-[10px] font-extrabold uppercase tracking-wide">Pro Member</span>
          </div>
          <p className="text-xs text-slate-100 font-bold leading-snug">Evaluasi & LLM Tanpa Batas</p>
          <p className="text-[10px] text-slate-400 mt-1 mb-3 leading-relaxed">Persiapan wawancara dan optimalisasi profil LinkedIn tak terbatas.</p>
          <button 
            type="button"
            className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold py-2 rounded-lg transition shadow-xs cursor-pointer flex items-center justify-center gap-1 border border-blue-500/20"
          >
            <span>Aktifkan Akun Pro</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </button>
        </div>
      </aside>

      {/* MOBILE RESPONSIVE NAV-BAR */}
      <header className="md:hidden bg-slate-900 border-b border-slate-800 px-4 py-3 flex flex-col gap-3 shrink-0 sticky top-0 z-50 text-slate-100">
        <div className="flex items-center justify-start gap-2 py-1">
          <div className="w-8 h-8 bg-blue-500/15 border border-blue-500/30 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4.5 h-4.5 text-blue-400" />
          </div>
          <span className="font-extrabold text-white text-sm tracking-tight">AI Career Assistant</span>
        </div>

        {/* Interactive Horizontal Scroll Nav on Mobile */}
        <nav className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {tabItems.map((tab) => {
            const IconComponent = tab.icon;
            const isSelected = activeTab === tab.id;
            
            let activeStyle = "bg-blue-600/20 text-blue-300 border-blue-500/40 border-2";
            if (tab.id === "cv") {
              activeStyle = "bg-emerald-500/10 text-emerald-400 border-emerald-500/40 border-2";
            } else if (tab.id === "cv-generator") {
              activeStyle = "bg-rose-500/10 text-rose-400 border-rose-500/40 border-2";
            }
            
            return (
              <button
                key={tab.id}
                type="button"
                id={`mobile-nav-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-3 rounded-lg text-[11px] font-bold transition shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  isSelected 
                    ? activeStyle 
                    : "bg-slate-950/40 text-slate-400 border border-slate-850/80"
                }`}
              >
                <IconComponent className="w-3.5 h-3.5" />
                <span>{tab.label.split(" ")[0]}</span> {/* Show only first word */}
              </button>
            );
          })}
        </nav>
      </header>

      {/* MAIN WORKSPACE BODY */}
      <main className="flex-1 flex flex-col min-h-screen md:min-h-0 md:h-full overflow-y-auto">
        
        {/* TOP STATUS HEADER WITH AVATAR */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 md:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 md:sticky md:top-0 z-40">
          <div>
            <h2 className="text-md font-bold text-slate-800 flex items-center gap-1.5">
              <span>Dasbor Karier</span>
              <span className="text-xs font-normal text-slate-400">/</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${
                activeTab === "cv" 
                  ? "text-emerald-700 bg-emerald-50 border-emerald-300" 
                  : activeTab === "cv-generator" 
                  ? "text-rose-700 bg-rose-50 border-rose-300" 
                  : "text-blue-700 bg-blue-50 border-blue-300"
              }`}>
                {tabItems.find(t => t.id === activeTab)?.label}
              </span>
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Kelola CV, asah cara menjawab wawancara, dan visualisasikan learning path Anda secara real-time.
            </p>
          </div>
        </div>

        {/* CONTAINER CONTENT AREA */}
        <div className="p-6 md:p-8 space-y-6 flex-1 max-w-7xl w-full mx-auto">
          
          {/* DYNAMIC COLLAPSIBLE WELCOME CARD */}
          {!isWelcomeCollapsed ? (
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 border border-slate-700/65 p-6 md:p-8 rounded-2xl text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 animate-slide-down">
              <div className="relative z-10 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2.5 py-0.5 rounded-full tracking-wider animate-pulse">
                    Dasbor Karir Hub
                  </span>
                  <span className="text-slate-500 text-xs">•</span>
                  <span className="text-slate-300 text-xs font-semibold">Tahun Akademik 2025/2026</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-none text-slate-100">
                  Selamat Datang di <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">CareerAI</span>! 👋
                </h1>
                <p className="text-slate-300 text-xs max-w-xl leading-relaxed">
                  Asisten kecerdasan buatan Anda siap memindai draf CV, menyimulasikan sesi wawancara STAR interaktif, serta melacak kesenjangan keahlian industri secara real-time.
                </p>
              </div>
              
              <div className="flex items-center gap-4 relative z-10 shrink-0 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4 w-full md:w-auto">
                <div className="text-left font-sans space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Kesiapan Karir</div>
                  <div className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>100% Aman & Terkoneksi</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-semibold uppercase">API Gateway Secure</div>
                </div>
              </div>

              {/* Close / Collapse button */}
              <button
                type="button"
                onClick={() => setIsWelcomeCollapsed(true)}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition duration-150 cursor-pointer z-20 border border-white/10"
                title="Sembunyikan Sambutan"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Subtle tech grid outline / vector blur elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full filter blur-3xl opacity-40 -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-emerald-500/5 rounded-full filter blur-3xl opacity-25 -mb-20"></div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 px-5 py-3 rounded-xl text-slate-300 shadow-md flex items-center justify-between gap-4 animate-slide-down">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
                <span className="text-xs text-slate-300 font-bold">
                  Sesi aktif • Mode Kerja Maksimal
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsWelcomeCollapsed(false)}
                className="text-[10px] font-bold text-blue-400 hover:text-blue-300 transition underline cursor-pointer"
              >
                Tampilkan Sambutan Lengkap
              </button>
            </div>
          )}

          {/* Real-time Connection API Banner */}
          <StatusBanner />

          {/* Active Feature Slot with staggered transitions */}
          <div className="transition-all duration-300">
            {renderActiveComponent()}
          </div>
        </div>

        {/* COMPACT FOOTER */}
        <footer className="bg-white border-t border-slate-200 text-center py-4 flex flex-col sm:flex-row items-center justify-between px-6 md:px-8 text-[11px] text-slate-400 gap-3 mt-auto shrink-0 animate-fade-in">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            <span>CareerAI High Density Theme — Rancang Solusi Karier Mahasiswa Masa Depan</span>
          </div>
          <div className="flex items-center gap-3">
            <a 
              href="https://ai.studio/build" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-slate-600 transition flex items-center gap-0.5 underline decoration-slate-200"
            >
              <span>AI Studio Build</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
            <span>•</span>
            <span>Vite + Express Stack</span>
          </div>
        </footer>

      </main>

    </div>
  );
}
