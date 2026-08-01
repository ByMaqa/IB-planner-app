import { motion } from "framer-motion";
import { BookOpen, CheckSquare, Clock, ArrowRight, Terminal, Sparkles } from "lucide-react";
import { useNavigate } from "react-router";
import logo from "@/assets/logo.svg";

const features = [
  { icon: BookOpen, title: "subject-selector", desc: "Choose subjects by group with cascading selectors. Add EE and TOK with custom colors." },
  { icon: CheckSquare, title: "syllabus-checklist", desc: "Pre-built syllabus topics with hour estimates. Check off completed subtopics." },
  { icon: Clock, title: "study-timer", desc: "Track sessions with a precision timer or enter exact minutes manually." },
];

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col crt">
      <div className="h-1 bg-primary w-full" />
      <nav className="border-b border-border px-4 md:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} alt="IB Planner" width={28} height={28} className="rounded" />
          <span className="text-sm font-mono font-semibold">ib-planner <span className="text-muted-foreground">v1.0</span></span>
        </div>
        <button onClick={() => navigate("/auth")} className="px-3 py-1.5 text-xs border border-primary text-primary hover:bg-primary/10 transition-colors rounded-sm">$ sign_in</button>
      </nav>

      <section className="flex-1 flex flex-col items-center justify-center px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-block">
            <div className="border border-border rounded-sm px-4 py-2 bg-secondary/50 inline-flex items-center gap-2 text-xs font-mono">
              <Terminal size={14} className="text-primary" />
              <span className="text-muted-foreground">~$</span>
              <span className="text-primary">ib-planner --launch</span>
              <span className="animate-pulse">▌</span>
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-3xl md:text-5xl font-mono font-bold tracking-tight">
            <span className="text-muted-foreground">./</span><span className="text-primary">IB</span><span className="text-foreground">Planner</span><span className="terminal-cursor ml-1 inline-block" />
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="text-sm md:text-base text-muted-foreground font-mono max-w-xl mx-auto leading-relaxed">
            A terminal-themed study planner for IB Diploma students. Track subjects, syllabus topics, and study time — all from the command line.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }} className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button onClick={() => navigate("/auth")} className="px-6 py-2.5 text-sm font-mono bg-primary text-primary-foreground hover:opacity-90 transition-all rounded-sm flex items-center gap-2"><Sparkles size={16} />$ get_started <ArrowRight size={16} /></button>
            <button onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })} className="px-6 py-2.5 text-sm font-mono border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-all rounded-sm">$ man features</button>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.8 }} className="grid grid-cols-3 gap-3 max-w-md mx-auto pt-8">
            {[{ label: "subjects", value: "33+" }, { label: "groups", value: "6" }, { label: "tools", value: "5" }].map((s) => (
              <div key={s.label} className="border border-border rounded-sm p-2 text-center">
                <p className="text-lg font-mono font-bold text-primary">{s.value}</p>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="features" className="border-t border-border px-4 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-mono text-primary mb-2">$ ls features/</p>
            <h2 className="text-xl md:text-2xl font-mono font-semibold">Everything you need to <span className="text-primary">ace the IB</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {features.map((f) => (
              <div key={f.title} className="border border-border rounded-sm p-4 hover:border-primary/50 transition-all duration-200 hover:bg-accent/10 group">
                <f.icon size={20} className="text-muted-foreground group-hover:text-primary transition-colors mb-3" />
                <h3 className="text-sm font-mono font-medium mb-1">$ {f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 border border-border rounded-sm overflow-hidden">
            <div className="bg-secondary/50 px-4 py-2 border-b border-border text-xs font-mono text-muted-foreground">$ cat README.md</div>
            <div className="p-4 text-xs font-mono text-muted-foreground space-y-2 leading-relaxed">
              <p><span className="text-primary font-medium">##</span> Features</p>
              <p><span className="text-primary">$</span> subject-selector — Group-based cascading with color-coded labels</p>
              <p><span className="text-primary">$</span> syllabus-manager — Built-in topic data with hourly estimates</p>
              <p><span className="text-primary">$</span> study-timer — Session timer + manual minute entry</p>
              <p><span className="text-primary">$</span> dashboard — Real-time stats, progress bars, quick navigation</p>
              <p><span className="text-primary">$</span> terminal-theme — Monospace, CRT scanlines, green accents</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border px-4 py-12">
        <div className="max-w-xl mx-auto text-center space-y-4">
          <p className="text-sm font-mono text-muted-foreground">$ echo "Ready to start?"</p>
          <button onClick={() => navigate("/auth")} className="px-6 py-2.5 text-sm font-mono bg-primary text-primary-foreground hover:opacity-90 transition-all rounded-sm inline-flex items-center gap-2"><Terminal size={16} />$ sign_up --free</button>
          <p className="text-[10px] text-muted-foreground font-mono">No email required. Guest login available.</p>
        </div>
      </section>

      <footer className="border-t border-border px-4 py-4 text-center text-[10px] text-muted-foreground font-mono">
        <p>ib-planner v1.0.0 — built for IB Diploma students — <a href="https://freebuff.com" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:opacity-80">freebuff.com</a></p>
      </footer>
    </div>
  );
}
