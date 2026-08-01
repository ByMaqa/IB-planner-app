import { LogoDropdown } from "@/components/LogoDropdown";
import { cn } from "@/lib/utils";
import { BookOpen, CheckSquare, Clock, LayoutDashboard, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router";

const navItems = [
  { label: "dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "subjects", path: "/dashboard/subjects", icon: BookOpen },
  { label: "syllabus", path: "/dashboard/syllabus", icon: CheckSquare },
  { label: "study", path: "/dashboard/study", icon: Clock },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top status bar */}
      <header className="border-b border-border bg-sidebar px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-muted-foreground hover:text-foreground transition-colors" aria-label="Toggle sidebar">
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <LogoDropdown />
          <span className="text-xs text-muted-foreground hidden sm:inline-block">ib-planner@terminal:~$</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="hidden md:inline-block">{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        </div>
      </header>

      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <aside className={cn(
          "w-56 border-r border-border bg-sidebar flex-shrink-0 flex flex-col transition-transform duration-200",
          "fixed inset-y-0 left-0 top-[49px] z-40 lg:relative lg:top-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}>
          <nav className="flex-1 py-4 px-2 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-sm text-sm transition-all duration-150",
                    "hover:bg-accent hover:text-accent-foreground",
                    isActive ? "bg-primary/10 text-primary border-l-2 border-primary" : "text-muted-foreground border-l-2 border-transparent"
                  )}>
                  <Icon size={16} className="shrink-0" />
                  <span>{item.label}</span>
                  {isActive && <span className="ml-auto terminal-cursor text-xs" />}
                </Link>
              );
            })}
          </nav>
          <div className="px-4 py-3 border-t border-border">
            <p className="text-[10px] text-muted-foreground leading-relaxed">IB Planner v1.0.0<br />Type "help" for commands</p>
          </div>
        </aside>

        {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
