import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization helper for Google Gen AI
let aiClient: GoogleGenAI | null = null;
const api_key = process.env.GEMINI_API_KEY;
const isRealApiKey = api_key && api_key !== "" && api_key !== "MY_GEMINI_API_KEY";

function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && isRealApiKey) {
    try {
      aiClient = new GoogleGenAI({
        apiKey: api_key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
      console.log("Successfully initialized real GoogleGenAI client.");
    } catch (err) {
      console.error("Failed to initialize GoogleGenAI client:", err);
    }
  }
  return aiClient;
}

// Global API Status reporter
app.get("/api/status", (req, res) => {
  res.json({
    status: "online",
    hasApiKey: !!isRealApiKey,
    message: isRealApiKey 
      ? "Sistem terhubung dengan Gemini AI API." 
      : "Mode simulasi aktif (Hubungkan GEMINI_API_KEY di panel Secrets untuk fungsionalitas LLM asli)."
  });
});

// ==========================================
// 1. FEATURE: CV REVIEWER API (/api/cv-review)
// ==========================================
app.post("/api/cv-review", async (req, res) => {
  try {
    const { cvText, targetRole, fileBase64, mimeType, fileName } = req.body;
    if ((!cvText || cvText.trim() === "") && !fileBase64) {
       res.status(400).json({ error: "Konten CV tidak boleh kosong. Harap isi teks atau unggah file resume." });
       return;
    }

    const role = targetRole || "General Job Seeker";
    const client = getGeminiClient();

    if (client) {
      // Create multimodal or text structures dynamically
      let contents: any[] = [];
      if (fileBase64) {
        const pureBase64 = fileBase64.replace(/^data:.*?;base64,/, "");
        const activeMime = mimeType || "application/pdf";
        
        contents = [
          {
            inlineData: {
              mimeType: activeMime,
              data: pureBase64
            }
          },
          `Lakukan analisis mendalam terhadap dokumen CV/resume terlampir untuk posisi target: "${role}".
Berikan evaluasi ramah ATS (Applicant Tracking System), skor kelayakan keseluruhan, kekuatan CV, kelemahan, saran perbaikan konkret, serta tips format.
PENTING: Generate-lah 3-4 kalimat deskripsi pencapaian (Achievement Bullet Points) profesional bertenaga, siap salin menggunakan kata kerja aksi aktif dan rumus STAR khusus untuk posisi "${role}" yang bisa langsung ditempel user ke bagian pengalaman CV mereka.
Selain itu, susun kembali seluruh data dari CV pengetik menjadi dokumen draf naskah CV utuh baru yang sangat optimal ramah ATS dalam format teks Markdown (Berisi Ringkasan Profesional, Kontak, Pendidikan, Pengalaman Terpilih dengan bullet point STAR, dan Keahlian Teknis terfokus).`
        ];
      } else {
        contents = [
          `Lakukan analisis mendalam terhadap teks CV berikut untuk posisi target: "${role}".
Berikan evaluasi ramah ATS (Applicant Tracking System), skor kelayakan keseluruhan, kekuatan CV, kelemahan, saran perbaikan konkret, serta tips format.

PENTING: Generate-lah 3-4 kalimat deskripsi pencapaian (Achievement Bullet Points) profesional bertenaga, siap salin menggunakan kata kerja aksi aktif dan rumus STAR khusus untuk posisi "${role}" yang bisa langsung ditempel user ke bagian pengalaman CV mereka.
Selain itu, susun kembali seluruh data dari CV pengetik menjadi dokumen draf naskah CV utuh baru yang sangat optimal ramah ATS dalam format teks Markdown (Berisi Ringkasan Profesional, Kontak, Pendidikan, Pengalaman Terpilih dengan bullet point STAR, dan Keahlian Teknis terfokus).

Teks CV:
${cvText}`
        ];
      }

      // Real Gemini API Call with structured responseSchema
      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction: "Kamu adalah seorang pakar HRD (Human Resources) dan Resume Analyst profesional asal Indonesia yang membantu mahasiswa membuat CV ramah ATS.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              atsScore: { type: Type.INTEGER, description: "ATS Score dari skala 0 hingga 100 berdasarkan kelayakan CV terhadap targetRole." },
              strengths: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "Daftar 3-4 poin kekuatan utama yang telah ditulis baik di CV." 
              },
              weaknesses: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "Daftar 3-4 kekurangan CV yang harus segera diperbaiki." 
              },
              improvements: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "Daftar rekomendasi revisi/improvement yang praktis dan taktis beserta contoh aksinya." 
              },
              formattingAdvice: { type: Type.STRING, description: "Saran format (layout, penggunaan tabel, font, jenis file, dsb) dalam 2-3 kalimat ringkas." },
              roleFitRating: { type: Type.STRING, description: "Pilih salah satu predikat: 'Sangat Cocok', 'Cukup Layak', 'Butuh Perbaikan Banyak', 'Kurang Relevan'." },
              suggestedBulletPoints: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Daftar 3-4 butir bullet point deskripsi pencapaian baru yang siap salin menggunakan rumus STAR & metrik persentase fiktif mencerahkan."
              },
              generatedFormattedCv: {
                type: Type.STRING,
                description: "Daf naskah teks CV baru ramah ATS yang sudah dioptimasi, berfokus pada target role, ditulis rapi dalam sintaksis Markdown."
              }
            },
            required: ["atsScore", "strengths", "weaknesses", "improvements", "formattingAdvice", "roleFitRating", "suggestedBulletPoints", "generatedFormattedCv"]
          }
        }
      });

      const resultText = response.text;
      if (resultText) {
        const parsed = JSON.parse(resultText.trim());
        res.json({ ...parsed, fallback: false });
        return;
      }
    }

    // High quality fallback mock data tailored dynamically to the user's role input!
    const fallbackScore = Math.floor(Math.random() * 20) + 68; // generate score between 68 and 88
    
    // Dynamic Indonesian mock response simulating real AI feedback
    let strengths = [
      fileBase64 
        ? `Dokumen terunggah (${fileName || "CV"}) terbaca dengan susunan tata letak yang rapi.`
        : "Deskripsi riwayat pendidikan ditulis dengan jelas dan terperinci.",
      "Penggunaan kata kerja aktif dalam menjelaskan kegiatan magang/organisasi cukup bervariasi.",
      "Informasi kontak dasar (Email, LinkedIn, Lokasi) diletakkan di bagian atas secara strategis."
    ];
    let weaknesses = [
      "Masih banyak menggunakan elemen visual yang mengganggu sistem parser ATS dasar (seperti grafik skill lingkaran atau kolom ganda kompleks).",
      "Kurangnya kata kunci industri yang dicari perekrut untuk posisi " + role + ".",
      "Pencapaian belum menggunakan rumus STAR (Situation, Task, Action, Result) dan tidak menyertakan metrik kuantitatif (angka/persentase)."
    ];
    let improvements = [
      "Ubah kalimat tugas biasa menjadi kalimat pencapaian berorientasi hasil yang bisa disalin di bagian rekomendasi bawah.",
      "Tambahkan kata kunci spesifik untuk peran " + role + " seperti istilah tools, metodologi, atau hard skill yang relevan.",
      "Gunakan format layout satu kolom standar tanpa gambar, ikon berlebihan, atau tabel rumit untuk memaksimalkan read-rate mesin ATS."
    ];

    if (fileName && fileName.toLowerCase().endsWith(".pdf")) {
      strengths.push("File dikirimkan dalam format PDF standar industri yang sangat disukai sistem recruiter.");
    }

    if (cvText && (cvText.toLowerCase().includes("canva") || cvText.toLowerCase().includes("kreatif") || cvText.toLowerCase().includes("creative"))) {
      weaknesses.push("Format kreatif terdeteksi. Parser ATS tradisional sering gagal membaca teks di balik kotak warna warni.");
      improvements.push("Gunakan template CV minimalis hitam-putih berbasis teks murni di Google Docs atau Microsoft Word.");
    }

    let suggestedBulletPoints: string[] = [];
    let generatedFormattedCv = "";

    // High fidelity template generator based on role type for fallback mode
    if (role.toLowerCase().includes("it") || role.toLowerCase().includes("developer") || role.toLowerCase().includes("programmer") || role.toLowerCase().includes("tech")) {
      strengths.push("Daftar bahasa pemrograman dan teknologi (Technical Skills) disusun dengan rapi.");
      weaknesses.push("Belum menyertakan tautan/link portofolio GitHub atau demo proyek yang aktif.");
      improvements.push("Sematkan link GitHub, sertifikasi resmi cloud/coding, atau portfolio website di bagian kontak.");
      
      suggestedBulletPoints = [
        "Mengembangkan antarmuka web responsif menggunakan React.js dan Tailwind CSS, berhasil mempercepat rendering sebesar 35% berdasarkan audit Chrome DevTools.",
        "Mengintegrasikan 5+ RESTful API pihak ketiga menggunakan Axios dengan penanganan error yang andal, mengurangi tingkat kegagalan koneksi backend hingga 15%.",
        "Berkolaborasi dengan desainer UI/UX melalui Figma untuk merancang 12 halaman web interaktif, yang sukses memotong durasi rilis versi beta sebesar 2 minggu."
      ];

      generatedFormattedCv = `# NAMA LENGKAP MAHASISWA
Jakarta, Indonesia | +62 812-3412-XXXX | email.anda@gmail.com | linkedin.com/in/username

### RINGKASAN PROFESIONAL
Mahasiswa tingkat akhir Teknik Informatika yang berdedikasi tinggi dan memiliki minat mendalam pada pengembangan web Frontend dan optimasi aplikasi ramah pengguna. Menguasai pemrograman Javascript/Typescript modern, React.js, serta desain tata letak responsif menggunakan Tailwind CSS. Terbiasa berkolaborasi dalam tim menggunakan repositori Git secara efisien.

### PENDIDIKAN
**Universitas Informatika Indonesia** — S1 Teknik Informatika (IPK: 3.65 / 4.00)
*Agustus 2022 — Sekarang (Est. Lulus: 2026)*
* Alumnus Program Studi Terbaik, aktif dalam komunitas coding kampus.

### PENGALAMAN ORGANISASI & PROYEK
**Frontend Engineer - Web Portfolio Optimizer** (Proyek Mandiri) — *Januari 2024*
* Mengembangkan antarmuka web responsif menggunakan React.js dan Tailwind CSS yang mempercepat rendering sebesar 35%.
* Menyusun kode reusable komponen arsitektur modular yang meningkatkan keterbacaan kode (clean code) dan memotong siklus debug tim hingga 20%.

**Anggota Divisi Humas & Teknologi - Himpunan Mahasiswa** — *Maret 2023 — Desember 2023*
* Mengoptimalkan portal informasi online himpunan, melayani akses lebih dari 500+ mahasiswa aktif dengan uptime 99%.
* Membuat konten publik berita akademik mingguan dengan engagement rate platform naik sebanyak 25%.

### KEAHLIAN TEKNIS
* **Bahasa Pemrograman:** JavaScript (ES6+), TypeScript, HTML5, CSS3
* **Framework & Library:** React.js, Next.js, Tailwind CSS, Bootstrap
* **Framework Backend & Tools:** Node.js, Express, Git/GitHub, Figma, Postman API`;

    } else if (role.toLowerCase().includes("marketing") || role.toLowerCase().includes("sales") || role.toLowerCase().includes("bisnis") || role.toLowerCase().includes("sosmed")) {
      weaknesses.push("Kurang menonjolkan pencapaian konversi, lead, atau pertumbuhan audiens secara kuantitatif.");
      improvements.push("Masukkan pencapaian konkret, contoh: 'Berhasil menggaet 10+ klien baru dalam event tahunan'.");

      suggestedBulletPoints = [
        "Merancang strategi konten TikTok & Instagram Reels organik yang berhasil menaikkan jumlah pengikut (followers) sebesar 45% dalam tempo 3 bulan.",
        "Mengelola anggaran iklan promosi digital berbayar senilai Rp2.500.000 dengan hasil peningkatan konversi pembelian produk sebesar 18% dari target utama.",
        "Membuat 35+ naskah copywriting kreatif kampanye bulanan dengan riset tren harian yang meningkatkan keterlibatan (engagement rate) audiens sebesar 22%."
      ];

      generatedFormattedCv = `# NAMA LENGKAP MAHASISWA
Bandung, Indonesia | +62 813-1122-XXXX | email.anda@gmail.com | linkedin.com/in/username

### RINGKASAN PROFESIONAL
Mahasiswa Ilmu Pemasaran yang kreatif, analitis, dan memiliki hasrat mendalam pada Pemasaran Digital, Manajemen Media Sosial, serta Copywriting. Terampil mengambil keputusan berbasis metrik performa (Engagement Rate, CTR) untuk membangun awareness dan mendorong jumlah konversi pelanggan di berbagai media digital.

### PENDIDIKAN
**Universitas Bisnis Pembangunan** — S1 Ilmu Komunikasi / Pemasaran (IPK: 3.52 / 4.00)
*Agustus 2022 — Sekarang*

### PENGALAMAN ORGANISASI & MAGANG
**Assoc Digital Marketer - Magang Toko Online** — *September 2023 — Januari 2024*
* Merancang strategi konten TikTok & Instagram Reels organik yang berhasil menaikkan pengikut (followers) sebesar 45%.
* Melayani respon kueri pelanggan melalui WhatsApp bisnis dengan rata-rata waktu respon kurang dari 5 menit, meningkatkan skor kepuasan pelanggan sebesar 15%.

**Katua Divisi Publikasi & Desain Kampus** (Event Kreatif) — *Juni 2023*
* Memimpin tim berisi 5 orang untuk mempromosikan acara seminar tahunan, menjaring lebih dari 350+ peserta berbayar (melebihi target awal sebesar 15%).
* Merintis desain digital feeds yang memicu impresi postingan naik sebanyak 3,000+ tayangan organik.

### KEAHLIAN UTAMA & TOOLS
* **Spesialisasi:** Digital Marketing Strategy, Copywriting (AIDAS Formula), SEO Dasar, Social Media Analytics
* **Tools Kreatif & Analitik:** Canva Premium, Meta Business Suite, Google Analytics, CapCut Desktop, TikTok Analytics`;

    } else {
      // General Career Candidate Mock Fallbacks
      suggestedBulletPoints = [
        "Memimpin inisiatif program kerja efisiensi koordinasi internal tim beranggota 6 orang, melahirkan peningkatan produktivitas kerja harian sebesar 20%.",
        "Menyusun draf riset komparatif industri serta tren kebutuhan konsumen, memberikan rekomendasi krusial yang diadopsi oleh 3 tim kerja utama.",
        "Mempresentasikan laporan capaian bulanan dan evaluasi program di hadapan 50+ audiens mahasiswa aktif dengan tingkat umpan balik kepuasan mencapai 90%."
      ];

      generatedFormattedCv = `# NAMA LENGKAP MAHASISWA
Surabaya, Indonesia | +62 857-1234-XXXX | email.anda@gmail.com | linkedin.com/in/username

### RINGKASAN PROFESIONAL
Mahasiswa proaktif dengan rekam jejak kepemimpinan organisasi dan manajemen proyek yang terbukti andal. Memiliki antusiasme tinggi untuk berkontribusi secara profesional pada posisi magang administratif, manajerial, maupun operasional. Sangat menyukai pemecahan masalah secara kolaboratif.

### PENDIDIKAN
**Universitas Negeri Indonesia** — Sarjana S1 (IPK: 3.60 / 4.00)
*Agustus 2022 — Sekarang*

### PENGALAMAN ORGANISASI & MANAJEMEN EVENT
**Ketua Pelaksana Program Kerja - Divisi Kemahasiswaan** — *Mei 2023 — Desember 2023*
* Memimpin koordinasi internal tim beranggota 6 orang, sukses melahirkan peningkatan produktivitas pengerjaan laporan sebesar 20%.
* Menyelesaikan pelaksanaan program tepat waktu dengan penghematan sisa anggaran kas terkontrol sebesar 12%.

**Staf Administrasi & Dokumentasi - Event Nasional** — *Oktober 2023*
* Mengelola arsip surat masuk dan pendaftaran peserta digital untuk lebih dari 400+ peserta dengan keakuratan data 100%.

### KEAHLIAN & KOMPETENSI
* **Kerja Sama Tim:** Kepemimpinan, Manajemen Waktu, Public Speaking, Administrasi Dokumen
* **Tools Aplikasi:** Microsoft Office (Word, Excel, PowerPoint), Google Workspace (Sheets, Slides), Trello`;
    }

    res.json({
      atsScore: fallbackScore,
      strengths: strengths.slice(0, 4),
      weaknesses: weaknesses.slice(0, 4),
      improvements: improvements.slice(0, 4),
      formattingAdvice: "Gunakan tipe visual satu kolom yang bersih, pakai font standar seperti Arial atau Calibri ukuran 10-12pt, dan pastikan file Anda diekspor sebagai PDF standar.",
      roleFitRating: fallbackScore >= 75 ? "Cukup Layak" : "Butuh Perbaikan Banyak",
      suggestedBulletPoints,
      generatedFormattedCv,
      fallback: true
    });

  } catch (error: any) {
    console.error("Endpoint /api/cv-review error:", error);
    res.status(500).json({ error: "Gagal memproses review CV. " + error.message });
  }
});


