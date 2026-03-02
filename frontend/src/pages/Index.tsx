import { useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import { useAuth } from "@/hooks/useAuth";
import TaskInput from "@/components/TaskInput";
import TaskItem from "@/components/TaskItem";
import AuthForm from "@/components/AuthForm";
import { ClipboardList, LogOut, Search } from "lucide-react";

type Filter = "all" | "active" | "completed";

const Index = () => {
  const { currentUser, currentUserId, login, signup, logout } = useAuth();

  if (!currentUser) {
    return <AuthForm onLogin={login} onSignup={signup} />;
  }

  return <TaskDashboard user={currentUser} userId={currentUserId} onLogout={logout} />;
};

const TaskDashboard = ({ user, userId, onLogout }: { user: string; userId: string; onLogout: () => void }) => {
  const { tasks, addTask, toggleTask, deleteTask, editTask, setDeadline } = useTasks(userId);
  const [filter, setFilter] = useState<Filter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = tasks.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (filter === "active") return t.status === "active";
    if (filter === "completed") return t.status === "done";
    return true;
  });

  const activeCount = tasks.filter((t) => t.status === "active").length;

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "completed", label: "Done" },
  ];

  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-lg">
        <header className="mb-8 text-center relative">
          <button
            onClick={onLogout}
            className="absolute right-0 top-0 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <LogOut size={14} />
            Sign out
          </button>
          <div className="mb-3 inline-flex items-center justify-center rounded-xl bg-accent/10 p-3">
            <ClipboardList size={28} className="text-accent" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Tasks</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Hi {user} · {activeCount} task{activeCount !== 1 ? "s" : ""} remaining
          </p>

          <div className="mt-8 text-left mb-6">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search size={16} className="text-muted-foreground" />
              </div>
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-border bg-card py-2 pl-10 pr-4 text-sm text-card-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>
          </div>
        </header>

        <TaskInput onAdd={addTask} />

        <div className="mt-6 flex gap-1 rounded-lg bg-secondary p-1">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${filter === f.key
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-2">
          {filtered.length === 0 && (
            <p className="py-12 text-center text-sm text-muted-foreground">
              {filter === "all" ? "No tasks yet. Add one above!" : `No ${filter} tasks.`}
            </p>
          )}
          {filtered.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={toggleTask}
              onDelete={deleteTask}
              onEdit={editTask}
              onSetDeadline={setDeadline}   // ← add this
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
