/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef } from "react";
import { 
  FileText, 
  Sparkles, 
  Plus, 
  Trash2, 
  Printer, 
  Clipboard, 
  Check, 
  Loader2, 
  User, 
  MapPin, 
  Mail, 
  Phone, 
  Link2,
  GraduationCap, 
  Briefcase, 
  FolderGit, 
  Award,
  BookOpen,
  ArrowRight
} from "lucide-react";

// Types for CV Data Model
interface EducationEntry {
  school: string;
  degree: string;
  major: string;
  period: string;
  gpa: string;
}

interface ExperienceEntry {
  company: string;
  role: string;
  period: string;
  description: string;
}

interface ProjectEntry {
  title: string;
  role: string;
  techStack: string;
  description: string;
}

interface CVData {
  fullName: string;
  professionalTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  summary: string;
  educations: EducationEntry[];
  experiences: ExperienceEntry[];
  projects: ProjectEntry[];
  skills: string[];
}

// Initial Template states
const INITIAL_CV_DATA: CVData = {
  fullName: "Rian Aditya Pramana",
  professionalTitle: "Frontend Web Developer Engineer",
  email: "rian.aditya@student.id",
  phone: "+62 812-3456-7890",
  location: "Jakarta, Indonesia",
  linkedin: "linkedin.com/in/rianaditya",
  website: "rianaditya.dev",
  summary: "Mahasiswa Informatika semester akhir yang berfokus pada pengembangan aplikasi web interaktif berpembawaan responsif. Memiliki pemahaman kuat terhadap pemrograman modern (TypeScript, React) serta berpengalaman membangun antarmuka web yang dioptimasi untuk performa tinggi.",
  educations: [
    {
      school: "Universitas Indonesia",
      degree: "S1",
      major: "Teknik Informatika",
      period: "2022 - Sekarang",
      gpa: "3.82 / 4.00"
    }
  ],
  experiences: [
    {
      company: "PT Solusi Teknologi Indonesia",
      role: "Frontend Developer Intern",
      period: "Februari 2025 - April 2025",
      description: "Mengerjakan slicing desain UI/UX Figma menjadi kode React siap pakai. Memperbaiki bug fungsional di dasbor pengguna dan berkontribusi meningkatkan skor Lighthouse performa web sebesar 12%."
    }
  ],
  projects: [
    {
      title: "Portfolio Web & Dashboard Mahasiswa",
      role: "Lead Developer",
      techStack: "React.js, Tailwind CSS, Local Storage",
      description: "Membangun portal belajar mandiri mahasiswa dengan visualisasi statistik capaian SKS menggunakan Chart, mendukung penyesuaian tema, serta mode cetak otomatis."
    }
  ],
  skills: ["React.js", "TypeScript", "Tailwind CSS", "Git & GitHub", "API Integration", "UI/UX Figma", "Problem Solving", "Team Collaboration"]
};

const TEMPLATE_PRESETS = [
  {
    name: "Mahasiswa IT / Dev",
    goal: "Frontend Developer",
    data: INITIAL_CV_DATA
  },
  {
    name: "Mahasiswa Ekonomi / Marketing",
    goal: "Digital Marketing Specialist",
    data: {
      fullName: "Amalia Putri Lestari",
      professionalTitle: "Social Media Strategist & Analyst",
      email: "amalia.putri@email.com",
      phone: "+62 856-9876-5432",
      location: "Bandung, Indonesia",
      linkedin: "linkedin.com/in/amaliaputri",
      website: "amaliashares.medium.com",
      summary: "Mahasiswa Manajemen Bisnis kreatif dengan minat mendalam pada strategi konten digital dan optimasi SEO. Berpengalaman mengelola media sosial organisasi kampus, melesatkan jangkauan organik akun hingga 140% dalam satu semester melalui penelitian tren yang taktis.",
      educations: [
        {
          school: "Universitas Padjadjaran",
          degree: "S1",
          major: "Manajemen Bisnis",
          period: "2022 - Sekarang",
          gpa: "3.75 / 4.00"
        }
      ],
      experiences: [
        {
          company: "GlowUp Ecommerce Startup",
          role: "Content Marketing Intern",
          period: "Maret 2025 - Mei 2025",
          description: "Meriset topik viral mingguan dan memproduksi 12 draf video TikTok pendek yang mendatangkan total 80k+ views organik. Memetakan metrik performa conversion rate dari bio tautan."
        }
      ],
      projects: [
        {
          title: "Kampanye Go-Viral Kampus",
          role: "Marketing Strategist",
          techStack: "TikTok Creator Suite, Canva, Google Analytics",
          description: "Memimpin strategi promosi festival musik kampus, menghasilkan penjualan 1.500 tiket habis dalam kurun waktu 48 jam dengan memanfaatkan video pendek mikro-influencer lokal."
        }
      ],
      skills: ["Social Media Marketing", "Copywriting", "SEO Optimization", "Canva Pro", "Google Analytics", "Content Strategy", "Public Speaking", "Creative Idea Generation"]
    }
  }
];