// ==========================================
// 2. FEATURE: INTERVIEW SIMULATOR API (/api/interview)
// ==========================================
app.post("/api/interview", async (req, res) => {
  try {
    const { messages, targetPosition, currentMessage } = req.body;
    
    if (!messages || !Array.isArray(messages) || !currentMessage) {
       res.status(400).json({ error: "Data percakapan tidak lengkap." });
       return;
    }

    const position = targetPosition || "Staff Umum";
    const client = getGeminiClient();

    if (client) {
      // Build conversation history for Gemini chat
      const systemPrompt = `Kamu adalah seorang Interviewer HRD (Human Resources) profesional yang tegas, ramah, dan berpengalaman di sebuah perusahaan ternama di Indonesia.
Tugas kamu adalah melakukan simulasi wawancara kerja yang interaktif untuk posisi: "${position}".

Aturan Wawancara:
1. Sapa user terlebih dahulu (jika pesan baru dimulai).
2. Ajukan satu pertanyaan wawancara kerja yang berbobot secara bergantian (jangan ajukan banyak pertanyaan sekaligus agar interaksi mengalir alami).
3. Evaluasi jawaban user secara ringkas sebelum mengajukan pertanyaan berikutnya.
4. Jawab dalam bahasa Indonesia yang profesional, formal (menggunakan panggilan 'Anda' atau 'Saudara'), namun tetap nyaman diajak berkomunikasi.
5. Jika pembicaraan terasa sudah cukup panjang (lebih dari 5-6 pesan), kamu bisa menutup wawancara dengan ucapan terima kasih dan evaluasi ringkas terhadap performa mereka.`;

      // Transform history to contents array for Gemini
      const geminiContents = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' as const : 'model' as const,
        parts: [{ text: msg.text }]
      }));

      // Append the latest user message
      geminiContents.push({
        role: 'user' as const,
        parts: [{ text: currentMessage }]
      });

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: geminiContents,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        }
      });

      const reply = response.text || "Mohon maaf, terjadi kendala saat mencerna jawaban Anda. Bisa mohon diulangi?";
      res.json({ reply, fallback: false });
      return;
    }

    // High quality interactive mock response
    // Fallback logic that analyzes the chat length & matches keywords to make it look highly intelligent!
    const replyCount = messages.filter(m => m.sender === 'ai').length;
    let reply = "";

    const cleanInput = currentMessage.toLowerCase();

    if (replyCount === 0) {
      reply = `Halo! Terima kasih sudah hadir dalam sesi simulasi hari ini. Selamat datang di portal rekrutmen kami. Silakan perkenalkan diri Anda secara singkat dan ceritakan mengapa Anda tertarik melamar posisi sebagai ${position}?`;
    } else if (cleanInput.includes("perkenalkan") || cleanInput.includes("nama saya") || cleanInput.includes("lulusan") || cleanInput.includes("kuliah")) {
      reply = `Terima kasih atas perkenalan yang komprehensif. Saya melihat latar belakang Anda menarik. Terkait dengan posisi ${position}, bisa Anda berikan contoh proyek atau pengalaman organisasi paling menantang yang pernah Anda selesaikan? Bagaimana peran Anda di sana?`;
    } else if (cleanInput.includes("tantangan") || cleanInput.includes("mengatasi") || cleanInput.includes("masalah") || cleanInput.includes("proyek") || cleanInput.includes("organisasi")) {
      reply = `Menarik sekali cara Anda menangani situasi tersebut. Ini membuktikan kemampuan problem-solving Anda. Sekarang, untuk pertanyaan berikutnya: Bagaimana Anda bekerja di bawah tekanan tinggi atau jadwal proyek yang ketat? Bisakah diceritakan kejadian nyatanya?`;
    } else if (cleanInput.includes("tekanan") || cleanInput.includes("stres") || cleanInput.includes("lembur") || cleanInput.includes("prioritas")) {
      reply = `Sangat baik. Manajemen stres dan penentuan prioritas memang kunci keberhasilan berkolaborasi. Mengingat Anda adalah seorang mahasiswa/fresh graduate, berapa ekspektasi gaji Anda jika diterima bekerja di sini, dan komitmen waktu apa yang bisa Anda janjikan?`;
    } else {
      // General transition
      reply = `Pemahaman yang sangat bagus. Sebagai pertanyaan penutup dari perbincangan awal kita untuk posisi ${position}: Apa kelebihan terbesar Anda yang membuat kami harus memilih Anda ketimbang kandidat mahasiswa lainnya?`;
    }

    // Final closing if interaction is getting longer
    if (replyCount >= 4) {
      reply = `Sesi wawancara awal kita telah selesai. Saya sangat menghargai jawaban Anda yang sangat terstruktur. 
      
📝 **Hasil feedback singkat kami:**
• **Sisi Positif:** Anda menjawab dengan percaya diri dan mampu berfokus pada penyelesaian konflik.
• **Area Pengembangan:** Perbanyak menyisipkan data konkret (seperti durasi waktu, persentase keberhasilan) untuk memperkuat argumen Anda.

Semoga beruntung dalam persiapan wawancara rekrutmen industri yang sebenarnya!`;
    }

    res.json({ reply, fallback: true });

  } catch (error: any) {
    console.error("Endpoint /api/interview error:", error);
    res.status(500).json({ error: "Gagal memproses simulasi wawancara. " + error.message });
  }
});


