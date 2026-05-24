import * as React from "react";
import { useState, useRef } from "react";
import { FileText, UploadCloud, CheckCircle, AlertTriangle, Lightbulb, RefreshCw, File } from "lucide-react";
import { CVAnalysis } from "../types";

export default function CVReviewer() {
  const [cvText, setCvText] = useState("");
  const [targetRole, setTargetRole] = useState("Frontend Developer");
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<CVAnalysis | null>(null);
  const [errorLocal, setErrorLocal] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // High-quality Indonesian CV templates for quick start
  const templates = [
    {
      label: "CV Mahasiswa (IT/Web)",
      role: "Frontend Developer",
      text: `BUDI SANTOSO
Budi.Santoso@email.com | +628123456789 | Jakarta, Indonesia | linkedin.com/in/budisantoso

Pendidikan:
Universitas Indonesia - S1 Teknik Informatika (IPK 3.65 / 4.00) - Angkatan 2022 s.d Sekarang

Keahlian:
Bahasa Pemrograman: HTML, CSS, JavaScript dasar, Java
Framework/Perpustakaan: Belajar React.js dasar, Bootstrap
Lain-lain: Berkomunikasi baik, kerja sama tim, desain Canva

Pengalaman Organisasi:
• Anggota Divisi Humas Himpunan Mahasiswa Informatika (2023)
- Bertanggung jawab memposting informasi penting mahasiswa melalui kanal sosial media.
• Panitia Desain Event Kampus (2024)
- Membuat poster visual kreatif menggunakan software Canva.`
    },
    {
      label: "CV Mahasiswa (Pemasaran & Bisnis)",
      role: "Digital Marketing Specialist",
      text: `SITI AMINAH
Siti.Aminah@email.com | Bandung | linkedin.com/in/sitiaminah

Saya mahasiswa semester akhir Ilmu Komunikasi yang tertarik di dunia komersial pemasaran digital. Terbiasa menulis caption Instagram dan sangat menyukai media sosial.

Pendidikan:
Universitas Padjadjaran - S1 Ilmu Komunikasi (2022 - Sekarang)

Kemampuan:
• Copywriting kreatif, Fotografi hp, Mengoperasikan TikTok & Instagram, Public Speaking

Riwayat Aktivitas:
• Magang Admin Pemasaran - Toko Kue Bandung (1 Bulan, 2023)
- Melayani chat pelanggan melalui platform WhatsApp.
- Membantu packing pesanan jika sedang ramai penjualan.
• Ketua Divisi Dekorasi Akrab Angkatan (2023)
- Membeli pernak pernik hiasan ballroom sesuai anggaran panitia.`
    }
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setErrorLocal(null);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorLocal(null);
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    setFileName(file.name);
    // Simple reader
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setCvText(text);
      } else {
        // Fallback or preview parsing
        setCvText(`[Konten Dibaca Dari File: ${file.name}]\n\nResume Mahasiswa Pelamar Kerja.\nPosisi Target: ${targetRole}\nLengkapi dengan menulis detail akademis di sini agar analisis AI berjalan maksimal...`);
      }
    };
    reader.readAsText(file.slice(0, 10000)); // Read first 10kb
  };

  const triggerAnalysis = async () => {
    if (!cvText.trim()) {
      setErrorLocal("Silakan isi teks CV Anda terlebih dahulu atau unggah file.");
      return;
    }
    setLoading(true);
    setAnalysis(null);
    setErrorLocal(null);

    try {
      const response = await fetch("/api/cv-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText, targetRole })
      });
      if (!response.ok) {
        throw new Error("Respon server bermasalah");
      }
      const data = await response.json();
      setAnalysis(data);
    } catch (err: any) {
      setErrorLocal("Gagal menganalisis CV. Pastikan server aktif.");
    } finally {
      setLoading(false);
    }
  };

  const loadTemplate = (template: typeof templates[0]) => {
    setCvText(template.text);
    setTargetRole(template.role);
    setFileName(`Templat_${template.role.replace(" ", "_")}.txt`);
    setErrorLocal(null);
  };

  return (
    <div id="cv-reviewer" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* KIRI - INPUT & EDIT ZONE */}
      <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-[0_10px_35px_-4px_rgba(30,41,59,0.07),0_4px_12px_-2px_rgba(30,41,59,0.04)]">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-800">Reviewer CV & Analisis ATS</h3>
          <p className="text-xs text-slate-500 leading-relaxed mt-1">
            Unggah resume atau pakai draf teks CV Anda untuk mengecek seberapa siap CV diproses sistem verifikasi otomatis industri.
          </p>
        </div>

        {/* Quickstart Templates */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Isi Cepat Dengan Templat Mahasiswa:
          </label>
          <div className="flex flex-wrap gap-2">
            {templates.map((tmpl, idx) => (
              <button
                key={idx}
                type="button"
                id={`template-btn-${idx}`}
                onClick={() => loadTemplate(tmpl)}
                className="text-xs bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-800 border border-slate-350 px-3 py-1.5 rounded-xl transition-all-300"
              >
                {tmpl.label}
              </button>
            ))}
          </div>
        </div>

        {/* File Drag Drop Zone */}
        <div
          id="dropzone"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 ${
            isDragging 
              ? "border-emerald-500 bg-emerald-50/40" 
              : "border-slate-350 hover:border-sky-400 hover:bg-sky-50/10"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            id="file-input"
            accept=".txt,.pdf,.docx"
            className="hidden"
            onChange={handleFileSelect}
          />
          <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2 animate-bounce-slow" />
          <p className="text-sm font-semibold text-slate-700">Tarik & Letakkan file CV di sini</p>
          <p className="text-xs text-slate-400 mt-1">Mendukung PDF, Word, atau teks murni (.txt)</p>
          
          {fileName && (
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 border border-sky-100/50 rounded-lg text-xs font-medium text-sky-800">
              <File className="w-3.5 h-3.5" />
              <span>{fileName}</span>
            </div>
          )}
        </div>

        {/* Target role input */}
        <div className="mt-4">
          <label htmlFor="target-role" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Pekerjaan Target (Role)
          </label>
          <input
            id="target-role"
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="Contoh: Frontend Developer, Social Media Intern..."
            className="w-full text-sm border border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-200 outline-hidden bg-slate-50/50 px-4 py-2.5 rounded-xl transition duration-150"
          />
        </div>

        {/* Text Area */}
        <div className="mt-4">
          <label htmlFor="cv text" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Salinan Teks Resume / CV
          </label>
          <textarea
            id="cv-text"
            rows={10}
            value={cvText}
            onChange={(e) => setCvText(e.target.value)}
            placeholder="Tempel atau ketik teks CV Anda di sini secara lengkap (Pendidikan, Pengalaman Kerja/Organisasi, Skill, Proyek)..."
            className="w-full text-xs font-mono border border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-200 outline-hidden bg-slate-50/30 p-4 rounded-xl leading-relaxed resize-y"
          />
        </div>

        {errorLocal && (
          <p className="text-xs text-red-600 mt-2 bg-red-50 border border-red-200 p-2.5 rounded-lg">
            {errorLocal}
          </p>
        )}

        <button
          type="button"
          id="analyze-cv-btn"
          disabled={loading}
          onClick={triggerAnalysis}
          className="w-full mt-4 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold text-sm py-3 px-4 rounded-xl transition-all shadow-xs cursor-pointer"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Menganalisis Kualitas CV Anda...
            </>
          ) : (
            "Mulai Analisis Resume AI"
          )}
        </button>
      </div>

      {/* KANAN - REPORT OUTPUT */}
      <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-[0_10px_35px_-4px_rgba(30,41,59,0.07),0_4px_12px_-2px_rgba(30,41,59,0.04)] min-h-[400px] flex flex-col justify-between">
        {analysis ? (
          <div id="analysis-report" className="space-y-6">
            {/* Header Report Card */}
            <div className="flex flex-col sm:flex-row items-center justify-between border-b-2 border-slate-300 pb-5 gap-4">
              <div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-full">
                  Target: {targetRole}
                </span>
                <h4 className="text-lg font-bold text-slate-800 mt-2">Draf Laporan Kesiapan CV</h4>
              </div>

              {/* ATS SCORE CIRLCE */}
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center">
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="#f1f5f9"
                      strokeWidth="6"
                      fill="transparent"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke={analysis.atsScore >= 75 ? "#059669" : analysis.atsScore >= 60 ? "#d97706" : "#dc2626"}
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 28}
                      strokeDashoffset={2 * Math.PI * 28 * (1 - analysis.atsScore / 100)}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <span className="absolute text-sm font-extrabold text-slate-800">{analysis.atsScore}%</span>
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-semibold uppercase">ATS Score</div>
                  <div className={`text-sm font-bold ${analysis.atsScore >= 75 ? "text-emerald-700" : "text-amber-700"}`}>
                    {analysis.roleFitRating}
                  </div>
                </div>
              </div>
            </div>

            {/* Content Lists */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* STRENGTHS */}
              <div className="bg-emerald-50/30 border border-emerald-200 p-4 rounded-2xl">
                <div className="flex items-center gap-2 mb-3 text-emerald-800 font-semibold text-sm">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Keunggulan CV Anda
                </div>
                <ul className="space-y-2.5">
                  {analysis.strengths.map((str, i) => (
                    <li key={i} className="text-xs leading-relaxed text-slate-700 flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold mt-0.5">•</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* WEAKNESSES */}
              <div className="bg-red-50/20 border border-red-100 p-4 rounded-2xl">
                <div className="flex items-center gap-2 mb-3 text-red-800 font-semibold text-sm">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  Kelemahan & Blunder ATS
                </div>
                <ul className="space-y-2.5">
                  {analysis.weaknesses.map((weak, i) => (
                    <li key={i} className="text-xs leading-relaxed text-slate-700 flex items-start gap-1.5">
                      <span className="text-red-400 font-bold mt-0.5">•</span>
                      <span>{weak}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ACTIONABLE IMPROVEMENTS */}
            <div className="bg-sky-50/30 border border-sky-200 p-5 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-sky-800 font-semibold text-sm">
                <Lightbulb className="w-4.5 h-4.5 text-sky-600 animate-pulse" />
                Saran Perbaikan / Improvement AI
              </div>
              <ul className="space-y-3">
                {analysis.improvements.map((imp, i) => (
                  <li key={i} className="text-xs leading-relaxed text-slate-700 bg-white/70 border-2 border-slate-200 p-2.5 rounded-xl">
                    <div className="font-semibold text-sky-900 mb-0.5">Rekomendasi #{i + 1}</div>
                    {imp}
                  </li>
                ))}
              </ul>
            </div>

            {/* LAYOUT ADVICE */}
            <div className="bg-slate-50 border border-slate-200/50 p-4 rounded-2xl">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-1">
                Saran Layout & Format File:
              </span>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "{analysis.formattingAdvice}"
              </p>
            </div>

            {/* API Mode Tagging */}
            {analysis.fallback && (
              <div className="text-center">
                <span className="text-[10px] bg-slate-100 text-slate-500 font-mono px-2 py-0.5 rounded-md">
                  * Berjalan dalam mode mockup simulasi lokal (respon cepat, andal & hemat kuota)
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="my-auto text-center py-12 px-6">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <FileText className="w-8 h-8 text-slate-300" />
            </div>
            <h4 className="font-bold text-slate-700 mb-1.5">Hasil Evaluasi Belum Tersedia</h4>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
              Silakan tulis draf CV Anda di kolom kiri, pilih Target Role pekerjaan, dan klik tombol untuk memperoleh laporan analitik instan dari asisten AI.
            </p>
          </div>
        )}

        <div className="border-t border-slate-100 pt-4 mt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <span>Formula review berbasis modul pengenalan kata kunci perekrutan.</span>
          <span>Versi Mesin Parser: v1.4.2-Indo</span>
        </div>
      </div>
    </div>
  );
}
