import { useState, useCallback, useEffect } from "react";
import { Task } from "@/types/task";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
const TOKEN_KEY = "task-manager-token";

export function useTasks(user: string) {
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setTasks(json.data.tasks.map((t: any) => ({
          ...t,
          id: t.id.toString(),
          createdAt: new Date(t.createdAt),
          deadline: t.deadline ? new Date(t.deadline) : null, // ← new
        })));
      }
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  }, []);

  useEffect(() => {
    if (user) fetchTasks();
  }, [user, fetchTasks]);

  // ── ADD TASK with optional deadline ──────────────────────────────────────
  const addTask = useCallback(async (title: string, deadline?: Date | null) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          deadline: deadline ? deadline.toISOString() : null, // ← new
        })
      });
      const json = await res.json();
      if (res.ok && json.success) {
        const newTask = {
          ...json.data.task,
          id: json.data.task.id.toString(),
          createdAt: new Date(json.data.task.createdAt),
          deadline: json.data.task.deadline ? new Date(json.data.task.deadline) : null, // ← new
        };
        setTasks((prev) => [newTask, ...prev]);
      }
    } catch (err) {
      console.error("Add task failed", err);
    }
  }, []);

  // ── SET DEADLINE on existing task ─────────────────────────────────────────
  const setDeadline = useCallback(async (id: string, deadline: Date | null) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;

    const previousTasks = [...tasks];
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, deadline } : t)));

    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ deadline: deadline ? deadline.toISOString() : null })
      });
      if (!res.ok) setTasks(previousTasks);
    } catch (err) {
      console.error("Set deadline failed", err);
      setTasks(previousTasks);
    }
  }, [tasks]);

  const toggleTask = useCallback(async (id: string) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    const taskToToggle = tasks.find(t => t.id === id);
    if (!taskToToggle) return;

    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: t.status === "active" ? "done" : "active" } : t)));

    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: taskToToggle.status === "active" ? "done" : "active" })
      });
      if (!res.ok) {
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: t.status === "active" ? "done" : "active" } : t)));
      }
    } catch (err) {
      console.error("Toggle task failed", err);
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: t.status === "active" ? "done" : "active" } : t)));
    }
  }, [tasks]);

  const deleteTask = useCallback(async (id: string) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    const previousTasks = [...tasks];
    setTasks((prev) => prev.filter((t) => t.id !== id));

    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) setTasks(previousTasks);
    } catch (err) {
      console.error("Delete task failed", err);
      setTasks(previousTasks);
    }
  }, [tasks]);

  const editTask = useCallback(async (id: string, title: string) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    const previousTasks = [...tasks];
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, title } : t)));

    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title })
      });
      if (!res.ok) setTasks(previousTasks);
    } catch (err) {
      console.error("Edit task failed", err);
      setTasks(previousTasks);
    }
  }, [tasks]);

  return { tasks, addTask, toggleTask, deleteTask, editTask, setDeadline };
}