// ==========================================
// 3. FEATURE: SKILL GAP ANALYZER API (/api/skill-gap)
// ==========================================
app.post("/api/skill-gap", async (req, res) => {
  try {
    const { careerGoal } = req.body;
    if (!careerGoal || careerGoal.trim() === "") {
       res.status(400).json({ error: "Cita-cita karier tidak boleh kosong." });
       return;
    }

    const client = getGeminiClient();

    if (client) {
      const prompt = `Buatkan kurikulum belajar terperinci dan roadmap langkah demi langkah (milestones) untuk mencetak mahasiswa lulusan baru yang berdaya saing tinggi menjadi seorang "${careerGoal}".
Roadmap harus berisi 4 tahap belajar yang bertingkat, lengkap dengan metrik kelemahan pasar, estimasi waktu belajar, deskripsi singkat, dan poin milestones utama yang harus dikuasai mahasiswa.`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "Kamu adalah konsultan edukasi profesional dan kurator bidang EdTech Indonesia. Jawaban harus rapi dan disusun sistematis menggunakan bahasa Indonesia.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              careerGoal: { type: Type.STRING },
              currentSkillsAssessment: { type: Type.STRING, description: "Ringkasan kesenjangan skill paling umum pada mahasiswa baru/fresh graduate untuk peran ini dalam 2-3 kalimat." },
              essentialSkillsToLearn: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "Daftar 5 hard/soft skill paling dicari industri untuk peran ini." 
              },
              roadmap: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING, description: "ID unik bertipe string, seperti 'step-1', 'step-2'." },
                    title: { type: Type.STRING, description: "Judul fase belajar (misalnya: Fondasi Awal, Pengembangan Lanjutan, dsb)." },
                    duration: { type: Type.STRING, description: "Saran waktu tempuh (misalnya: Bulan 1-2, Minggu ke-3, dsb)." },
                    description: { type: Type.STRING, description: "Detail kegiatan dan hal penting yang dipelajari pada fase ini." },
                    milestones: { 
                      type: Type.ARRAY, 
                      items: { type: Type.STRING },
                      description: "Daftar 3 target pencapaian taktis (misalnya: sertifikasi, membuat 1 proyek mini, dsb)." 
                    },
                    status: { type: Type.STRING, description: "Harus bernilai default: 'pending'." }
                  },
                  required: ["id", "title", "duration", "description", "milestones", "status"]
                }
              }
            },
            required: ["careerGoal", "currentSkillsAssessment", "essentialSkillsToLearn", "roadmap"]
          }
        }
      });

      const resultText = response.text;
      if (resultText) {
        const parsed = JSON.parse(resultText.trim());
        res.json({ ...parsed, fallback: false });
        return;
      }
    }

    // Dynamic High-Quality Fallback roadmap tailored to user input
    let mockSkills: string[] = ["Problem Solving", "Dasar Sektor Terkait", "Adaptabilitas"];
    let mockAssessment = `Bagi kandidat pelamar "${careerGoal}", tantangan terbesar mahasiswa adalah kurangnya pengalaman portofolio proyek aslinya. Banyak teori yang dipahami, tetapi kaku dalam praktik implementasi instrumen industri masa kini.`;
    
    let steps = [
      {
        id: "step-1",
        title: "Pemahaman Teori Dasar & Fondasi",
        duration: "Bulan 1",
        description: "Fokus pada penguatan konsep teoretis utama, metodologi standar kerja, istilah-istilah wajib, dan melatih logika penyelesaian masalah dasar.",
        milestones: [
          "Membaca 2 buku referensi industri",
          "Menyelesaikan 1 kursus online sertifikasi dasar",
          "Membuat catatan ringkasan konsep inti"
        ],
        status: "active" as const
      },
      {
        id: "step-2",
        title: "Pembangunan Portofolio & Proyek Skala Kecil",
        duration: "Bulan 2-3",
        description: "Mulai mempraktikkan teori dengan membuat 2-3 mini project nyata yang merefleksikan alur kerja harian di industri profesional.",
        milestones: [
          "Membangun dan memublikasikan mini project pertama",
          "Belajar menggunakan tools kolaborasi industri (seperti Git/Trello/Figma)",
          "Meminta feedback/review dari senior/mentor akademis"
        ],
        status: "pending" as const
      },
      {
        id: "step-3",
        title: "Studi Kasus Bisnis & Penyelesaian Solusi Kompleks",
        duration: "Bulan 4",
        description: "Menganalisis studi kasus nyata dari perusahaan ternama untuk mengasah analytical thinking serta cara menyusun dokumen solusi profesional.",
        milestones: [
          "Menjelaskan pemecahan kasus melalui slide presentasi",
          "Mengikuti perlombaan studi kasus mahasiswa atau webinar bedah kasus",
          "Memperkuat penguasaan advanced tools"
        ],
        status: "pending" as const
      },
      {
        id: "step-4",
        title: "Persiapan Karier, Networking, & Simulasi Akhir",
        duration: "Bulan 5",
        description: "Mengintegrasikan seluruh pencapaian ke dalam resume, melatih personal branding di media profesional, serta aktif melakukan networking.",
        milestones: [
          "Menyusun portofolio online yang interaktif",
          "Menghubungi 3 praktisi industri untuk mentoring santai (informational interview)",
          "Melakukan simulasi interview dan review profile LinkedIn"
        ],
        status: "pending" as const
      }
    ];

    if (careerGoal.toLowerCase().includes("web") || careerGoal.toLowerCase().includes("frontend") || careerGoal.toLowerCase().includes("developer") || careerGoal.toLowerCase().includes("tech")) {
      mockSkills = ["HTML/CSS/TypeScript", "React or Vue.js", "REST API & Integration", "Git & GitHub", "UI/UX Awareness"];
      steps[0].title = "Bahasa Pengodean & Sintaksis Inti";
      steps[1].title = "Pembangunan Proyek Interaktif (Slicing Figma)";
      steps[2].title = "Manajemen State & API Asynchronous";
      steps[3].title = "Integrasi Proyek ke GitHub & Deployment";
    } else if (careerGoal.toLowerCase().includes("data") || careerGoal.toLowerCase().includes("analyst") || careerGoal.toLowerCase().includes("science")) {
      mockSkills = ["SQL Querying", "Python/R Programming", "Exploratory Data Analysis", "Tableau/PowerBI", "Statistika & Probabilitas"];
      steps[0].title = "Kueri Database SQL & Statistika";
      steps[1].title = "Analisis Data Python & Data Cleaning";
      steps[2].title = "Visualisasi Data & Dashboard KPI";
      steps[3].title = "Penyusunan Executive Summary Proyek Data";
    }

    res.json({
      careerGoal: careerGoal,
      currentSkillsAssessment: mockAssessment,
      essentialSkillsToLearn: mockSkills,
      roadmap: steps,
      fallback: true
    });

  } catch (error: any) {
    console.error("Endpoint /api/skill-gap error:", error);
    res.status(500).json({ error: "Gagal memproses analisa skill gap. " + error.message });
  }
});


