import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { BookOpen, Plus, Trash2, Check, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { IB_GROUPS, IB_SUBJECTS, getSubjectBySlug } from "@/convex/ibData";
import type { SubjectLevel } from "@/convex/schema";

const SUBJECT_COLORS = ["#00ff41","#39ff14","#7fff00","#ffb000","#ff8c00","#00bfff","#1e90ff","#9370db","#ff69b4","#ff1493","#ffd700","#ff5722","#48d1cc","#32cd32","#adff2f"];

const LEVEL_OPTIONS: { value: SubjectLevel; label: string; desc: string }[] = [
  { value: "HL", label: "HL", desc: "Higher Level (240h)" },
  { value: "SL", label: "SL", desc: "Standard Level (150h)" },
  { value: "EE", label: "EE", desc: "Extended Essay (40h)" },
  { value: "TOK", label: "TOK", desc: "Theory of Knowledge (100h)" },
];

export default function Subjects() {
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const userSubjects = useQuery(api.ib.getUserSubjects);
  const addSubject = useMutation(api.ib.addUserSubject);
  const removeSubject = useMutation(api.ib.removeUserSubject);
  const updateColor = useMutation(api.ib.updateSubjectColor);

  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<SubjectLevel>("SL");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => { if (!authLoading && !isAuthenticated) navigate("/auth"); }, [authLoading, isAuthenticated, navigate]);

  const filteredSubjects = selectedGroup ? IB_SUBJECTS.filter((s) => s.group === selectedGroup) : [];
  const subjectInfo = selectedSubject ? getSubjectBySlug(selectedSubject) : null;

  const handleAdd = async () => {
    if (!selectedSubject) { setError("Please select a subject"); return; }
    if (selectedLevel === "EE" && subjectInfo && !subjectInfo.canBeEE) { setError("This subject cannot be chosen for EE"); return; }
    if (selectedLevel === "HL" && subjectInfo && !subjectInfo.hasHL) { setError("Not offered at HL"); return; }
    if (selectedLevel === "SL" && subjectInfo && !subjectInfo.hasSL) { setError("Not offered at SL"); return; }
    try {
      setError(null);
      const usedColors = (userSubjects || []).map((s) => s.color);
      const color = SUBJECT_COLORS.find((c) => !usedColors.includes(c)) || `#${Math.floor(Math.random()*0xffffff).toString(16).padStart(6,"0")}`;
      await addSubject({ subjectSlug: selectedSubject, level: selectedLevel, color });
      setSuccess(`${subjectInfo?.name} (${selectedLevel}) added`); setTimeout(() => setSuccess(null), 2000);
    } catch (err) { setError(err instanceof Error ? err.message : "Failed"); }
  };

  if (authLoading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="animate-pulse text-primary text-2xl">⟳</div></div>;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-lg font-semibold tracking-tight"><span className="text-muted-foreground">$ </span><span className="text-primary">./configure-subjects</span><span className="terminal-cursor inline-block ml-1" /></h1>
        <p className="text-xs text-muted-foreground font-mono">Select your IB subjects to generate your study plan. Add everything including EE and TOK.</p>
      </div>

      {error && <div className="flex items-center gap-2 text-xs text-red-400 border border-red-400/30 rounded-sm px-3 py-2 bg-red-400/5"><AlertTriangle size={14} /><span>Error: {error}</span></div>}
      {success && <div className="flex items-center gap-2 text-xs text-green-400 border border-green-400/30 rounded-sm px-3 py-2 bg-green-400/5"><Check size={14} /><span>{success}</span></div>}

      <div className="border border-border rounded-sm p-4 space-y-4">
        <h2 className="text-sm font-medium flex items-center gap-2"><Plus size={14} className="text-primary" />Add Subject</h2>

        <div>
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 block">Step 1: Select Group</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-1.5">
            {IB_GROUPS.map((g) => (
              <button key={g.number} onClick={() => { setSelectedGroup(g.number); setSelectedSubject(""); setError(null); }}
                className={cn("px-2 py-1.5 text-xs rounded-sm border transition-all text-left font-mono", selectedGroup === g.number ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-muted-foreground")}>
                <span className="font-mono">G{g.number}</span><br /><span className="text-[10px] opacity-80">{g.name}</span>
              </button>
            ))}
          </div>
        </div>

        {selectedGroup && <div>
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 block">Step 2: Select Subject</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
            {filteredSubjects.map((subject) => (
              <button key={subject.slug} onClick={() => { setSelectedSubject(subject.slug); setError(null); }}
                className={cn("px-3 py-2 text-xs rounded-sm border transition-all text-left", selectedSubject === subject.slug ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-muted-foreground")}>
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: subject.color }} /><span className="font-medium">{subject.name}</span></div>
                <div className="text-[10px] mt-0.5 text-muted-foreground/70 ml-4">{[subject.hasHL && "HL", subject.hasSL && "SL", subject.canBeEE && "EE eligible"].filter(Boolean).join(" · ")}</div>
              </button>
            ))}
          </div>
        </div>}

        {selectedSubject && <div>
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 block">Step 3: Select Level</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {LEVEL_OPTIONS.filter((o) => !(o.value === "EE" && subjectInfo && !subjectInfo.canBeEE)).filter((o) => !(o.value === "HL" && subjectInfo && !subjectInfo.hasHL)).filter((o) => !(o.value === "SL" && subjectInfo && !subjectInfo.hasSL)).map((opt) => (
              <button key={opt.value} onClick={() => setSelectedLevel(opt.value)}
                className={cn("px-3 py-2 text-xs rounded-sm border transition-all text-left", selectedLevel === opt.value ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-muted-foreground")}>
                <span className="font-medium">{opt.label}</span><br /><span className="text-[10px] text-muted-foreground/70">{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>}

        {selectedSubject && <button onClick={handleAdd} className="w-full px-4 py-2 text-sm border border-primary text-primary hover:bg-primary/10 transition-colors rounded-sm flex items-center justify-center gap-2"><Plus size={14} />Add {subjectInfo?.name} ({selectedLevel})</button>}
      </div>

      <div className="border border-border rounded-sm">
        <div className="border-b border-border px-4 py-2 flex items-center justify-between">
          <h2 className="text-sm font-medium flex items-center gap-2"><BookOpen size={14} className="text-primary" />Your Subjects</h2>
          <span className="text-xs text-muted-foreground">{(userSubjects || []).length} selected</span>
        </div>
        {!userSubjects || userSubjects.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground">No subjects selected yet.</div>
        ) : (
          <div className="divide-y divide-border">
            {userSubjects.map((us) => (
              <div key={us._id} className="px-4 py-3 flex items-center justify-between group hover:bg-accent/30 transition-colors">
                <div className="flex items-center gap-3">
                  <input type="color" value={us.color} onChange={(e) => updateColor({ id: us._id, color: e.target.value })} className="w-5 h-5 rounded-sm border border-border cursor-pointer bg-transparent" />
                  <div>
                    <p className="text-sm">{us.subjectDetails?.name || us.subjectSlug}</p>
                    <div className="flex items-center gap-2">
                      <span className={cn("text-[10px] px-1.5 py-0.5 rounded-sm font-mono", us.level === "HL" ? "bg-blue-500/20 text-blue-400" : us.level === "SL" ? "bg-green-500/20 text-green-400" : us.level === "EE" ? "bg-purple-500/20 text-purple-400" : "bg-amber-500/20 text-amber-400")}>{us.level}</span>
                      {us.level !== "EE" && us.level !== "TOK" && <span className="text-[10px] text-muted-foreground">{us.level === "HL" ? "240h" : "150h"}</span>}
                      <span className="text-[10px] text-muted-foreground">G{us.subjectDetails?.group}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => removeSubject({ id: us._id })} className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100" title="Remove"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border border-border/50 rounded-sm px-4 py-3 bg-secondary/30">
        <p className="text-[10px] text-muted-foreground leading-relaxed"><span className="text-primary font-medium">Tip:</span> Select 6 subjects (3 HL + 3 SL) for full IB Diploma. EE and TOK are core. Click the color swatch to customize.</p>
      </div>
    </div>
  );
}
