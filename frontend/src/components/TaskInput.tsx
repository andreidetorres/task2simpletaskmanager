import { useState } from "react";
import { Plus } from "lucide-react";

interface TaskInputProps {
  onAdd: (title: string) => void;
}

const TaskInput = ({ onAdd }: TaskInputProps) => {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Add a new task..."
        className="flex-1 rounded-lg border border-border bg-card px-4 py-3 text-sm text-card-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
      />
      <button
        type="submit"
        className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-3 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 active:opacity-80"
      >
        <Plus size={16} />
        Add
      </button>
    </form>
  );
};

export default TaskInput;
