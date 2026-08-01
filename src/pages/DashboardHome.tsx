import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { BookOpen, CheckSquare, Clock, TrendingUp, Sparkles, Terminal } from "lucide-react";
import { LucideIcon } from "lucide-react";

export default function DashboardHome() {
  const { isLoading: authLoading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const seedData = useMutation(api.ib.seedIBData);
  const stats = useQuery(api.ib.getDashboardStats);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) navigate("/auth");
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => { if (isAuthenticated) seedData(); }, [isAuthenticated, seedData]);

  if (authLoading || !stats) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="animate-pulse text-primary text-2xl">⟳</div>
        <p className="text-sm text-muted-foreground font-mono">Loading system...</p>
      </div>
    </div>
  );

  const remainingHours = Math.round(stats.remainingMinutes / 60);
  const studiedHours = Math.round(stats.totalStudyMinutes / 60);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-lg font-semibold tracking-tight">
          <span className="text-muted-foreground">$ </span>
          <span className="text-primary">./dashboard</span>
          <span className="terminal-cursor inline-block ml-1" />
        </h1>
        <p className="text-xs text-muted-foreground font-mono">
          Welcome{user?.name ? `, ${user.name}` : ""}. {stats.totalSubjects === 0
            ? "No subjects configured yet. Navigate to subjects/ to set up your IB courses."
            : `${stats.totalSubjects} subject(s) loaded. ${stats.completionRate}% syllabus completion rate.`}
        </p>
      </div>

      {stats.totalSubjects === 0 ? (
        <div className="border border-border rounded-sm p-8 text-center space-y-4">
          <Terminal className="mx-auto h-10 w-10 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">No subjects configured</p>
            <p className="text-xs text-muted-foreground mt-1">Start by selecting your IB subjects to generate your study plan.</p>
          </div>
          <button onClick={() => navigate("/dashboard/subjects")} className="inline-flex items-center gap-2 px-4 py-1.5 text-sm border border-primary text-primary hover:bg-primary/10 transition-colors rounded-sm">
            <Sparkles size={14} /> Configure subjects
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard icon={BookOpen} label="Subjects" value={stats.totalSubjects.toString()} sub="Selected" />
            <StatCard icon={CheckSquare} label="Tasks Done" value={`${stats.completedTasks}`} sub={`/${stats.totalTasks}`} />
            <StatCard icon={Clock} label="Time Studied" value={`${studiedHours}h`} sub="Total sessions" />
            <StatCard icon={TrendingUp} label="Progress" value={`${stats.completionRate}%`} sub={`${remainingHours}h remaining`} />
          </div>

          <div className="border border-border rounded-sm p-4 space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Syllabus completion</span>
              <span>{Math.round(stats.completedMinutes / 60)}h / {Math.round(stats.totalEstimatedMinutes / 60)}h</span>
            </div>
            <div className="h-2 bg-secondary rounded-sm overflow-hidden">
              <div className="h-full bg-primary rounded-sm transition-all duration-500 progress-glow" style={{ width: `${Math.min(stats.completionRate, 100)}%` }} />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>{stats.totalTasks - stats.completedTasks} tasks remaining</span>
              <span>{stats.completionRate >= 100 ? "✓ Complete" : `${100 - stats.completionRate}% left`}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <QuickActionCard title="Subjects" desc="Manage your IB subject selections" path="/dashboard/subjects" icon={BookOpen} />
            <QuickActionCard title="Syllabus" desc="Track topic completion per subject" path="/dashboard/syllabus" icon={CheckSquare} />
            <QuickActionCard title="Study Timer" desc="Track study sessions with precision" path="/dashboard/study" icon={Clock} />
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  sub 
}: { 
  icon: LucideIcon; 
  label: string; 
  value: string; 
  sub?: string; // this part is optional auf
}) {
  return (
    <div className="border border-border rounded-sm p-3 space-y-1 hover:border-primary/50 transition-colors">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon size={14} />
        <span className="text-[10px] uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-xl font-semibold text-primary">{value}</p>
      {sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}
    </div>
  );
}

function QuickActionCard({ 
  title, 
  desc, 
  path, 
  icon: Icon 
}: { 
  title: string; 
  desc: string; 
  path: string; 
  icon: LucideIcon;
}) {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate(path)} className="border border-border rounded-sm p-4 text-left space-y-2 hover:border-primary/50 hover:bg-accent/30 transition-all group">
      <Icon size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
      <p className="text-sm font-medium">$ cd {title.toLowerCase()}</p>
      <p className="text-xs text-muted-foreground">{desc}</p>
    </button>
  );
}
