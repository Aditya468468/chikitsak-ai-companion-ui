import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string, metadata: { first_name: string; last_name: string; role: string }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change event:", event);
      setSession(session);
      setUser(session?.user ?? null);

      if (event === 'SIGNED_IN') {
        // Only redirect if we're on a non-protected route
        if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup') {
          // Get user metadata from the session
          const userRole = session?.user?.user_metadata?.role || 'patient';
          console.log("User signed in with role:", userRole);
          
          if (userRole === 'doctor') {
            navigate('/doctor/dashboard');
          } else {
            navigate('/patient/dashboard');
          }
        }
      }

      if (event === 'SIGNED_OUT') {
        navigate('/');
      }
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Existing session:", session ? "Yes" : "No");
      setSession(session);
      setUser(session?.user ?? null);
      
      // Only redirect if we're on a non-protected route
      if (session?.user && (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup')) {
        const userRole = session.user.user_metadata?.role || 'patient';
        console.log("User already signed in with role:", userRole);
        
        if (userRole === 'doctor') {
          navigate('/doctor/dashboard');
        } else {
          navigate('/patient/dashboard');
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  const signUp = async (email: string, password: string, metadata: { first_name: string; last_name: string; role: string }) => {
    try {
      console.log("Signing up with metadata:", metadata);
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (error) {
        toast({
          title: "Error signing up",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      if (data) {
        console.log("Signup successful:", data);
        toast({
          title: "Success",
          description: "Please check your email to verify your account",
        });
      }
    } catch (error) {
      console.error("Error during signup:", error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Attempting to sign in with email:", email);
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Sign in error:", error);
        toast({
          title: "Error signing in",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      if (data) {
        console.log("Sign in successful:", data.user);
        toast({
          title: "Welcome back!",
          description: `You are now signed in as ${data.user.email}`,
        });
      }
    } catch (error) {
      console.error("Error during sign in:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log("Signing out...");
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Sign out error:", error);
        toast({
          title: "Error signing out",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      console.log("Sign out successful");
      toast({
        title: "Signed out",
        description: "You have been successfully signed out",
      });
    } catch (error) {
      console.error("Error during sign out:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
