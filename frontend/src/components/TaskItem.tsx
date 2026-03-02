import { useState } from "react";
import { Task } from "@/types/task";
import { Check, Pencil, Trash2, Calendar } from "lucide-react";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string) => void;
  onSetDeadline: (id: string, deadline: Date | null) => void;
}

const TaskItem = ({ task, onToggle, onDelete, onEdit, onSetDeadline }: TaskItemProps) => {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.title);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pendingDeadline, setPendingDeadline] = useState("");

  const formatForInputWithTime = (date: Date | null) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const mins = String(d.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${mins}`;
  };

  const handleOpenDatePicker = () => {
    setPendingDeadline(formatForInputWithTime(task.deadline));
    setShowDatePicker((prev) => !prev);
  };

  const now = new Date();
  const isOverdue = task.deadline && task.status !== "done" && new Date(task.deadline) < now;

  const handleSave = () => {
    const trimmed = editValue.trim();
    if (trimmed) onEdit(task.id, trimmed);
    setEditing(false);
  };

  const handleDeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPendingDeadline(e.target.value);
  };

  const handleDeadlineConfirm = () => {
    if (pendingDeadline) {
      onSetDeadline(task.id, new Date(pendingDeadline));
    } else {
      onSetDeadline(task.id, null);
    }
    setShowDatePicker(false);
    setPendingDeadline("");
  };

  const handleDeadlineClear = () => {
    onSetDeadline(task.id, null);
    setShowDatePicker(false);
    setPendingDeadline("");
  };

  return (
    <div className={`group flex items-center gap-3 rounded-lg border p-3 transition-shadow hover:shadow-sm ${isOverdue ? "border-red-300 bg-red-50" : "border-border bg-card"
      }`}>

      {/* ── Checkbox ── */}
      <button
        onClick={() => onToggle(task.id)}
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${task.status === "done"
          ? "border-accent bg-accent text-accent-foreground"
          : "border-muted-foreground/40 hover:border-accent"
          }`}
      >
        {task.status === "done" && <Check size={12} strokeWidth={3} />}
      </button>

      {/* ── Title / Edit mode ── */}
      {editing ? (
        <form
          onSubmit={(e) => { e.preventDefault(); handleSave(); }}
          className="flex flex-1 gap-2"
        >
          <input
            autoFocus
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            className="flex-1 rounded border border-border bg-background px-2 py-1 text-sm outline-none focus:border-accent"
          />
        </form>
      ) : (
        <div className="flex flex-1 flex-col">
          <span className={`text-sm transition-colors ${task.status === "done"
            ? "text-muted-foreground line-through"
            : isOverdue
              ? "text-red-600 font-medium"
              : "text-card-foreground"
            }`}>
            {task.title}
          </span>

          {/* Created at */}
          <span className="text-xs text-muted-foreground">
            {task.createdAt.toLocaleString(undefined, {
              year: "numeric", month: "short", day: "numeric",
              hour: "2-digit", minute: "2-digit",
            })}
          </span>

          {/* Deadline display */}
          {task.deadline && (
            <span className={`text-xs font-medium mt-0.5 ${isOverdue ? "text-red-500" : "text-orange-500"
              }`}>
              {isOverdue ? "⚠ Overdue · " : "📅 Due "}
              {new Date(task.deadline).toLocaleString(undefined, {
                year: "numeric", month: "short", day: "numeric",
                hour: "2-digit", minute: "2-digit",
              })}
            </span>
          )}

          {/* Date picker */}
          {showDatePicker && (
            <div className="mt-2 flex flex-col gap-2 rounded-lg border border-border bg-background p-3 shadow-md w-fit">
              <span className="text-xs font-medium text-muted-foreground">Set Deadline</span>
              <input
                type="datetime-local"
                autoFocus
                value={pendingDeadline}
                onChange={handleDeadlineChange}
                className="rounded border border-border bg-card px-2 py-1.5 text-xs outline-none focus:border-accent"
              />
              <div className="flex gap-2">
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleDeadlineConfirm}
                  className="flex-1 rounded bg-accent px-3 py-1.5 text-xs font-medium text-white hover:bg-accent/90"
                >
                  Set Deadline
                </button>
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleDeadlineClear}
                  className="rounded border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-secondary"
                >
                  Clear
                </button>
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setShowDatePicker(false)}
                  className="rounded border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Action buttons ── */}
      {!editing && (
        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={handleOpenDatePicker}
            className={`rounded p-1.5 transition-colors hover:bg-secondary ${task.deadline
              ? isOverdue ? "text-red-500" : "text-orange-400"
              : "text-muted-foreground hover:text-foreground"
              }`}
            title={task.deadline ? "Change deadline" : "Set deadline"}
          >
            <Calendar size={14} />
          </button>

          <button
            onClick={() => { setEditValue(task.title); setEditing(true); }}
            className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Pencil size={14} />
          </button>

          <button
            onClick={() => onDelete(task.id)}
            className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskItem;