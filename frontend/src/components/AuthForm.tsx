import { useState } from "react";
import { LogIn, UserPlus } from "lucide-react";

interface AuthFormProps {
  onLogin: (username: string, password: string) => Promise<string | null>;
  onSignup: (username: string, password: string) => Promise<string | null>;
}

const AuthForm = ({ onLogin, onSignup }: AuthFormProps) => {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = isSignup
      ? await onSignup(username.trim(), password)
      : await onLogin(username.trim(), password);
    setLoading(false);
    if (result) setError(result);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-8 shadow-sm">
        <h1 className="text-xl font-bold text-center text-foreground mb-1">
          {isSignup ? "Create Account" : "Sign In"}
        </h1>
        <p className="text-sm text-muted-foreground text-center mb-6">
          {isSignup ? "Sign up to start managing tasks" : "Welcome back"}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => { setUsername(e.target.value); setError(""); }}
            className="rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            className="rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-3 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {isSignup ? <UserPlus size={16} /> : <LogIn size={16} />}
            {isSignup ? (loading ? "Signing up..." : "Sign Up") : (loading ? "Signing in..." : "Sign In")}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => { setIsSignup(!isSignup); setError(""); }}
            className="text-accent font-medium hover:underline"
          >
            {isSignup ? "Sign in" : "Sign up"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
