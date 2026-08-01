import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { CheckSquare, ChevronRight, Loader2, Sparkles, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { getSubjectBySlug } from "@/convex/ibData";

export default function Syllabus() {
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const userSubjects = useQuery(api.ib.getUserSubjects);
  const [selectedSubject, setSelectedSubject] = useState("");

  useEffect(() => { if (!authLoading && !isAuthenticated) navigate("/auth"); }, [authLoading, isAuthenticated, navigate]);
  if (authLoading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="animate-pulse text-primary text-2xl">⟳</div></div>;

  const subjects = userSubjects || [];
  const regularSubjects = subjects.filter((s) => s.level !== "EE" && s.level !== "TOK");

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-lg font-semibold tracking-tight"><span className="text-muted-foreground">$ </span><span className="text-primary">./syllabus --checklist</span><span className="terminal-cursor inline-block ml-1" /></h1>
        <p className="text-xs text-muted-foreground font-mono">View syllabus topics, track completion, and manage study progress per subject.</p>
      </div>

      {regularSubjects.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {regularSubjects.map((s) => (
            <button key={s._id} onClick={() => setSelectedSubject(s.subjectSlug)} className={cn("px-3 py-1.5 text-xs rounded-sm border transition-all flex items-center gap-2", selectedSubject === s.subjectSlug ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-muted-foreground")}>
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
              <span>{s.subjectDetails?.name || s.subjectSlug}</span>
              <span className="text-[10px] opacity-60">({s.level})</span>
            </button>
          ))}
        </div>
      )}

      {regularSubjects.length === 0 ? (
        <div className="border border-border rounded-sm p-8 text-center space-y-4">
          <CheckSquare className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="text-sm font-medium">No subjects configured</p>
          <p className="text-xs text-muted-foreground">Add subjects to see their syllabus breakdown.</p>
          <button onClick={() => navigate("/dashboard/subjects")} className="inline-flex items-center gap-2 px-4 py-1.5 text-sm border border-primary text-primary hover:bg-primary/10 transition-colors rounded-sm"><Sparkles size={14} />Configure subjects</button>
        </div>
      ) : !selectedSubject ? (
        <div className="border border-border rounded-sm p-8 text-center"><p className="text-sm text-muted-foreground">Select a subject above.</p></div>
      ) : <SyllabusView subjectSlug={selectedSubject} userSubjects={subjects} />}
    </div>
  );
}

function SyllabusView({ subjectSlug, userSubjects }: { subjectSlug: string; userSubjects: NonNullable<ReturnType<typeof useQuery<typeof api.ib.getUserSubjects>>> }) {
  const subjectInfo = getSubjectBySlug(subjectSlug);
  const userSubject = userSubjects.find((s) => s.subjectSlug === subjectSlug);
  const level = userSubject?.level === "HL" ? "HL" : "SL";

  const allTopics = useQuery(api.ib.getSyllabusTopics, { subjectSlug, level: level as "HL" | "SL" });
  const tasks = useQuery(api.ib.getUserTasks, { subjectSlug });
  const generateTasks = useMutation(api.ib.generateTasksFromSyllabus);
  const toggleTask = useMutation(api.ib.toggleTaskCompletion);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => { setGenerating(true); try { await generateTasks({ subjectSlug }); } catch {} setGenerating(false); };

  const subjectTasks = tasks?.filter((t) => t.subjectSlug === subjectSlug) || [];
  const totalMinutes = subjectTasks.reduce((s, t) => s + t.estimatedMinutes, 0);
  const completedMinutes = subjectTasks.filter((t) => t.completed).reduce((s, t) => s + t.estimatedMinutes, 0);

  return (
    <div className="space-y-4">
      <div className="border border-border rounded-sm p-4">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: userSubject?.color }} />
          <div>
            <h2 className="text-sm font-medium">{subjectInfo?.name || subjectSlug}</h2>
            <p className="text-[10px] text-muted-foreground">{level === "HL" ? "Higher Level (240h)" : "Standard Level (150h)"} | Group {subjectInfo?.group}</p>
          </div>
        </div>
        {subjectTasks.length > 0 && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Progress: {subjectTasks.filter((t) => t.completed).length} / {subjectTasks.length} topics</span>
              <span>{Math.round(completedMinutes / 60)}h / {Math.round(totalMinutes / 60)}h</span>
            </div>
            <div className="h-1.5 bg-secondary rounded-sm overflow-hidden">
              <div className="h-full bg-primary rounded-sm transition-all duration-500" style={{ width: `${totalMinutes > 0 ? Math.round((completedMinutes / totalMinutes) * 100) : 0}%` }} />
            </div>
          </div>
        )}
      </div>

      {allTopics && allTopics.length > 0 && subjectTasks.length === 0 && (
        <div className="border border-border rounded-sm p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Syllabus data available</p>
              <p className="text-xs text-muted-foreground mt-0.5">{allTopics.length} topic(s) · {allTopics.reduce((s, t) => s + t.subtopics.length, 0)} sub-topics</p>
            </div>
            <button onClick={handleGenerate} disabled={generating} className="px-3 py-1.5 text-xs border border-primary text-primary hover:bg-primary/10 transition-colors rounded-sm flex items-center gap-2 disabled:opacity-50">
              {generating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}Generate checklist
            </button>
          </div>
          <div className="space-y-2">
            {allTopics.map((topic, i) => (
              <details key={i} className="group">
                <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors flex items-center gap-2">
                  <ChevronRight size={12} className="group-open:rotate-90 transition-transform" />
                  <span className="font-mono text-primary">{topic.topicNumber}</span>
                  <span>{topic.topicName}</span>
                  <span className="ml-auto text-[10px]">{topic.totalHours}h</span>
                </summary>
                <div className="ml-6 mt-1 space-y-1">
                  {topic.subtopics.map((st, j) => (
                    <div key={j} className="text-[11px] text-muted-foreground flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-muted-foreground shrink-0" />
                      <span>{st.name}</span><span className="ml-auto text-[10px]">{st.hours}h</span>
                    </div>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </div>
      )}

      {(!allTopics || allTopics.length === 0) && subjectTasks.length === 0 && (
        <div className="border border-border rounded-sm p-8 text-center"><p className="text-sm text-muted-foreground">No syllabus data available for this subject.</p></div>
      )}

      {subjectTasks.length > 0 && (
        <div className="border border-border rounded-sm">
          <div className="border-b border-border px-4 py-2 flex items-center justify-between">
            <h3 className="text-sm font-medium flex items-center gap-2"><CheckSquare size={14} className="text-primary" />Study Checklist</h3>
            <span className="text-xs text-muted-foreground">{Math.round(completedMinutes)}min / {Math.round(totalMinutes)}min</span>
          </div>
          <div className="divide-y divide-border">
            {subjectTasks.map((task) => (
              <div key={task._id} className={cn("px-4 py-2.5 flex items-center gap-3 group hover:bg-accent/20 transition-colors", task.completed && "opacity-60")}>
                <button onClick={() => toggleTask({ taskId: task._id, completed: !task.completed })} className={cn("w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 transition-all", task.completed ? "bg-primary border-primary" : "border-border hover:border-primary")}>
                  {task.completed && <CheckSquare size={12} className="text-primary-foreground" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={cn("text-xs", task.completed && "line-through text-muted-foreground")}>{task.description || task.subtopicName}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">Topic {task.topicNumber} · {task.subtopicName}</p>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground shrink-0"><Clock size={10} /><span>{task.estimatedMinutes}m</span></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {subjectTasks.length > 0 && <div className="border border-border/50 rounded-sm px-4 py-2 bg-secondary/30 flex justify-between text-xs"><span className="text-muted-foreground">Total estimated time</span><span className="text-primary font-medium">{Math.round(totalMinutes / 60)}h {Math.round(totalMinutes % 60)}m</span></div>}
    </div>
  );
}