// ==========================================
// 4. FEATURE: LINKEDIN OPTIMIZER API (/api/linkedin-optimize)
// ==========================================
app.post("/api/linkedin-optimize", async (req, res) => {
  try {
    const { currentHeadline, currentSummary, targetRole } = req.body;
    
    if (!currentHeadline && !currentSummary) {
       res.status(400).json({ error: "Masukkan setidaknya Headline atau Summary saat ini." });
       return;
    }

    const role = targetRole || "Professional";
    const client = getGeminiClient();

    if (client) {
      const prompt = `Berikan penulisan ulang (rewrite) yang sangat profesional untuk profil LinkedIn mahasiswa / lulusan baru agar dilirik oleh recruiter industri.
Target Pekerjaan/Peran: "${role}"

Profil Saat Ini:
Headline: ${currentHeadline || "(kosong)"}
Summary: ${currentSummary || "(kosong)"}

Buat headline yang memuat formula ideal: [Nama Peran] | [Skill Utama/Spesialisasi] | [Value/Dampak Kerja/Pencapaian Mahasiswa].
Buat ringkasan (summary) yang menarik hati, memuat 3-4 paragraf singkat yang menjelaskan hasrat profesional, pencapaian/proyek utama, keahlian teknis (tools), serta panggilan ajakan bertindak (CTA/kontak).`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "Kamu adalah Spesialis Personal Branding dan Recruiter Indonesia professional. Berikan rekomendasi penulisan kreatif LinkedIn yang menarik, berwibawa, dan ramah SEO.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              originalHeadline: { type: Type.STRING },
              originalSummary: { type: Type.STRING },
              optimizedHeadline: { type: Type.STRING, description: "Headline LinkedIn baru yang persuasif dan mengandung kata kunci industri." },
              optimizedSummary: { type: Type.STRING, description: "Summary LinkedIn baru, minimal 100-150 kata, menggunakan narasi 'Saya' (first-person) yang bertenaga." },
              keyChanges: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "3 penjelasan mengapa revisi ini jauh lebih unggul dibanding draf sebelumnya." 
              },
              brandingTips: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "Daftar 3 tips melengkapi profil LinkedIn lainnya (seperti foto profil, Feature section, Activity)." 
              }
            },
            required: ["originalHeadline", "originalSummary", "optimizedHeadline", "optimizedSummary", "keyChanges", "brandingTips"]
          }
        }
      });

      const resultText = response.text;
      if (resultText) {
        const parsed = JSON.parse(resultText.trim());
        res.json({ ...parsed, fallback: false });
        return;
      }
    }

    // High Quality Fallback Mock responses
    const originalHeadlineClean = currentHeadline || "Mahasiswa Mencari Kerja";
    const originalSummaryClean = currentSummary || "Saya adalah lulusan baru yang bersemangat.";

    const mockOptimizedHeadline = `${role} Aspirant | Specializing in React.js & Web Solutions | Final Year Student passionate about crafting User-Centric Products`;
    
    const mockOptimizedSummary = `Saya adalah seorang mahasiswa tingkat akhir yang penuh energi dan berfokus pada pengembangan karier sebagai ${role}. Berbekal rasa ingin tahu yang tinggi, saya aktif mempelajari alat industri modern serta mengeksplorasi penyelesaian studi kasus praktis di sela-sela waktu studi saya.
    
Sepanjang perjalanan akademis, saya telah sukses menginisiasi beberapa proyek kolaboratif serta memimpin tim di organisasi kampus. Saya selalu senang menggabungkan kemampuan pemecahan masalah dengan komunikasi taktis yang efektif untuk melahirkan output yang rapi.

Keahlian Utama: Core Concept, Teamwork, Critical Thinking, MS Office/Figma.
📩 Hubungi saya di: email@domain.com untuk kesempatan berkolaborasi atau magang.`;

    res.json({
      originalHeadline: originalHeadlineClean,
      originalSummary: originalSummaryClean,
      optimizedHeadline: mockOptimizedHeadline,
      optimizedSummary: mockOptimizedSummary,
      keyChanges: [
        "Headline diubah dari sekadar mencari status lulusan pasif menjadi penegasan ekspertis dan ketertarikan aktif pada peran " + role + ".",
        "Summary diperkaya dengan narasi personal yang menarik (storytelling format), bukan hanya melampirkan daftar sifat generik.",
        "Menambahkan daftar keahlian taktis dan ajakan kolaborasi (CTA) yang jelas di akhir deskripsi profil."
      ],
      brandingTips: [
        "Pasang foto profil formal/semi-formal setengah badan dengan latar belakang warna netral cerah, dan aktifkan bingkai '#OpenToWork' jika dinilai perlu.",
        "Gunakan fitur 'Featured Section' untuk memajang sertifikasi kursus terbaik, file PDF resume ramah ATS Anda, atau tautan link portofolio aktif.",
        "Mulailah aktif mengomentari postingan para praktisi HRD di LinkedIn atau membagikan jurnal belajar mingguan Anda untuk mendongkrak algoritma pencarian profil."
      ],
      fallback: true
    });

  } catch (error: any) {
    console.error("Endpoint /api/linkedin-optimize error:", error);
    res.status(500).json({ error: "Gagal memproses optimasi LinkedIn. " + error.message });
  }
});


