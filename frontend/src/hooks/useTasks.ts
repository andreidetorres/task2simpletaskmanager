import { useState, useCallback } from "react";
import { Task } from "@/types/task";

function storageKey(user: string) {
  return `task-manager-tasks-${user}`;
}

function loadTasks(user: string): Task[] {
  try {
    const raw = localStorage.getItem(storageKey(user));
    if (!raw) return [];
    return JSON.parse(raw).map((t: any) => ({ ...t, createdAt: new Date(t.createdAt) }));
  } catch {
    return [];
  }
}

function saveTasks(user: string, tasks: Task[]) {
  localStorage.setItem(storageKey(user), JSON.stringify(tasks));
}

export function useTasks(user: string) {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks(user));

  const update = useCallback((updater: (prev: Task[]) => Task[]) => {
    setTasks((prev) => {
      const next = updater(prev);
      saveTasks(user, next);
      return next;
    });
  }, [user]);

  const addTask = useCallback((title: string) => {
    update((prev) => [
      { id: crypto.randomUUID(), title, completed: false, createdAt: new Date() },
      ...prev,
    ]);
  }, [update]);

  const toggleTask = useCallback((id: string) => {
    update((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }, [update]);

  const deleteTask = useCallback((id: string) => {
    update((prev) => prev.filter((t) => t.id !== id));
  }, [update]);

  const editTask = useCallback((id: string, title: string) => {
    update((prev) => prev.map((t) => (t.id === id ? { ...t, title } : t)));
  }, [update]);

  return { tasks, addTask, toggleTask, deleteTask, editTask };
}
