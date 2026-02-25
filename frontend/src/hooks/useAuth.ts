import { useState, useCallback } from "react";

const SESSION_KEY = "task-manager-session";
const USERS_KEY = "task-manager-users";
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

type User = { username: string; password: string };

function getLocalUsers(): User[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveLocalUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<string | null>(() =>
    localStorage.getItem(SESSION_KEY)
  );

  const login = useCallback(async (username: string, password: string): Promise<string | null> => {
    // Try backend first
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem(SESSION_KEY, data.username);
        setCurrentUser(data.username);
        return null;
      }
      // Backend responded but with an error
      return data?.error || 'Login failed.';
    } catch (err: any) {
      // Network error -> fallback to local storage
      const users = getLocalUsers();
      const user = users.find((u) => u.username === username);
      if (!user) return 'Account not found (and backend unreachable).';
      if (user.password !== password) return 'Incorrect password.';
      localStorage.setItem(SESSION_KEY, username);
      setCurrentUser(username);
      return null;
    }
  }, []);

  const signup = useCallback(async (username: string, password: string): Promise<string | null> => {
    if (username.length < 3) return 'Username must be at least 3 characters.';
    if (password.length < 4) return 'Password must be at least 4 characters.';
    // Try backend first
    try {
      const res = await fetch(`${API_BASE}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem(SESSION_KEY, data.username);
        setCurrentUser(data.username);
        return null;
      }
      return data?.error || 'Signup failed.';
    } catch (err) {
      // Network error -> fallback to local storage signup
      const users = getLocalUsers();
      if (users.find((u) => u.username === username)) return 'Username already registered (local).';
      users.push({ username, password });
      saveLocalUsers(users);
      localStorage.setItem(SESSION_KEY, username);
      setCurrentUser(username);
      return null;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setCurrentUser(null);
  }, []);

  return { currentUser, login, signup, logout };
}
