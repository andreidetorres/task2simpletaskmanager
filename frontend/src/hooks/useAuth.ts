import { useState, useCallback } from "react";

interface User {
  username: string;
  password: string;
}

const USERS_KEY = "task-manager-users";
const SESSION_KEY = "task-manager-session";

function getUsers(): User[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<string | null>(() =>
    localStorage.getItem(SESSION_KEY)
  );

  const login = useCallback((username: string, password: string): string | null => {
    const users = getUsers();
    const user = users.find((u) => u.username === username);
    if (!user) return "Account not found.";
    if (user.password !== password) return "Incorrect password.";
    localStorage.setItem(SESSION_KEY, username);
    setCurrentUser(username);
    return null;
  }, []);

  const signup = useCallback((username: string, password: string): string | null => {
    if (username.length < 3) return "Username must be at least 3 characters.";
    if (password.length < 4) return "Password must be at least 4 characters.";
    const users = getUsers();
    if (users.find((u) => u.username === username)) return "Username already taken.";
    saveUsers([...users, { username, password }]);
    localStorage.setItem(SESSION_KEY, username);
    setCurrentUser(username);
    return null;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setCurrentUser(null);
  }, []);

  return { currentUser, login, signup, logout };
}
