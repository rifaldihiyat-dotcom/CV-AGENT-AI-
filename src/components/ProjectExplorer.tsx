import { useState } from "react";
import { Folder, FileCode, Terminal, HelpCircle, HardDrive, BookOpen, Layers } from "lucide-react";

export default function ProjectExplorer() {
  const [activeTab, setActiveTab] = useState<"structure" | "guide">("structure");

  // Represent the recommended modular React+Express folder tree
  const folderData = [
    { name: "package.json", type: "file", desc: "Manajemen dependensi (Express, React, Google Gen AI SDK, Tailwind)" },
    { name: "server.ts", type: "file", desc: "Main entry point Backend Express yang terintegrasi dengan GoogleGenAI SDK dan Vite middleware" },
    { name: "tsconfig.json", type: "file", desc: "Konfigurasi kompilator TypeScript serta aliasing path" },
    { name: "vite.config.ts", type: "file", desc: "Konfigurasi bundler Vite untuk SPA bundling dan dev settings" },
    {
      name: "src",
      type: "folder",
      children: [
        { name: "main.tsx", type: "file", desc: "Entry-point Client React untuk mount root DOM" },
        { name: "App.tsx", type: "file", desc: "Main dashboard, pengatur Tab & tata letak aplikasi utama" },
        { name: "types.ts", type: "file", desc: "Pendefinisian semua tipe global & struktur antarmuka data bisnis" },
        { name: "index.css", type: "file", desc: "Injeksi Tailwind v4, pengenalan Google Fonts dan gaya CSS kustom" },
        {
          name: "components",
          type: "folder",
          children: [
            { name: "StatusBanner.tsx", type: "file", desc: "Pemeriksa status server-side, mendeteksi ketersediaan API key Gemini" },
            { name: "CVReviewer.tsx", type: "file", desc: "Panel input CV (Template/File/Manual), analisis kecocokan & ATS" },
            { name: "InterviewSimulator.tsx", type: "file", desc: "Antarmuka chat wawancara kerja, persona HR, quick chips & recording mockup" },
            { name: "SkillGapAnalyzer.tsx", type: "file", desc: "Alur interaktif visualisasi roadmap belajar, kriteria gap skill & penyelesaian milestone" },
            { name: "LinkedInOptimizer.tsx", type: "file", desc: "Perbandingan Sebelum vs Sesudah penulisan profile strategis, clipboard copies & tips" },
            { name: "ProjectExplorer.tsx", type: "file", desc: "Visualisasi struktur folder & panduan deployment yang Anda lihat sekarang" }
          ]
        }
      ]
    }
  ];

  const renderTree = (nodes: any[], depth = 0) => {
    return nodes.map((node, i) => {
      const isFolder = node.type === "folder";
      return (
        <div key={i} className="select-none">
          <div 
            className="flex items-start gap-2.5 py-1.5 px-2 hover:bg-slate-50 rounded-lg transition-colors text-xs text-slate-700"
            style={{ paddingLeft: `${depth * 16 + 8}px` }}
          >
            {isFolder ? (
              <Folder className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            ) : (
              <FileCode className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <span className={isFolder ? "font-bold text-slate-800" : "font-mono font-medium text-slate-600"}>
                {node.name}
              </span>
              <span className="hidden sm:inline-block text-[11px] text-slate-400 ml-3 italic">
                — {node.desc}
              </span>
            </div>
          </div>
          {isFolder && node.children && renderTree(node.children, depth + 1)}
        </div>
      );
    });
  };

  return (
    <div id="project-explorer" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-[0_10px_35px_-4px_rgba(30,41,59,0.07),0_4px_12px_-2px_rgba(30,41,59,0.04)]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 pb-5 mb-5 gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Panduan Teknis & Struktur Folder</h3>
          <p className="text-xs text-slate-500 leading-relaxed mt-1">
            Penjelasan detail cara kerja struktur pengenalan modular kode serta alur eksekusi integrasi LLM.
          </p>
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("structure")}
            className={`text-xs px-3.5 py-1.5 rounded-xl font-semibold transition ${
              activeTab === "structure" 
                ? "bg-white text-slate-800 shadow-xs" 
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Layers className="w-3.5 h-3.5 inline mr-1" />
            Struktur Folder
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("guide")}
            className={`text-xs px-3.5 py-1.5 rounded-xl font-semibold transition ${
              activeTab === "guide" 
                ? "bg-white text-slate-800 shadow-xs" 
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 inline mr-1" />
            Panduan Menjalankan
          </button>
        </div>
      </div>

      {activeTab === "structure" ? (
        <div id="folder-structure-view" className="space-y-6 animate-fade-in">
          <div className="bg-slate-50 p-4 border border-slate-200 rounded-2xl">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-3">
              <Terminal className="w-3.5 h-3.5 text-slate-600" />
              Rekomendasi Pohon Struktur Folder Modular
            </h4>
            <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1 max-h-[460px] overflow-y-auto">
              {renderTree(folderData)}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-sky-50/20 border border-sky-200 p-4 rounded-2xl">
              <h5 className="text-xs font-bold text-sky-900 mb-1 flex items-center gap-1">
                <span>1. Keuntungan Modular</span>
              </h5>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Pemisahan komponen utama ke folder <code>src/components/</code> membuat komponen tidak tumpang tindip, memperkecil ukuran file, dan mengatasi batas token parsing model AI.
              </p>
            </div>
            <div className="bg-emerald-50/20 border border-emerald-250 p-4 rounded-2xl">
              <h5 className="text-xs font-bold text-emerald-950 mb-1 flex items-center gap-1">
                <span>2. Keamanan Kunci API</span>
              </h5>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Variable rahasia <code>GEMINI_API_KEY</code> hanya berjalan di Backend <code>server.ts</code> melalui variabel <code>process.env</code>, mencegah kunci dicuri lewat inspeksi berkas browser client.
              </p>
            </div>
            <div className="bg-blue-50/20 border border-blue-200 p-4 rounded-2xl">
              <h5 className="text-xs font-bold text-blue-950 mb-1 flex items-center gap-1">
                <span>3. Pertukaran Tipe Kuat</span>
              </h5>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Tipe antarmuka dideklarasikan di <code>src/types.ts</code>, menjamin sinkronisasi pertukaran format JSON antara Express routes dengan komponen React di frontend.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div id="running-guide-view" className="space-y-6 animate-fade-in">
          {/* STEP 1 */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase">
              Langkah Menjalankan Project Secara Lokal (Offline/Online)
            </h4>
            
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl font-mono text-xs text-slate-700 leading-relaxed">
              <div className="text-slate-400 mb-2"># 1. Install semua dependensi modular</div>
              <div className="text-emerald-700 font-bold mb-4">npm install</div>

              <div className="text-slate-400 mb-2"># 2. Tambahkan variabel kunci di file .env</div>
              <div className="text-blue-700 font-bold mb-4">GEMINI_API_KEY="AIzaSyYour_Actual_Real_Gemini_Key_Here"</div>

              <div className="text-slate-400 mb-2"># 3. Jalankan server local pembangunan (Vite + Express)</div>
              <div className="text-emerald-700 font-bold mb-4">npm run dev</div>

              <div className="text-slate-400 mb-2"># 4. Melakukan build bundler production di folder /dist</div>
              <div className="text-emerald-700 font-bold">npm run build</div>
            </div>
          </div>

          {/* HOW TO EDIT REAL LLM CALLS & EXPLAIN */}
          <div className="bg-blue-50/30 border-2 border-blue-300 p-5 rounded-2xl space-y-3">
            <h5 className="text-xs font-bold text-blue-950 flex items-center gap-1">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              Bagaimana Cara Mengubah Menjadi Model LLM Baru?
            </h5>
            <div className="text-xs text-slate-700 leading-relaxed space-y-2">
              <p>
                Aplikasi ini dikembangkan sepenuhnya menggunakan SDK resmi <strong>@google/genai</strong>. Anda bisa dengan sangat mudah mengganti instruksi, parameter, atau versi model di file <code>server.ts</code>.
              </p>
              <p>
                Untuk mengubah asisten model kustom Anda di kemudian hari, buka file <strong><code>server.ts</code></strong> dan cari baris berikut:
              </p>
              <pre className="p-3 bg-slate-800 text-slate-200 rounded-xl font-mono text-[10px] my-2 leading-relaxed">
{`const response = await client.models.generateContent({
  model: "gemini-3.5-flash", // Ganti ke model lainnya jika ingin mencoba
  contents: prompt,
  config: { ... }
});`}
              </pre>
              <p>
                Mendukung respon terstruktur penuh berbasis skema JSON (<code>responseSchema</code>) sehingga mengeliminasi kendala parsing teks manual pada bagian frontend React.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
