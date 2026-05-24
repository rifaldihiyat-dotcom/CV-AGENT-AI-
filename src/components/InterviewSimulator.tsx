import { useState, useRef, useEffect } from "react";
import { Send, Mic, MicOff, MessageSquare, Briefcase, RefreshCw, Sparkles, Compass } from "lucide-react";
import { InterviewMessage } from "../types";

export default function InterviewSimulator() {
  const [messages, setMessages] = useState<InterviewMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [position, setPosition] = useState("Software Engineer Intern");
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [interviewer, setInterviewer] = useState({
    name: "Diana (Tech Recruiter)",
    role: "Senior HR Specialist",
    avatarBg: "bg-sky-100 text-sky-700"
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Start with a greet bubble
  const startSimulation = async () => {
    setMessages([]);
    setLoading(true);
    try {
      const response = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [],
          targetPosition: position,
          currentMessage: "Halo! Saya siap memulai wawancara kerja simulasi."
        })
      });
      const data = await response.json();
      setMessages([
        {
          id: "greet",
          sender: "ai",
          text: data.reply,
          timestamp: new Date().toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      setMessages([
        {
          id: "err",
          sender: "ai",
          text: "Halo! Selamat datang di simulasi wawancara. Silakan atur posisi yang Anda inginkan lalu tulis tanggapan awal Anda di bawah untuk kita mulai.",
          timestamp: new Date().toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    startSimulation();
  }, [position, interviewer]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg: InterviewMessage = {
      id: Math.random().toString(),
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInputText("");
    setLoading(true);

    try {
      const response = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messages, // Send history
          targetPosition: position,
          currentMessage: textToSend
        })
      });

      const data = await response.json();
      
      const aiMsg: InterviewMessage = {
        id: Math.random().toString(),
        sender: "ai",
        text: data.reply,
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      const aiMsg: InterviewMessage = {
        id: Math.random().toString(),
        sender: "ai",
        text: "Koneksi terputus. Namun secara umum, jawaban Anda sudah mengarah pada struktur star. Bisa ulangi atau coba kembali?",
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setLoading(false);
    }
  };

  // Simulated Voice Input logic
  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Mock dictation after 3 seconds
      setTimeout(() => {
        const dicitations = [
          "Saya memiliki latar belakang akademis Teknik Informatika dan menguasai konsep pemrograman web React.",
          "Tantangan terbesar saya adalah mengelola waktu saat UAS berbarengan dengan pengerjaan proyek event kampus.",
          "Saya terbiasa menetapkan skala prioritas utama menggunakan Google Calendar dan aplikasi manajemen tugas Trello.",
          "Untuk kisaran kompensasi, saya terbuka berdiskusi menyesuaikan standar UMR dan benefit magang perusahaan Anda."
        ];
        const randomText = dicitations[Math.floor(Math.random() * dicitations.length)];
        setInputText(prev => (prev ? prev + " " + randomText : randomText));
        setIsRecording(false);
      }, 3000);
    } else {
      setIsRecording(false);
    }
  };

  const hrPersonas = [
    { name: "Diana (Tech Recruiter)", role: "Senior HR Specialist", avatarBg: "bg-sky-100 text-sky-700" },
    { name: "Pak Adrian (General HRD)", role: "VP of People Operations", avatarBg: "bg-emerald-100 text-emerald-700" },
    { name: "Sasa (StartUp Recruiter)", role: "Talent Acquisition Associate", avatarBg: "bg-purple-100 text-purple-700" }
  ];

  // Suggestion answers for fast test
  const suggestions = [
    "Saya adalah mahasiswa semester 6 yang aktif dalam riset teknologi.",
    "Saya siap menghadapi tantangan dan cepat beradaptasi dengan stack baru.",
    "Saya ingin melamar posisi magang ini untuk menerapkan ilmu perkuliahan."
  ];

  return (
    <div id="interview-simulator" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      {/* SEKTOR KIRI - CONFIG PANEL */}
      <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-[0_10px_35px_-4px_rgba(30,41,59,0.07),0_4px_12px_-2px_rgba(30,41,59,0.04)] flex flex-col justify-between">
        <div>
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-800">Ruang Wawancara Simulasi</h3>
            <p className="text-xs text-slate-500 leading-relaxed mt-1">
              Latih keberanian dan kemampuan retorika Anda berbalas argumen dengan asisten HR virtual. Dapatkan feedback instan mengenai kelemahan jawaban Anda.
            </p>
          </div>

          {/* Target Role Selector */}
          <div className="space-y-4">
            <div>
              <label htmlFor="position-input" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Posisi Pekerjaan Target:
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  id="position-input"
                  type="text"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full text-sm border border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-200 outline-hidden bg-slate-50/50 pl-9 pr-4 py-2.5 rounded-xl transition"
                  placeholder="Contoh: Digital Marketer, Analyst..."
                />
              </div>
            </div>

            {/* Recruiter Persona Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Pilih Pewawancara (Persona):
              </label>
              <div className="space-y-2.5">
                {hrPersonas.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setInterviewer(p)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center gap-3 cursor-pointer ${
                      interviewer.name === p.name 
                        ? "border-sky-400 bg-sky-50/50" 
                        : "border-slate-205 border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl ${p.avatarBg} flex items-center justify-center font-bold text-xs shrink-0`}>
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-700">{p.name}</h4>
                      <p className="text-[10px] text-slate-400">{p.role}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Info panel below */}
        <div className="mt-8 bg-slate-50 border border-slate-250 p-4 rounded-xl">
          <h4 className="font-bold text-xs text-slate-700 flex items-center gap-1.5 mb-1">
            <Compass className="w-3.5 h-3.5 text-slate-500" />
            Tips Menjawab dengan STAR:
          </h4>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Struktur jawaban Anda dengan menceritakan <strong>S</strong>ituation (Situasi), <strong>T</strong>ask (Tugas), <strong>A</strong>ction (Aksi Anda), dan <strong>R</strong>esult (Hasil numerik konkret).
          </p>
        </div>
      </div>

      {/* SEKTOR KANAN - INTERACTIVE CHAT ENGINE */}
      <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 flex flex-col h-[580px] overflow-hidden shadow-[0_10px_35px_-4px_rgba(30,41,59,0.07),0_4px_12px_-2px_rgba(30,41,59,0.04)]">
        {/* Chat Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl ${interviewer.avatarBg} flex items-center justify-center font-bold text-xs`}>
              {interviewer.name.charAt(0)}
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">{interviewer.name}</h4>
              <p className="text-[10px] text-emerald-600 font-semibold">• Sesi Wawancara {position}</p>
            </div>
          </div>
          <button
            type="button"
            id="reset-interview-btn"
            onClick={startSimulation}
            className="text-xs flex items-center gap-1.5 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200/70 px-3 py-1.5 rounded-xl transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Mulai Ulang Sesi</span>
          </button>
        </div>

        {/* Chat Bubbles Scroll View */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start animate-fade-in"}`}
            >
              <div 
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  msg.sender === "user" 
                    ? "bg-slate-800 text-white rounded-tr-none shadow-xs" 
                    : "bg-white text-slate-700 border border-slate-200 rounded-tl-none shadow-xs"
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
              </div>
              <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs bg-white px-4 py-2.5 rounded-2xl border border-slate-200 w-fit rounded-tl-none shadow-xs animate-pulse">
              <span className="flex space-x-1">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </span>
              <span>{interviewer.name} sedang mencerna jawaban...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Suggestion Quick Chips */}
        <div className="bg-white/65 border-t border-slate-200 px-6 py-2 pb-0 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
          {suggestions.map((sug, i) => (
            <button
              key={i}
              type="button"
              id={`quick-reply-${i}`}
              onClick={() => handleSendMessage(sug)}
              className="text-[10px] bg-sky-50 hover:bg-sky-100 text-sky-800/80 border border-sky-200 rounded-lg px-2.5 py-1.5 transition whitespace-nowrap shrink-0 cursor-pointer"
            >
              🚀 {sug}
            </button>
          ))}
        </div>

        {/* Main Typing Control Input */}
        <div className="bg-white border-t border-slate-200 p-4">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* STT dictation Mic widget */}
            <button
              type="button"
              id="mic-btn"
              onClick={toggleRecording}
              className={`p-2.5 rounded-xl transition duration-200 shrink-0 cursor-pointer flex items-center justify-center ${
                isRecording 
                  ? "bg-red-500 text-white animate-pulse" 
                  : "bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800"
              }`}
              title={isRecording ? "Mendeteksi ucapan (klik untuk matikan)..." : "Gunakan simulasi input suara"}
            >
              {isRecording ? <MicOff className="w-4.5 h-4.5" /> : <Mic className="w-4.5 h-4.5" />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isRecording ? "Sedang merekam suara simulasi..." : "Ketik respon atau jawaban wawancara kerja Anda..."}
              disabled={isRecording}
              className="flex-1 text-xs border border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-200 outline-hidden bg-slate-50/40 px-4 py-2.5 rounded-xl transition"
            />

            <button
               type="submit"
               id="send-msg-btn"
               disabled={!inputText.trim() && !isRecording}
               className="p-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white disabled:text-slate-400 rounded-xl transition duration-150 shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {isRecording && (
            <div className="flex items-center justify-center gap-1.5 pt-2 text-[10px] font-mono text-red-500 animate-pulse">
              <span>● REC WAVEFORM SIMULATOR:</span>
              <span className="w-1.5 h-3 bg-red-400 rounded-full animate-bounce-slow"></span>
              <span className="w-1.5 h-5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '100ms' }}></span>
              <span className="w-1.5 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></span>
              <span className="w-1.5 h-4 bg-red-500 rounded-full animate-bounce-slow"></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
