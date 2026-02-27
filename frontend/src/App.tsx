
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import AuthForm from "@/components/AuthForm";
import Index from "./pages/Index";

const queryClient = new QueryClient();

const App = () => {
  const { currentUser, login, signup } = useAuth();
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {/* Always show AuthForm if not logged in, regardless of route */}
        {!currentUser ? (
          <AuthForm onLogin={login} onSignup={signup} />
        ) : (
          <Index />
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
