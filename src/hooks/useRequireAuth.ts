
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function useRequireAuth(role?: "patient" | "doctor") {
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      if (session === null) {
        // User is definitely not logged in
        setIsAuthenticated(false);
        navigate("/login");
        return;
      }

      if (session) {
        // User is logged in
        if (role) {
          // Check if user has the correct role
          const userRole = session.user?.user_metadata?.role;
          if (userRole && userRole !== role) {
            // Redirect to appropriate dashboard if role mismatch
            setIsAuthenticated(false);
            navigate(userRole === "doctor" ? "/doctor/dashboard" : "/patient/dashboard");
            return;
          }
        }
        setIsAuthenticated(true);
      }
    };

    // Only run the check if we have definitive session info
    if (session !== undefined) {
      checkAuth();
    }
  }, [session, navigate, role]);

  return { user, session, isAuthenticated };
}
