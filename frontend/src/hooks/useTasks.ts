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
          id: t.id.toString(), // Must map database ID number to frontend ID string
          createdAt: new Date(t.createdAt)
        })));
      }
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  }, []);

  // Fetch immediately upon mount when user is known
  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user, fetchTasks]);

  const addTask = useCallback(async (title: string) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title })
      });
      const json = await res.json();
      if (res.ok && json.success) {
        const newTask = {
          ...json.data.task,
          id: json.data.task.id.toString(),
          createdAt: new Date(json.data.task.createdAt)
        };
        setTasks((prev) => [newTask, ...prev]);
      }
    } catch (err) {
      console.error("Add task failed", err);
    }
  }, []);

  const toggleTask = useCallback(async (id: string) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    const taskToToggle = tasks.find(t => t.id === id);
    if (!taskToToggle) return;

    // Optistic UI update
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));

    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        // send backend the expected value
        body: JSON.stringify({ completed: !taskToToggle.completed })
      });
      if (!res.ok) {
        // Revert UI if failure
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
      }
    } catch (err) {
      console.error("Toggle task failed", err);
      // Revert UI if failure
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
    }
  }, [tasks]);

  const deleteTask = useCallback(async (id: string) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    // Optimistic UI update
    const previousTasks = [...tasks];
    setTasks((prev) => prev.filter((t) => t.id !== id));

    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        setTasks(previousTasks);
      }
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
      if (!res.ok) {
        setTasks(previousTasks);
      }
    } catch (err) {
      console.error("Edit task failed", err);
      setTasks(previousTasks);
    }
  }, [tasks]);

  return { tasks, addTask, toggleTask, deleteTask, editTask };
}
