import { useState, useCallback } from "react";

const SESSION_KEY = "task-manager-session"; // stores userId
const SESSION_USER_KEY = "task-manager-session-email"; // stores email
const TOKEN_KEY = "task-manager-token";
const USERS_KEY = "task-manager-users";
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

type User = { email: string; password: string };

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
    localStorage.getItem(SESSION_USER_KEY)
  );
  const [currentUserId, setCurrentUserId] = useState<string | null>(() =>
    localStorage.getItem(SESSION_KEY)
  );

  const login = useCallback(async (email: string, password: string): Promise<string | null> => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem(SESSION_KEY, data.data.user.id.toString());
        localStorage.setItem(SESSION_USER_KEY, data.data.user.email);
        localStorage.setItem(TOKEN_KEY, data.data.token);
        setCurrentUser(data.data.user.email);
        setCurrentUserId(data.data.user.id.toString());
        return null;
      }
      return data?.message || 'Login failed.';
    } catch (err: any) {
      const users = getLocalUsers();
      const user = users.find((u) => u.email === email);
      if (!user) return 'Account not found (and backend unreachable).';
      if (user.password !== password) return 'Incorrect password.';
      localStorage.setItem(SESSION_KEY, email);
      localStorage.setItem(SESSION_USER_KEY, email);
      setCurrentUser(email);
      setCurrentUserId(email);
      return null;
    }
  }, []);

  const signup = useCallback(async (email: string, password: string): Promise<string | null> => {
    if (email.length < 3) return 'Email must be at least 3 characters.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem(SESSION_KEY, data.data.user.id.toString());
        localStorage.setItem(SESSION_USER_KEY, data.data.user.email);
        localStorage.setItem(TOKEN_KEY, data.data.token);
        setCurrentUser(data.data.user.email);
        setCurrentUserId(data.data.user.id.toString());
        return null;
      }
      return data?.message || 'Signup failed.';
    } catch (err) {
      const users = getLocalUsers();
      if (users.find((u) => u.email === email)) return 'Email already registered (local).';
      users.push({ email, password });
      saveLocalUsers(users);
      localStorage.setItem(SESSION_KEY, email);
      localStorage.setItem(SESSION_USER_KEY, email);
      setCurrentUser(email);
      setCurrentUserId(email);
      return null;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setCurrentUser(null);
    setCurrentUserId(null);
  }, []);

  return { currentUser, currentUserId, login, signup, logout };
}