// ==========================================
// 5. FEATURE: CV GENERATOR REFINER API (/api/cv-polish)
// ==========================================
app.post("/api/cv-polish", async (req, res) => {
  try {
    const { rawText, sectionType, roleContext } = req.body;
    if (!rawText || rawText.trim() === "") {
      res.status(400).json({ error: "Konten teks untuk dipoles tidak boleh kosong." });
      return;
    }

    const type = sectionType || "general"; // summary, experience, project, skills
    const role = roleContext || "Professional";
    const client = getGeminiClient();

    if (client) {
      const prompt = `Poles dan sempurnakan kalimat draf CV Indonesia berikut agar berkelas dunia, berbobot, profesional, dan ramah sistem ATS.
Konteks Jabatan/Posisi: "${role}"
Bagian CV: "${type === "summary" ? "Ringkasan Profil (Professional Summary)" : type === "experience" ? "Pengalaman Kerja/Magang (Bullet Points)" : type === "project" ? "Deskripsi Proyek/Organisasi" : "Kompetensi/Keahlian"}"

Draf Kasar Teks:
"${rawText}"

Aturan Pemolesan:
1. Jika ini Ringkasan Profil, buat 1-2 paragraf ringkas yang bertenaga, menunjukkan dampak kerja, keahlian utama, dan antusiasme tinggi.
2. Jika ini Pengalaman Kerja atau Proyek, ubah menjadi bullet-points yang profesional dengan menggunakan kata kerja aktif yang kuat dan rumusan hasil (rumus STAR: Situation, Task, Action, Result) yang terukur jika memungkinkan.
3. Gunakan Bahasa Indonesia baku yang elegan, menghindari kalimat berulang, jargon tidak penting, atau kata sifat yang terlalu subjektif (seperti 'saya sangat pintar', ganti dengan bukti nyata).
4. Berikan hasil akhir teks yang dipolish dan 2-3 poin saran mengapa perubahan tersebut dilakukan.`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "Kamu adalah professional Career Coach, resume writer, dan mantan recruiter HRD top startup nasional yang mahir meramu kata-kata CV menjadi sangat memukau dan bernilai tinggi.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              polishedText: { type: Type.STRING, description: "Hasil akhir teks yang sudah dipoles rapi, siap disalin langsung ke CV." },
              explanation: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "2-3 poin catatan penjelasan taktis perbaikan yang dilakukan." 
              }
            },
            required: ["polishedText", "explanation"]
          }
        }
      });

      const resultText = response.text;
      if (resultText) {
        const parsed = JSON.parse(resultText.trim());
        res.json({ ...parsed, fallback: false });
        return;
      }
    }

    // High quality Indonesian fallback simulation
    let polishedText = "";
    let explanation: string[] = [];

    if (type === "summary") {
      polishedText = `Mahasiswa tingkat akhir berprestasi di bidang ${role} yang memiliki kombinasi keahlian teknis kuat dan pemecahan masalah (analytical thinking). Berpengalaman mengelola proyek akademik skala menengah, berkolaborasi dalam tim dinamis, serta mahir mengaplikasikan instrumen dan metodologi standar industri modern untuk menciptakan solusi yang efisien dan siap pakai.`;
      explanation = [
        "Menggubah bahasa kasual pasif menjadi kalimat pembuka yang asertif dan menonjolkan nilai siap kerja.",
        "Menambahkan kata kunci kapabilitas seperti 'analytical thinking' dan kolaborasi tim yang disukai recruiter."
      ];
    } else if (type === "experience") {
      polishedText = `• Memimpin tim kolaboratif untuk merancang dan mengeksekusi inisiatif proyek ${role}, menghasilkan peningkatan produktivitas tim sebesar 15% melalui optimalisasi alur komunikasi.\n• Menganalisis kebutuhan pengguna serta merumuskan integrasi solusi taktis dengan presisi tinggi, menghemat waktu pengerjaan manual sebesar 20%.\n• Menyusun dokumentasi teknis dan laporan komprehensif untuk memastikan kepatuhan standar kualitas di setiap fase operasional.`;
      explanation = [
        "Mengubah daftar tugas pasif ('menulis', 'mengerjakan') menjadi pencapaian aktif berbasis kata kerja kuat ('Memimpin', 'Menganalisis', 'Menyusun').",
        "Menyisipkan persentase atau metrik dampak fiktif namun realistis untuk memberikan efek verifikasi kualitatif."
      ];
    } else {
      polishedText = `• Berhasil merancang solusi ${role} yang fungsional dengan melakukan riset terstruktur, memvalidasi 5+ variabel kritis untuk akurasi data maksimum.\n• Berkolaborasi dalam pengerjaan proyek lintas disiplin, menyelesaikan milestone utama 5 hari lebih cepat dari tenggat waktu resmi.\n• Memanfaatkan teknologi dan perkakas standar industri untuk menyederhanakan alur kerja tim.`;
      explanation = [
        "Menyulap deskripsi proyek sederhana menjadi cerita pencapaian berbasis STAR yang padat.",
        "Mempersingkat kalimat yang bertele-tele dan menyisipkan indikator efisiensi waktu."
      ];
    }

    res.json({
      polishedText,
      explanation,
      fallback: true
    });

  } catch (error: any) {
    console.error("Endpoint /api/cv-polish error:", error);
    res.status(500).json({ error: "Gagal memoles teks CV. " + error.message });
  }
});


// ==========================================
// VITE DEV SERVER / PRODUCTION SERVING BOOT
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development Mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    // Use Vite middlewares for servicing client pages
    app.use(vite.middlewares);
    console.log("Vite development server linked as middleware.");
  } else {
    // Production serving static files in /dist
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving production bundle from /dist.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Career Assistant full-stack server is active on http://localhost:${PORT}`);
  });
}

// Do not spin up a blocking listener if we are running in Vercel serverless functions
if (!process.env.VERCEL) {
  startServer();
}

export default app;