export default function CVGenerator() {
  const [cvData, setCvData] = useState<CVData>(INITIAL_CV_DATA);
  const [activePresetIndex, setActivePresetIndex] = useState<number>(0);
  const [selectedTheme, setSelectedTheme] = useState<"ats-classic" | "modern-emerald" | "executive-navy">("ats-classic");
  const [polishingSection, setPolishingSection] = useState<{type: string, index?: number} | null>(null);
  const [polishExplanation, setPolishExplanation] = useState<string[]>([]);
  const [copiedText, setCopiedText] = useState(false);
  
  // Ref for print area matching
  const printRef = useRef<HTMLDivElement>(null);

  // Form handler helpers
  const handlePersonalInfoChange = (field: keyof CVData, value: string) => {
    setCvData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEducationChange = (index: number, field: keyof EducationEntry, value: string) => {
    const updatedEd = [...cvData.educations];
    updatedEd[index] = {
      ...updatedEd[index],
      [field]: value
    };
    setCvData(prev => ({
      ...prev,
      educations: updatedEd
    }));
  };

  const addEducation = () => {
    setCvData(prev => ({
      ...prev,
      educations: [...prev.educations, { school: "", degree: "", major: "", period: "", gpa: "" }]
    }));
  };

  const removeEducation = (index: number) => {
    if (cvData.educations.length <= 1) return;
    setCvData(prev => ({
      ...prev,
      educations: prev.educations.filter((_, i) => i !== index)
    }));
  };

  const handleExperienceChange = (index: number, field: keyof ExperienceEntry, value: string) => {
    const updatedExp = [...cvData.experiences];
    updatedExp[index] = {
      ...updatedExp[index],
      [field]: value
    };
    setCvData(prev => ({
      ...prev,
      experiences: updatedExp
    }));
  };

  const addExperience = () => {
    setCvData(prev => ({
      ...prev,
      experiences: [...prev.experiences, { company: "", role: "", period: "", description: "" }]
    }));
  };

  const removeExperience = (index: number) => {
    if (cvData.experiences.length <= 1) return;
    setCvData(prev => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index)
    }));
  };

  const handleProjectChange = (index: number, field: keyof ProjectEntry, value: string) => {
    const updatedProj = [...cvData.projects];
    updatedProj[index] = {
      ...updatedProj[index],
      [field]: value
    };
    setCvData(prev => ({
      ...prev,
      projects: updatedProj
    }));
  };

  const addProject = () => {
    setCvData(prev => ({
      ...prev,
      projects: [...prev.projects, { title: "", role: "", techStack: "", description: "" }]
    }));
  };

  const removeProject = (index: number) => {
    if (cvData.projects.length <= 1) return;
    setCvData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  const handleSkillsChange = (skillsText: string) => {
    const skillsArray = skillsText.split(",").map(s => s.trim()).filter(s => s !== "");
    setCvData(prev => ({
      ...prev,
      skills: skillsArray
    }));
  };

  // Preset loader
  const loadPreset = (index: number) => {
    setActivePresetIndex(index);
    setCvData(TEMPLATE_PRESETS[index].data);
  };

  // AI Polish Integration
  const triggerAIPolish = async (type: "summary" | "experience" | "project", index?: number) => {
    let rawText = "";
    if (type === "summary") {
      rawText = cvData.summary;
    } else if (type === "experience" && typeof index === "number") {
      rawText = cvData.experiences[index].description;
    } else if (type === "project" && typeof index === "number") {
      rawText = cvData.projects[index].description;
    }

    if (!rawText.trim()) return;

    setPolishingSection({ type, index });
    setPolishExplanation([]);

    try {
      const response = await fetch("/api/cv-polish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawText,
          sectionType: type,
          roleContext: cvData.professionalTitle
        })
      });

      if (!response.ok) {
        throw new Error("Gagal memanggil endpoint pemoles kata sandi.");
      }

      const resJson = await response.json();
      
      if (type === "summary") {
        setCvData(prev => ({ ...prev, summary: resJson.polishedText }));
      } else if (type === "experience" && typeof index === "number") {
        const updated = [...cvData.experiences];
        updated[index].description = resJson.polishedText;
        setCvData(prev => ({ ...prev, experiences: updated }));
      } else if (type === "project" && typeof index === "number") {
        const updated = [...cvData.projects];
        updated[index].description = resJson.polishedText;
        setCvData(prev => ({ ...prev, projects: updated }));
      }

      setPolishExplanation(resJson.explanation || ["Teks draf berhasil ditingkatkan."]);
    } catch (err) {
      console.error(err);
      // Soft user feedback alert
    } finally {
      setPolishingSection(null);
    }
  };

  // Direct Browser Printing (PDF triggers nicely automatically)
  const handlePrint = () => {
    window.print();
  };

  // Dynamic plain copy for ATS pasting
  const copyCleanText = () => {
    const textBuilder = `
=========================================
${cvData.fullName.toUpperCase()}
${cvData.professionalTitle}
-----------------------------------------
📍 ${cvData.location} | 📧 ${cvData.email} | 📞 ${cvData.phone}
🔗 LinkedIn: ${cvData.linkedin} | 🌐 Website: ${cvData.website}

RINGKASAN REPUTASI MANDIRI
${cvData.summary}

RIWAYAT PENDIDIKAN
${cvData.educations.map(ed => `- ${ed.degree} ${ed.major}, ${ed.school} (${ed.period}) - IPK: ${ed.gpa}`).join("\n")}

PENGALAMAN KERJA & MAGANG
${cvData.experiences.map(exp => `- ${exp.role} di ${exp.company} (${exp.period})\n  ${exp.description}`).join("\n\n")}

PROYEK & ORGANISASI MANDIRI
${cvData.projects.map(p => `- ${p.title} (${p.role})\n  Teknologi: ${p.techStack}\n  ${p.description}`).join("\n\n")}

KOMPETENSI / HARD & SOFT SKILLS
${cvData.skills.join(", ")}
=========================================
    `;
    
    navigator.clipboard.writeText(textBuilder.trim());
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div id="cv-generator-container" className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
      
      {/* SEKTOR KIRI: FORM ENTRIES */}
      <div className="xl:col-span-6 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-[0_10px_35px_-4px_rgba(30,41,59,0.07),0_4px_12px_-2px_rgba(30,41,59,0.04)] space-y-7 max-h-[calc(100vh-180px)] overflow-y-auto pr-3 print:hidden">
        
        {/* Header Title Section */}
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Baru: CV Generator Builder
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-800">Pembuat Dokumen CV Otomatis</h3>
          <p className="text-xs text-slate-500 leading-relaxed mt-1">
            Isi formulir ringkas di bawah ini untuk merakit lembaran CV bertenaga akademis satu halaman secara real-time. Manfaatkan kecerdasan AI untuk memoles kalimat kerja pasif draf Anda.
          </p>
        </div>

        {/* PRESENTS SELECTION CHIPS */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Gunakan Draf Kerangka Cepat (Klik untuk Mengisi):
          </label>
          <div className="flex flex-wrap gap-2">
            {TEMPLATE_PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => loadPreset(idx)}
                className={`text-xs px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                  activePresetIndex === idx 
                    ? "bg-slate-800 text-white border-slate-800 font-bold" 
                    : "bg-white text-slate-600 hover:text-slate-800 border-slate-300"
                }`}
              >
                🎓 {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion 1: Personal Info */}
        <div className="border border-slate-200 shadow-sm rounded-xl overflow-hidden p-4 space-y-4">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2 flex items-center gap-1.5">
            <User className="w-4 h-4 text-emerald-600" />
            1. Informasi Kontak Diri
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Nama Lengkap</label>
              <input
                type="text"
                value={cvData.fullName}
                onChange={(e) => handlePersonalInfoChange("fullName", e.target.value)}
                className="w-full text-xs border border-slate-300 p-2.5 rounded-lg focus:border-slate-800 outline-none bg-white transition"
                placeholder="Rian Aditya"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Gelar Profesional / Target Jabatan</label>
              <input
                type="text"
                value={cvData.professionalTitle}
                onChange={(e) => handlePersonalInfoChange("professionalTitle", e.target.value)}
                className="w-full text-xs border border-slate-300 p-2.5 rounded-lg focus:border-slate-800 outline-none bg-white transition"
                placeholder="Frontend Web Developer"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Email</label>
              <input
                type="text"
                value={cvData.email}
                onChange={(e) => handlePersonalInfoChange("email", e.target.value)}
                className="w-full text-xs border border-slate-300 p-2.5 rounded-lg focus:border-slate-800 outline-none bg-white transition"
                placeholder="rian@mail.com"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Nomor Telepon</label>
              <input
                type="text"
                value={cvData.phone}
                onChange={(e) => handlePersonalInfoChange("phone", e.target.value)}
                className="w-full text-xs border border-slate-300 p-2.5 rounded-lg focus:border-slate-800 outline-none bg-white transition"
                placeholder="+62 812..."
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Lokasi Domisili</label>
              <input
                type="text"
                value={cvData.location}
                onChange={(e) => handlePersonalInfoChange("location", e.target.value)}
                className="w-full text-xs border border-slate-300 p-2.5 rounded-lg focus:border-slate-800 outline-none bg-white transition"
                placeholder="Jakarta, Indonesia"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Tautan LinkedIn</label>
              <input
                type="text"
                value={cvData.linkedin}
                onChange={(e) => handlePersonalInfoChange("linkedin", e.target.value)}
                className="w-full text-xs border border-slate-300 p-2.5 rounded-lg focus:border-slate-800 outline-none bg-white transition"
                placeholder="linkedin.com/in/rian"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1">Situs Portofolio / GitHub Link</label>
            <input
              type="text"
              value={cvData.website}
              onChange={(e) => handlePersonalInfoChange("website", e.target.value)}
              className="w-full text-xs border border-slate-300 p-2.5 rounded-lg focus:border-slate-800 outline-none bg-white transition"
              placeholder="rianaditya.dev"
            />
          </div>
        </div>

        {/* Accordion 2: Professional Summary */}
        <div className="border border-slate-200 shadow-sm rounded-xl overflow-hidden p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-600" />
              2. Ringkasan Deskripsi Profil
            </h4>
            <button
              type="button"
              id="polish-summary-btn"
              onClick={() => triggerAIPolish("summary")}
              disabled={polishingSection !== null}
              className="text-[10px] bg-slate-900 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition disabled:opacity-50"
            >
              {polishingSection?.type === "summary" ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300 animate-pulse" />
              )}
              Poles dengan AI
            </button>
          </div>
          <div>
            <textarea
              value={cvData.summary}
              onChange={(e) => handlePersonalInfoChange("summary", e.target.value)}
              className="w-full text-xs border border-slate-300 p-3 rounded-lg focus:border-slate-800 outline-none h-24 resize-y leading-relaxed"
              placeholder="Deskripsikan latar belakang studi Anda, ambisi karier profesional, dan kontribusi taktis yang sanggup Anda bawa..."
            />
          </div>
        </div>

        {/* Accordion 3: Pendidikan */}
        <div className="border border-slate-200 shadow-sm rounded-xl overflow-hidden p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              3. Riwayat Pendidikan Akademik
            </h4>
            <button
              type="button"
              onClick={addEducation}
              className="text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2 py-1 rounded-md flex items-center gap-0.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah
            </button>
          </div>

          <div className="space-y-4">
            {cvData.educations.map((ed, idx) => (
              <div key={idx} className="relative p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                {cvData.educations.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEducation(idx)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-red-600 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase">Sekolah / Universitas</label>
                    <input
                      type="text"
                      value={ed.school}
                      onChange={(e) => handleEducationChange(idx, "school", e.target.value)}
                      className="w-full text-xs border bg-white border-slate-300 p-2 rounded-lg outline-none"
                      placeholder="Universitas Indonesia"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase">Jurusan / Program Studi</label>
                    <input
                      type="text"
                      value={ed.major}
                      onChange={(e) => handleEducationChange(idx, "major", e.target.value)}
                      className="w-full text-xs border bg-white border-slate-300 p-2 rounded-lg outline-none"
                      placeholder="Sistem Informasi"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase">Gelar (S1 / Diploma / SMA)</label>
                    <input
                      type="text"
                      value={ed.degree}
                      onChange={(e) => handleEducationChange(idx, "degree", e.target.value)}
                      className="w-full text-xs border bg-white border-slate-300 p-2 rounded-lg outline-none"
                      placeholder="S1"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase">Periode Studi (Tahun)</label>
                    <input
                      type="text"
                      value={ed.period}
                      onChange={(e) => handleEducationChange(idx, "period", e.target.value)}
                      className="w-full text-xs border bg-white border-slate-300 p-2 rounded-lg outline-none"
                      placeholder="2022 - 2026"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase">IPK / Rata-Rata Nilai</label>
                  <input
                    type="text"
                    value={ed.gpa}
                    onChange={(e) => handleEducationChange(idx, "gpa", e.target.value)}
                    className="w-full text-xs border bg-white border-slate-300 p-2 rounded-lg outline-none"
                    placeholder="3.80 / 4.00"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Accordion 4: Pengalaman Kerja & Magang */}
        <div className="border border-slate-200 shadow-sm rounded-xl overflow-hidden p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-emerald-600" />
              4. Pengalaman Kerja / Magang / Organisasi
            </h4>
            <button
              type="button"
              onClick={addExperience}
              className="text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2 py-1 rounded-md flex items-center gap-0.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah
            </button>
          </div>

          <div className="space-y-4">
            {cvData.experiences.map((exp, idx) => (
              <div key={idx} className="relative p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                {cvData.experiences.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeExperience(idx)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-red-600 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase">Nama Perusahaan / Organisasi</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => handleExperienceChange(idx, "company", e.target.value)}
                      className="w-full text-xs border bg-white border-slate-300 p-2 rounded-lg outline-none"
                      placeholder="PT Telkom Indonesia"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase">Jabatan / Posisi</label>
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) => handleExperienceChange(idx, "role", e.target.value)}
                      className="w-full text-xs border bg-white border-slate-300 p-2 rounded-lg outline-none"
                      placeholder="UI/UX Designer Intern"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase">Masa Periode Aktif</label>
                    <input
                      type="text"
                      value={exp.period}
                      onChange={(e) => handleExperienceChange(idx, "period", e.target.value)}
                      className="w-full text-xs border bg-white border-slate-300 p-2 rounded-lg outline-none"
                      placeholder="Januari 2024 - Maret 2024"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      id={`polish-exp-btn-${idx}`}
                      onClick={() => triggerAIPolish("experience", idx)}
                      disabled={polishingSection !== null}
                      className="w-full text-[10px] bg-slate-900 hover:bg-emerald-700 text-white font-bold p-2.5 rounded-lg flex items-center justify-center gap-1 cursor-pointer transition disabled:opacity-50"
                    >
                      {polishingSection?.type === "experience" && polishingSection?.index === idx ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-pulse" />
                      )}
                      <span>Poles Kerja dengan AI</span>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase">Deskripsi Kegiatan & Capaian Kerja</label>
                  <textarea
                    value={exp.description}
                    onChange={(e) => handleExperienceChange(idx, "description", e.target.value)}
                    className="w-full text-xs border bg-white border-slate-300 p-2.5 rounded-lg focus:border-slate-800 outline-none h-20 resize-y leading-relaxed"
                    placeholder="Mengeksekusi riset pasar, berkolaborasi dengan 4 orang developer, mengoptimasi alur kerja..."
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Accordion 5: Proyek & Portofolio */}
        <div className="border border-slate-200 shadow-sm rounded-xl overflow-hidden p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <FolderGit className="w-4 h-4 text-emerald-600" />
              5. Proyek Mandiri / Portofolio Akademik
            </h4>
            <button
              type="button"
              onClick={addProject}
              className="text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2 py-1 rounded-md flex items-center gap-0.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah
            </button>
          </div>

          <div className="space-y-4">
            {cvData.projects.map((p, idx) => (
              <div key={idx} className="relative p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                {cvData.projects.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeProject(idx)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-red-600 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase">Judul Proyek</label>
                    <input
                      type="text"
                      value={p.title}
                      onChange={(e) => handleProjectChange(idx, "title", e.target.value)}
                      className="w-full text-xs border bg-white border-slate-300 p-2 rounded-lg outline-none"
                      placeholder="Web Portal E-Ticketing"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase">Peran / Jabatan Anda</label>
                    <input
                      type="text"
                      value={p.role}
                      onChange={(e) => handleProjectChange(idx, "role", e.target.value)}
                      className="w-full text-xs border bg-white border-slate-300 p-2 rounded-lg outline-none"
                      placeholder="Full Stack Developer"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase">Alat / Tech Stack</label>
                    <input
                      type="text"
                      value={p.techStack}
                      onChange={(e) => handleProjectChange(idx, "techStack", e.target.value)}
                      className="w-full text-xs border bg-white border-slate-300 p-2 rounded-lg outline-none"
                      placeholder="React, Express.js, Tailwind, MySQL"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      id={`polish-proj-btn-${idx}`}
                      onClick={() => triggerAIPolish("project", idx)}
                      disabled={polishingSection !== null}
                      className="w-full text-[10px] bg-slate-900 hover:bg-emerald-700 text-white font-bold p-2.5 rounded-lg flex items-center justify-center gap-1 cursor-pointer transition disabled:opacity-50"
                    >
                      {polishingSection?.type === "project" && polishingSection?.index === idx ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-pulse" />
                      )}
                      <span>Poles Proyek dengan AI</span>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase">Deskripsi Proyek & Solusi Yang Dibuat</label>
                  <textarea
                    value={p.description}
                    onChange={(e) => handleProjectChange(idx, "description", e.target.value)}
                    className="w-full text-xs border bg-white border-slate-300 p-2.5 rounded-lg focus:border-slate-800 outline-none h-20 resize-y leading-relaxed"
                    placeholder="Merancang arsitektur database, mengurangi database latency sebesar 30%, melayani 500 pengguna aktif sehari..."
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Accordion 6: Skills */}
        <div className="border border-slate-200 shadow-sm rounded-xl p-4 space-y-3">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            6. Kelompok Keahlian & Kompetensi
          </h4>
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-2">
              Daftar Kompetensi Utama (Pisahkan dengan tanda koma ','):
            </label>
            <input
              type="text"
              value={cvData.skills.join(", ")}
              onChange={(e) => handleSkillsChange(e.target.value)}
              className="w-full text-xs border border-slate-300 p-3 rounded-xl focus:border-slate-800 outline-none font-semibold text-slate-700 bg-slate-50/20"
              placeholder="Contoh: CSS, JavaScript, Git, Komunikasi Publik, Manajemen Waktu"
            />
          </div>
          <p className="text-[10px] text-slate-400 italic">
            💡 Tips: Masukkan 8-10 poin keahlian hard / soft yang spesifik dengan peran bidikan loker Anda agar mendapat skor tinggi dalam ATS scanning.
          </p>
        </div>

        {/* AI POLISH REPORT CARDS */}
        {polishExplanation.length > 0 && (
          <div className="bg-amber-50/70 border-2 border-amber-350 p-4 rounded-xl space-y-2 animate-fade-in">
            <h5 className="text-xs font-bold text-amber-900 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              Catatan Peningkatan Struktur Kalimat AI:
            </h5>
            <ul className="space-y-1.5">
              {polishExplanation.map((exp, i) => (
                <li key={i} className="text-[11px] leading-relaxed text-slate-700 flex items-start gap-1">
                  <span>✨</span>
                  <span>{exp}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>


      {/* SEKTOR KANAN: LIVE PREVIEW & CONTROLS */}
      <div className="xl:col-span-6 space-y-5 print:p-0 print:border-none print:shadow-none pr-1">
        
        {/* TOP CONTROLS */}
        <div className="bg-slate-50/90 p-4 border border-slate-200/95 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 print:hidden shadow-[0_8px_30px_rgba(30,41,59,0.04)]">
          
          {/* Theme selector */}
          <div className="flex flex-wrap items-center gap-1.5 shrink-0">
            <span className="text-xs font-bold text-slate-500 mr-1.5 uppercase tracking-wide text-[10px]">Tema Layout:</span>
            <div className="flex flex-wrap gap-1">
              <button
                type="button"
                onClick={() => setSelectedTheme("ats-classic")}
                className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg border transition duration-150 cursor-pointer ${
                  selectedTheme === "ats-classic" 
                    ? "bg-white border-slate-900 text-slate-900 shadow-sm" 
                    : "bg-transparent border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/60"
                }`}
              >
                ATS Classic
              </button>
              <button
                type="button"
                onClick={() => setSelectedTheme("modern-emerald")}
                className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg border transition duration-150 cursor-pointer ${
                  selectedTheme === "modern-emerald" 
                    ? "bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm" 
                    : "bg-transparent border-transparent text-slate-500 hover:text-emerald-700 hover:bg-slate-100/60"
                }`}
              >
                Emerald Clean
              </button>
              <button
                type="button"
                onClick={() => setSelectedTheme("executive-navy")}
                className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg border transition duration-150 cursor-pointer ${
                  selectedTheme === "executive-navy" 
                    ? "bg-indigo-50 border-indigo-600 text-indigo-900 shadow-sm" 
                    : "bg-transparent border-transparent text-slate-500 hover:text-indigo-700 hover:bg-slate-100/60"
                }`}
              >
                Navy Luxe
              </button>
            </div>
          </div>

          {/* Download and printable action btns */}
          <div className="flex flex-col gap-2 shrink-0 min-w-[160px] sm:min-w-[180px]">
            <button
              type="button"
              onClick={copyCleanText}
              className="w-full text-[11px] font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 px-3.5 py-2 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition shadow-xs hover:shadow-sm shrink-0 active:scale-95 duration-100"
              title="Salin isi CV dalam bentuk teks rapi"
            >
              {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Clipboard className="w-3.5 h-3.5" />}
              <span>{copiedText ? "Tersalin!" : "Salin Teks"}</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="w-full text-[11px] font-bold bg-slate-900 text-white hover:bg-slate-800 px-3.5 py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition shadow-sm hover:shadow-md shrink-0 active:scale-95 duration-100"
              title="Cetak langsung ke PDF satu lembar kertas"
            >
              <Printer className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>Cetak PDF</span>
            </button>
          </div>
        </div>

        {/* WRAPPER UNTUK MENCEGAH HORIZONTAL SCROLL UTAMA & MENJAGA PREVIEW TETAP REALISTIS */}
        <div className="w-full overflow-x-auto rounded-3xl border border-slate-200/70 bg-slate-100/40 p-2 sm:p-4 md:p-6 print:p-0 print:border-none print:bg-transparent print:overflow-visible custom-scrollbar">
          <div 
            ref={printRef}
            id="sheet-cv-canvas-print"
            className={`bg-white text-slate-900 border border-slate-200/90 shadow-[0_15px_40px_-10px_rgba(30,41,59,0.12),0_6px_18px_-6px_rgba(0,0,0,0.04)] p-8 sm:p-10 rounded-2xl min-h-[820px] min-w-[640px] max-w-full mx-auto overflow-hidden leading-relaxed border-box relative antialiased transition-all duration-300 print:min-w-0 print:shadow-none print:border-none print:p-0 print:rounded-none ${
              selectedTheme === "modern-emerald" 
                ? "font-sans border-l-[12px] border-l-emerald-600" 
                : selectedTheme === "executive-navy" 
                ? "font-sans border-t-[12px] border-t-indigo-950" 
                : "font-mono border-slate-400"
            }`}
          >
          {/* HEADER SECTION */}
          <div className="border-b-2 border-slate-300 pb-5 mb-5 text-center">
            <h1 className="text-2xl font-black text-slate-950 tracking-tight leading-none uppercase">
              {cvData.fullName || "NAMA MAHASISWA"}
            </h1>
            <p className={`text-xs font-bold mt-1.5 uppercase tracking-widest ${
              selectedTheme === "modern-emerald" 
                ? "text-emerald-700" 
                : selectedTheme === "executive-navy" 
                ? "text-indigo-800" 
                : "text-slate-600"
            }`}>
              {cvData.professionalTitle || "Spesialisasi Profesional / Target Posisi"}
            </p>

            {/* Micro details elements bar */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-600 mt-4 leading-none font-medium">
              {cvData.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {cvData.location}
                </span>
              )}
              {cvData.email && (
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-400" />
                  {cvData.email}
                </span>
              )}
              {cvData.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  {cvData.phone}
                </span>
              )}
              {cvData.linkedin && (
                <a href={`https://${cvData.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 underline hover:text-slate-800 whitespace-nowrap">
                  <Link2 className="w-3 h-3 text-slate-400" />
                  LinkedIn
                </a>
              )}
              {cvData.website && (
                <a href={`https://${cvData.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 underline hover:text-slate-800 whitespace-nowrap">
                  <Link2 className="w-3 h-3 text-slate-400" />
                  Portfolio
                </a>
              )}
            </div>
          </div>

          {/* BODY SECTIONS GRID */}
          <div className="space-y-6">
            
            {/* Summary */}
            {cvData.summary && (
              <div>
                <h3 className={`text-xs font-black uppercase tracking-wider mb-2 border-b border-dashed border-slate-300 pb-1 flex items-center gap-1 ${
                  selectedTheme === "modern-emerald" 
                    ? "text-emerald-700" 
                    : selectedTheme === "executive-navy" 
                    ? "text-indigo-950" 
                    : "text-slate-900"
                }`}>
                  <span>Ringkasan / Ringkasan Karakter</span>
                </h3>
                <p className="text-[11px] leading-relaxed text-slate-800 font-medium">
                  {cvData.summary}
                </p>
              </div>
            )}

            {/* Riwayat Pendidikan */}
            {cvData.educations.length > 0 && (
              <div>
                <h3 className={`text-xs font-black uppercase tracking-wider mb-3 border-b border-dashed border-slate-300 pb-1 ${
                  selectedTheme === "modern-emerald" 
                    ? "text-emerald-700" 
                    : selectedTheme === "executive-navy" 
                    ? "text-indigo-950" 
                    : "text-slate-900"
                }`}>
                  Pendidikan Akademik
                </h3>
                <div className="space-y-2.5">
                  {cvData.educations.map((ed, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-start sm:justify-between text-[11px] gap-1">
                      <div>
                        <div className="font-bold text-slate-950">
                          {ed.school || "Sekolah / Instansi Belajar"}
                        </div>
                        <div className="text-slate-600 font-semibold italic text-[10px]">
                          {ed.degree} {ed.major || "Detail Jurusan Belajar"}
                        </div>
                      </div>
                      <div className="text-right sm:text-right shrink-0">
                        <div className="font-bold text-slate-800">{ed.period || "-"}</div>
                        {ed.gpa && <div className="text-emerald-700 font-bold text-[10px] uppercase">IPK: {ed.gpa}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Riwayat Pengalaman */}
            {cvData.experiences.length > 0 && (
              <div>
                <h3 className={`text-xs font-black uppercase tracking-wider mb-3 border-b border-dashed border-slate-300 pb-1 ${
                  selectedTheme === "modern-emerald" 
                    ? "text-emerald-700" 
                    : selectedTheme === "executive-navy" 
                    ? "text-indigo-950" 
                    : "text-slate-900"
                }`}>
                  Pengalaman Profesional & Magang Kerja
                </h3>
                <div className="space-y-4">
                  {cvData.experiences.map((exp, i) => (
                    <div key={i} className="space-y-1.5 text-[11px]">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <span className="font-bold text-slate-950">{exp.role || "Peran Kerja"}</span>
                          <span className="text-slate-400 mx-1.5">—</span>
                          <span className="font-bold text-slate-700">{exp.company || "Nama Perusahaan"}</span>
                        </div>
                        <div className="font-bold text-slate-800 text-right shrink-0">{exp.period || "-"}</div>
                      </div>
                      <p className="text-[10px] leading-relaxed text-slate-800 whitespace-pre-line font-medium pl-3 border-l-2 border-slate-300">
                        {exp.description || "Tulis rincian deskripsi mengenai capaian kerja harian tim..."}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Proyek Mandiri */}
            {cvData.projects.length > 0 && (
              <div>
                <h3 className={`text-xs font-black uppercase tracking-wider mb-3 border-b border-dashed border-slate-300 pb-1 ${
                  selectedTheme === "modern-emerald" 
                    ? "text-emerald-700" 
                    : selectedTheme === "executive-navy" 
                    ? "text-indigo-950" 
                    : "text-slate-900"
                }`}>
                  Proyek Utama & Portofolio Karya
                </h3>
                <div className="space-y-3.5">
                  {cvData.projects.map((p, i) => (
                    <div key={i} className="space-y-1.5 text-[11px]">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <span className="font-bold text-slate-950">{p.title || "Judul Proyek Mandiri"}</span>
                          <span className="text-slate-500 italic ml-1.5 text-[10px]">({p.role || "Peran"})</span>
                        </div>
                        {p.techStack && (
                          <div className="text-[10px] text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 max-w-fit sm:ml-auto">
                            🛠️ {p.techStack}
                          </div>
                        )}
                      </div>
                      <p className="text-[10px] leading-relaxed text-slate-800 whitespace-pre-line font-medium pl-3 border-l-2 border-slate-300">
                        {p.description || "Tulis deskripsi ringkas mengenai pengerjaan solusi..."}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Kompetensi Skills */}
            {cvData.skills.length > 0 && (
              <div>
                <h3 className={`text-xs font-black uppercase tracking-wider mb-2 pb-1 border-b border-dashed border-slate-300 ${
                  selectedTheme === "modern-emerald" 
                    ? "text-emerald-700" 
                    : selectedTheme === "executive-navy" 
                    ? "text-indigo-950" 
                    : "text-slate-900"
                }`}>
                  Kompetensi Utama / Skills
                </h3>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {cvData.skills.map((sk, i) => (
                    <span 
                      key={i} 
                      className={`text-[9.5px] font-bold px-2 py-0.5 rounded-md border ${
                        selectedTheme === "modern-emerald" 
                          ? "bg-emerald-50 text-emerald-900 border-emerald-200" 
                          : selectedTheme === "executive-navy" 
                          ? "bg-slate-50 text-indigo-900 border-slate-200 font-semibold" 
                          : "bg-slate-100 text-slate-800 border-slate-300"
                      }`}
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* RECRUITER VERIFY BADGE MOCK */}
          <div className="absolute bottom-3 right-6 text-[8px] text-slate-400 select-none print:hidden uppercase font-extrabold tracking-widest block font-sans">
            ATS Verification System Guaranteed
          </div>

        </div>
      </div>

        {/* Tip printing info */}
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-[11px] text-slate-500 leading-relaxed print:hidden flex items-start gap-1.5">
          <span>💡</span>
          <span>
            <strong>Tips Cetak PDF Sempurna:</strong> Saat dialog pencetakan browser muncul, pilih opsi <strong>"Save as PDF"</strong>, atur ukuran kertas menjadi <strong>A4</strong>, matikan opsi <strong>"Headers and footers"</strong>, dan nyalakan opsi <strong>"Background graphics"</strong> agar warna aksen template tercetak sempurna.
          </span>
        </div>

      </div>

    </div>
  );
}
