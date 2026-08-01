import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Clock, Play, Pause, RotateCcw, StopCircle, Timer, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

type TimerState = "idle" | "running" | "paused";

export default function StudyTimer() {
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const userSubjects = useQuery(api.ib.getUserSubjects);
  const tasksQuery = useQuery(api.ib.getUserTasks, {});
  const recordSession = useMutation(api.ib.recordStudySession);

  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTask, setSelectedTask] = useState<Id<"studyTasks"> | "">("");
  const [timerState, setTimerState] = useState<TimerState>("idle");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [manualMinutes, setManualMinutes] = useState("");
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => { if (!authLoading && !isAuthenticated) navigate("/auth"); }, [authLoading, isAuthenticated, navigate]);
  useEffect(() => { return () => { if (intervalRef.current) clearInterval(intervalRef.current); }; }, []);

  const subjects = userSubjects || [];
  const allTasks = tasksQuery || [];
  const subjectTasks = allTasks.filter((t) => t.subjectSlug === selectedSubject && !t.completed);

  const start = () => { setTimerState("running"); setSaved(false); intervalRef.current = setInterval(() => setElapsedSeconds((p) => p + 1), 1000); };
  const pause = () => { setTimerState("paused"); if (intervalRef.current) clearInterval(intervalRef.current); };
  const resume = () => { setTimerState("running"); intervalRef.current = setInterval(() => setElapsedSeconds((p) => p + 1), 1000); };
  const stop = () => { setTimerState("idle"); if (intervalRef.current) clearInterval(intervalRef.current); intervalRef.current = null; };
  const reset = () => { stop(); setElapsedSeconds(0); setSaved(false); };

  const fmt = (s: number) => `${String(Math.floor(s / 3600)).padStart(2, "0")}:${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const handleSave = async () => {
    const dur = manualMinutes ? parseInt(manualMinutes) : Math.round(elapsedSeconds / 60);
    if (dur < 1) return;
    try {
      await recordSession({
        subjectSlug: selectedSubject,
        taskId: selectedTask || undefined,
        durationMinutes: dur,
        notes: notes || undefined,
      });
      setSaved(true); reset(); setManualMinutes(""); setNotes(""); setTimeout(() => setSaved(false), 2000);
    } catch {}
  };

  if (authLoading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="animate-pulse text-primary text-2xl">⟳</div></div>;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-lg font-semibold tracking-tight"><span className="text-muted-foreground">$ </span><span className="text-primary">./study --timer</span><span className="terminal-cursor inline-block ml-1" /></h1>
        <p className="text-xs text-muted-foreground font-mono">Track sessions with the timer or log exact minutes manually — no rounding needed.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 space-y-4">
          <div className="border border-border rounded-sm p-6 text-center space-y-4">
            <div className="text-5xl md:text-6xl font-mono font-bold tracking-widest text-primary tabular-nums">{fmt(elapsedSeconds)}</div>
            <div className="flex justify-center gap-2">
              {timerState === "idle" && <button onClick={start} disabled={!selectedSubject} className="px-6 py-2 border border-primary text-primary hover:bg-primary/10 rounded-sm flex items-center gap-2 text-sm disabled:opacity-30"><Play size={16} />Start</button>}
              {timerState === "running" && <><button onClick={pause} className="px-4 py-2 border border-amber-500 text-amber-500 hover:bg-amber-500/10 rounded-sm flex items-center gap-2 text-sm"><Pause size={16} />Pause</button><button onClick={stop} className="px-4 py-2 border border-destructive text-destructive hover:bg-destructive/10 rounded-sm flex items-center gap-2 text-sm"><StopCircle size={16} />Stop</button></>}
              {timerState === "paused" && <><button onClick={resume} className="px-4 py-2 border border-primary text-primary hover:bg-primary/10 rounded-sm flex items-center gap-2 text-sm"><Play size={16} />Resume</button><button onClick={stop} className="px-4 py-2 border border-destructive text-destructive hover:bg-destructive/10 rounded-sm flex items-center gap-2 text-sm"><StopCircle size={16} />Stop</button></>}
              <button onClick={reset} disabled={timerState === "running"} className="px-4 py-2 border border-border text-muted-foreground hover:text-foreground rounded-sm flex items-center gap-2 text-sm disabled:opacity-30"><RotateCcw size={16} />Reset</button>
            </div>
          </div>

          <div className="border border-border rounded-sm p-4 space-y-3">
            <h3 className="text-xs font-medium flex items-center gap-2"><Timer size={14} className="text-primary" />Manual Time Entry</h3>
            <p className="text-[10px] text-muted-foreground">For uneven durations (e.g. 20 min), enter exact minutes below.</p>
            <div className="flex items-center gap-2">
              <input type="number" min="1" max="600" value={manualMinutes} onChange={(e) => setManualMinutes(e.target.value)} placeholder="Exact minutes (e.g. 20)" className="flex-1 px-3 py-1.5 text-sm bg-transparent border border-border rounded-sm focus:border-primary focus:outline-none font-mono" />
              <span className="text-xs text-muted-foreground font-mono">min</span>
            </div>
          </div>

          <div className="border border-border rounded-sm p-4 space-y-3">
            <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Session notes (optional)" className="w-full px-3 py-1.5 text-xs bg-transparent border border-border rounded-sm focus:border-primary focus:outline-none" />
            <div className="flex items-center gap-2">
              <button onClick={handleSave} disabled={!selectedSubject || (elapsedSeconds === 0 && !manualMinutes)} className="px-4 py-1.5 text-xs border border-primary text-primary hover:bg-primary/10 rounded-sm disabled:opacity-30 flex items-center gap-2">{saved ? "✓ Saved" : "Save Session"}</button>
              {saved && <span className="text-[10px] text-green-400">Study session recorded.</span>}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-3">
          <div className="border border-border rounded-sm p-3">
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 block">Subject</label>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {subjects.filter((s) => s.level !== "EE" && s.level !== "TOK").map((s) => (
                <button key={s._id} onClick={() => { setSelectedSubject(s.subjectSlug); setSelectedTask(""); }} className={cn("w-full px-2 py-1.5 text-xs rounded-sm border transition-all text-left flex items-center gap-2", selectedSubject === s.subjectSlug ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-muted-foreground")}>
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                  <span>{s.subjectDetails?.name || s.subjectSlug}</span>
                  <span className="text-[10px] opacity-60 ml-auto">{s.level}</span>
                </button>
              ))}
            </div>
          </div>

          {selectedSubject && <div className="border border-border rounded-sm p-3">
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 block">Task (optional)</label>
            {subjectTasks.length === 0 ? <p className="text-[10px] text-muted-foreground">No pending tasks. Generate from Syllabus page.</p> : (
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {subjectTasks.map((task) => (
                  <button key={task._id} onClick={() => setSelectedTask(task._id)} className={cn("w-full px-2 py-1.5 text-[11px] rounded-sm border transition-all text-left", selectedTask === task._id ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-muted-foreground")}>
                    <div className="flex items-center justify-between gap-2"><span className="truncate">{task.description}</span><span className="text-[10px] shrink-0">{task.estimatedMinutes}m</span></div>
                    <div className="text-[10px] text-muted-foreground/70">Topic {task.topicNumber} · {task.subtopicName}</div>
                  </button>
                ))}
              </div>
            )}
          </div>}

          {subjects.length === 0 && <div className="border border-border rounded-sm p-4 text-center"><BookOpen size={20} className="mx-auto text-muted-foreground mb-2" /><p className="text-xs text-muted-foreground">No subjects configured.</p><button onClick={() => navigate("/dashboard/subjects")} className="mt-2 text-xs text-primary underline">Add subjects</button></div>}
        </div>
      </div>
    </div>
  );
}
