import { useState } from "react";
import { Task } from "@/types/task";
import { Check, Pencil, Trash2, X } from "lucide-react";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string) => void;
}

const TaskItem = ({ task, onToggle, onDelete, onEdit }: TaskItemProps) => {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.title);

  const handleSave = () => {
    const trimmed = editValue.trim();
    if (trimmed) {
      onEdit(task.id, trimmed);
    }
    setEditing(false);
  };

  return (
    <div className="group flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-shadow hover:shadow-sm">
      <button
        onClick={() => onToggle(task.id)}
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${task.completed
            ? "border-accent bg-accent text-accent-foreground"
            : "border-muted-foreground/40 hover:border-accent"
          }`}
      >
        {task.completed && <Check size={12} strokeWidth={3} />}
      </button>

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
          <span
            className={`text-sm transition-colors ${task.completed ? "text-muted-foreground line-through" : "text-card-foreground"
              }`}
          >
            {task.title}
          </span>
          <span className="text-xs text-muted-foreground">
            {task.createdAt.toLocaleString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
      )}

      {!editing && (
        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
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
